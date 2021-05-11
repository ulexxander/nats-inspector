import { nanoid } from "nanoid";
import { Subscription } from "nats";
import { NatsSub } from "../../../shared/types";
import { NatsClient } from "../nats/natsClient";
import { mmap } from "../utils";
import { WebsocketBroadcaster } from "../websocket/broadcaster";

type NatsSubData = {
  subscription: Subscription;
  dateCreated: string;
};

export class SubscriptionsService {
  private currentSubs: Map<string, NatsSubData> = new Map();

  constructor(
    private readonly natsClient: NatsClient,
    private readonly websocket: WebsocketBroadcaster,
  ) {}

  allSubscriptions(): NatsSub[] {
    return mmap(this.currentSubs, (subject, { dateCreated }) => ({
      subject,
      dateCreated,
    }));
  }

  createSubscription(server: string, subject: string): NatsSub {
    if (this.currentSubs.has(subject)) {
      throw new Error(`Already have '${subject}' subscribed`);
    }

    const subscription = this.natsClient.subscription(
      server,
      subject,
      ({ data, msg }) => {
        this.websocket.send({
          type: "SUB_MESSAGE",
          payload: {
            id: nanoid(),
            subject: msg.subject,
            data,
          },
        });
      },
    );

    const newSub: NatsSubData = {
      subscription,
      dateCreated: new Date().toISOString(),
    };

    this.currentSubs.set(subject, newSub);

    return { subject, dateCreated: newSub.dateCreated };
  }

  deleteSubscription(subject: string): NatsSub {
    const sub = this.currentSubs.get(subject);

    if (!sub) {
      throw new Error(`No subscription for subject ${subject}`);
    }

    sub.subscription.unsubscribe();

    this.currentSubs.delete(subject);

    return { subject, dateCreated: sub.dateCreated };
  }
}
