import { ConnectionModel } from "../database/models";
import { DatabaseQueries } from "../database/queries";
import { NatsClient } from "../nats/natsClient";

export type CreateConnectionInput = Pick<
  ConnectionModel,
  "title" | "description" | "host" | "port"
>;

export class ConnectionsService {
  constructor(
    private readonly natsClient: NatsClient,
    private readonly db: DatabaseQueries,
  ) {}

  async createConnection(input: CreateConnectionInput) {
    await this.natsClient.addConnection(input.host + ":" + input.port);

    const createdConn = this.db.insertConnection({
      title: input.title,
      description: input.description,
      host: input.host,
      port: input.port,
    });

    return createdConn;
  }

  getConnections() {
    return this.db.selectAllConnections();
  }
}
