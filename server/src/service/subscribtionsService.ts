import { nanoid } from "nanoid";
import { NatsClient } from "../nats";
import { WebsocketBroadcaster } from "../websocket/broadcaster";

export type SubscribtionsService = ReturnType<typeof subscribtionsService>;

export function subscribtionsService(
  nats: NatsClient,
  websocket: WebsocketBroadcaster
) {
  const currentSubscribtions = new Set<string>();

  return {
    allSubscribtions() {
      return [...currentSubscribtions.values()];
    },
    createSubscribtion(subject: string) {
      if (currentSubscribtions.has(subject)) {
        throw new Error(`Already have '${subject}' subscribed`);
      }

      currentSubscribtions.add(subject);

      nats.subCallback(subject, ({ data }) => {
        websocket.subMessage({ id: nanoid(), data });
      });
    },
    deleteSubscribtion(subject: string) {
      if (!currentSubscribtions.has(subject)) {
        throw new Error(`No subscribtion for subject ${subject}`);
      }

      currentSubscribtions.delete(subject);
    },
  };
}
