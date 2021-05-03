import { Codec, NatsConnection, NatsError } from "nats";

export type NatsClient = ReturnType<typeof createNatsClient>;

type SubscribtionCallback<Data> = (payload: {
  error: NatsError | null;
  data: Data;
}) => void;

export function createNatsClient(conn: NatsConnection, codec: Codec<unknown>) {
  return {
    subCallback<Data>(subject: string, cb: SubscribtionCallback<Data>) {
      return conn.subscribe(subject, {
        callback: (error, msg) =>
          cb({ error, data: codec.decode(msg.data) as Data }),
      });
    },
  };
}
