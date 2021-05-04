import { nanoid } from "nanoid";
import { Subscription } from "nats";
import { NatsSub } from "../../../shared/types";
import { NatsClient } from "../nats";
import { mmap } from "../utils";
import { WebsocketBroadcaster } from "../websocket/broadcaster";

export type SubscribtionsService = ReturnType<typeof subscribtionsService>;

type NatsSubData = {
  subscribtion: Subscription;
  dateCreated: string;
};

export function subscribtionsService(
  nats: NatsClient,
  websocket: WebsocketBroadcaster
) {
  const currentSubs = new Map<string, NatsSubData>();

  return {
    allSubscribtions(): NatsSub[] {
      return mmap(currentSubs, (subject, { dateCreated }) => ({
        subject,
        dateCreated,
      }));
    },
    createSubscribtion(subject: string): NatsSub {
      if (currentSubs.has(subject)) {
        throw new Error(`Already have '${subject}' subscribed`);
      }

      const subscribtion = nats.subscribtion(subject, ({ data, msg }) => {
        websocket.send({
          type: "SUB_MESSAGE",
          payload: {
            id: nanoid(),
            subject: msg.subject,
            data,
          },
        });
      });

      const newSub: NatsSubData = {
        subscribtion,
        dateCreated: new Date().toISOString(),
      };

      currentSubs.set(subject, newSub);

      return { subject, dateCreated: newSub.dateCreated };
    },
    deleteSubscribtion(subject: string): NatsSub {
      const sub = currentSubs.get(subject);

      if (!sub) {
        throw new Error(`No subscribtion for subject ${subject}`);
      }

      sub.subscribtion.unsubscribe();

      currentSubs.delete(subject);

      return { subject, dateCreated: sub.dateCreated };
    },
  };
}
