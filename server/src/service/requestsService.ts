import { NatsClient } from "../nats";

export type RequestsService = ReturnType<typeof requestsService>;

export function requestsService(nats: NatsClient) {
  return {
    async sendRequest(subject: string, data?: unknown) {
      return nats.request(subject, data);
    },
  };
}
