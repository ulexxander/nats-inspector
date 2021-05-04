import { Codec, Msg, NatsConnection, NatsError } from "nats";

export type NatsClient = ReturnType<typeof createNatsClient>;

type SubscribtionCallback<Data> = (payload: {
  error: NatsError | null;
  data: Data;
  msg: Msg;
}) => void;

export function createNatsClient(conn: NatsConnection, codec: Codec<unknown>) {
  return {
    subscribtion<Output>(subject: string, cb: SubscribtionCallback<Output>) {
      return conn.subscribe(subject, {
        callback: (error, msg) =>
          cb({ error, data: codec.decode(msg.data) as Output, msg }),
      });
    },

    async request<Input, Output>(subject: string, input?: Input) {
      const response = await conn.request(
        subject,
        input ? codec.encode(input) : undefined
      );

      return {
        subject: response.subject,
        reply: codec.decode(response.data) as Output,
      };
    },
  };
}
