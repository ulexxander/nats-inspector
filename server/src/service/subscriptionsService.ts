import { nanoid } from "nanoid";
import { Subscription } from "nats";
import type {
  DeleteSubscriptionVars,
  InsertSubscriptionVars,
  SubscriptionModel,
} from "../../../shared/types";
import { DatabaseQueries } from "../database/queries";
import { errText } from "../utils/errors";
import { mapTransform } from "../utils/maps";
import { WebsocketBroadcaster } from "../websocket/broadcaster";
import { ConnectionsService } from "./connectionsService";
import { NatsService } from "./natsService";

export type PausedSubscription = {
  model: SubscriptionModel;
};

export type ActiveSubscription = {
  model: SubscriptionModel;
  nats: Subscription;
};

export class SubscriptionsService {
  subjects: Set<string> = new Set();
  activeSubs: Map<number, ActiveSubscription> = new Map();
  pausedSubs: Map<number, SubscriptionModel> = new Map();

  constructor(
    private readonly connectionsService: ConnectionsService,
    private readonly natsService: NatsService,
    private readonly websocket: WebsocketBroadcaster,
    private readonly db: DatabaseQueries,
  ) {}

  addSubscription(model: SubscriptionModel) {
    const conn = this.connectionsService.mustGetNatsConnection(
      model.connectionId,
    );

    this.subjects.add(model.subject);

    const natsSub = this.natsService.subscription(
      conn,
      model,
      ({ error, data, msg }) => {
        if (error) {
          this.websocket.send({
            t: "SUBSCRIPTION_ERR",
            p: {
              id: nanoid(),
              subject: msg.subject,
              error: errText(error),
            },
          });
          return;
        }

        this.websocket.send({
          t: "SUBSCRIPTION_MSG",
          p: {
            id: nanoid(),
            subject: msg.subject,
            data,
          },
        });
      },
    );

    this.activeSubs.set(model.id, {
      model,
      nats: natsSub,
    });
  }

  createSubscription(input: InsertSubscriptionVars): SubscriptionModel {
    if (this.subjects.has(input.subject)) {
      throw new Error(`Already subscribed on ${input.subject}`);
    }

    const insertedSubscription = this.db.insertSubscription(input);
    this.addSubscription(insertedSubscription);

    return insertedSubscription;
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
      throw new Error(`No subscribtion with id ${id}`);
    }

    const deletedSub = this.db.deleteSubscription(input);
    this.subjects.delete(deletedSub.subject);

    return deletedSub;
  }

  getActiveList(): SubscriptionModel[] {
    return mapTransform(this.activeSubs, (_subject, { model }) => model);
  }

  getPausedList(): SubscriptionModel[] {
    return mapTransform(this.pausedSubs, (_subject, sub) => sub);
  }
}
