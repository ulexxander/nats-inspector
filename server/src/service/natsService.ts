import { nanoid } from "nanoid";
import { Codec, Msg, NatsConnection, NatsError, Subscription } from "nats";
import type {
  InsertSubscriptionVars,
  SendRequestInput,
  SendRequestOutput,
} from "../../../shared/types";

export type SubscriptionCallback = (payload: {
  error: NatsError | null;
  data: string;
  msg: Msg;
}) => void;

export class NatsService {
  constructor(private readonly codec: Codec<string>) {}

  subscription(
    conn: NatsConnection,
    input: InsertSubscriptionVars,
    cb: SubscriptionCallback,
  ): Subscription {
    return conn.subscribe(input.subject, {
      callback: (error, msg) =>
        cb({ error, data: this.codec.decode(msg.data), msg }),
    });
  }

  async request(
    conn: NatsConnection,
    input: SendRequestInput,
  ): Promise<SendRequestOutput> {
    const response = await conn.request(
      input.subject,
      input.payload ? this.codec.encode(input.payload) : undefined,
    );

    return {
      id: nanoid(),
      response: this.codec.decode(response.data),
      dateCreated: new Date().toISOString(),
    };
  }
}
