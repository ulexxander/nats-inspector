import {
  Codec,
  connect as natsConnect,
  Msg,
  NatsConnection,
  NatsError,
  Subscription,
} from "nats";

export type SubscriptionCallback<Data> = (payload: {
  error: NatsError | null;
  data: Data;
  msg: Msg;
}) => void;

export type RequestResult<Output> = {
  subject: string;
  data: Output;
};

export class NatsClient {
  // host:port => conn
  connections: Map<string, NatsConnection> = new Map();

  constructor(private readonly codec: Codec<unknown>) {}

  subscription<Output>(
    server: string,
    subject: string,
    cb: SubscriptionCallback<Output>,
  ): Subscription {
    const conn = this.getConnection(server);
    return conn.subscribe(subject, {
      callback: (error, msg) =>
        cb({ error, data: this.codec.decode(msg.data) as Output, msg }),
    });
  }

  async request<Input, Output>(
    server: string,
    subject: string,
    input?: Input,
  ): Promise<RequestResult<Output>> {
    const conn = this.getConnection(server);
    const response = await conn.request(
      subject,
      input ? this.codec.encode(input) : undefined,
    );

    return {
      subject: response.subject,
      data: this.codec.decode(response.data) as Output,
    };
  }

  async addConnection(server: string): Promise<NatsConnection> {
    if (this.connections.has(server)) {
      throw new Error(`Already have nats connection with server ${server}`);
    }

    const conn = await natsConnect({
      servers: server,
    });

    this.connections.set(server, conn);

    return conn;
  }

  private getConnection(server: string): NatsConnection {
    const conn = this.connections.get(server);
    if (!conn) {
      throw new Error(`No nats connection estabilished for server ${server}`);
    }
    return conn;
  }
}
