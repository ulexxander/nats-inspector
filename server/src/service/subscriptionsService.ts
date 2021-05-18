import { nanoid } from "nanoid";
import { Subscription } from "nats";
import type {
  ActiveSubscription as ActiveSubscriptionBase,
  DeleteSubscriptionVars,
  IdInput,
  InsertSubscriptionVars,
  PausedSubscription,
  SubscriptionModel,
} from "../../../shared/types";
import { DatabaseQueries } from "../database/queries";
import { errText } from "../utils/errors";
import { mapTransform, mapValues } from "../utils/maps";
import { isoTimestamp } from "../utils/time";
import { WebsocketBroadcaster } from "../websocket/broadcaster";
import { ConnectionsService } from "./connectionsService";
import { NatsService } from "./natsService";

export type ActiveSubscription = ActiveSubscriptionBase & {
  nats: Subscription;
};

export class SubscriptionsService {
  private subjects: Set<string> = new Set();
  private activeSubs: Map<number, ActiveSubscription> = new Map();
  private pausedSubs: Map<number, PausedSubscription> = new Map();

  constructor(
    private readonly connectionsService: ConnectionsService,
    private readonly natsService: NatsService,
    private readonly websocket: WebsocketBroadcaster,
    private readonly db: DatabaseQueries,
  ) {}

  private makeSubscription(model: SubscriptionModel): Subscription {
    const conn = this.connectionsService.mustGetNatsConnection(
      model.connectionId,
    );

    return this.natsService.subscription(
      conn,
      model,
      ({ error, data, msg }) => {
        if (error) {
          this.websocket.send({
            t: "SUBSCRIPTION_ERR",
            p: {
              subscriptionId: model.id,
              error: errText(error),
              timestamp: isoTimestamp(),
            },
          });
          return;
        }

        this.websocket.send({
          t: "SUBSCRIPTION_MSG",
          p: {
            messageId: nanoid(),
            subscriptionId: model.id,
            subjectFull: msg.subject,
            data,
            timestamp: isoTimestamp(),
          },
        });
      },
    );
  }

  addActiveSubscription(model: SubscriptionModel) {
    const natsSub = this.makeSubscription(model);
    this.subjects.add(model.subject);
    this.activeSubs.set(model.id, { type: "active", model, nats: natsSub });
  }

  addPausedSubscription(model: SubscriptionModel) {
    this.subjects.add(model.subject);
    this.pausedSubs.set(model.id, { type: "paused", model });
  }

  createSubscription(input: InsertSubscriptionVars): SubscriptionModel {
    if (this.subjects.has(input.subject)) {
      throw new Error(`Already subscribed on ${input.subject}`);
    }

    const insertedSubscription = this.db.insertSubscription(input);
    this.addActiveSubscription(insertedSubscription);

    return insertedSubscription;
  }

  pauseSubscription({ id }: IdInput): SubscriptionModel {
    const activeSub = this.activeSubs.get(id);
    if (!activeSub) {
      throw new Error(`No active subscription with id ${id}`);
    }
    const { model } = activeSub;
    activeSub.nats.unsubscribe();

    this.activeSubs.delete(id);
    this.pausedSubs.set(id, { type: "paused", model });
    return model;
  }

  resumeSubscription({ id }: IdInput): SubscriptionModel {
    const pausedSub = this.pausedSubs.get(id);
    if (!pausedSub) {
      throw new Error(`No paused subscription with id ${id}`);
    }
    const { model } = pausedSub;
    const natsSub = this.makeSubscription(model);

    this.pausedSubs.delete(id);
    this.activeSubs.set(id, { type: "active", model, nats: natsSub });
    return model;
  }

  deleteSubscription(input: DeleteSubscriptionVars): SubscriptionModel {
    const { id } = input;
    const activeSub = this.activeSubs.get(id);

    if (activeSub) {
      activeSub.nats.unsubscribe();
      this.activeSubs.delete(id);
    } else if (this.pausedSubs.has(id)) {
      this.pausedSubs.delete(id);
    } else {
      throw new Error(`No subscription with id ${id}`);
    }

    const deletedSub = this.db.deleteSubscription(input);
    this.subjects.delete(deletedSub.subject);

    return deletedSub;
  }

  getActiveList(): ActiveSubscriptionBase[] {
    return mapTransform(this.activeSubs, (_subject, { model }) => ({
      type: "active",
      model,
    }));
  }

  getPausedList(): PausedSubscription[] {
    return mapValues(this.pausedSubs);
  }
}
