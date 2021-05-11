import { ConnectionStructure, Database } from "../database/databaseTypedefs";
import { NatsClient } from "../nats/natsClient";

export type CreateConnectionInput = Omit<
  ConnectionStructure,
  "dateCreated" | "dateUpdated"
>;

export class ConnectionsService {
  constructor(
    private readonly natsClient: NatsClient,
    private readonly database: Database,
  ) {}

  async createConnection(input: CreateConnectionInput) {
    await this.natsClient.addConnection(
      input.server.host + ":" + input.server.port,
    );

    const createdConn: ConnectionStructure = {
      ...input,
      dateCreated: new Date().toISOString(),
    };

    this.database.get("connections").push(createdConn);
    this.database.save();

    return createdConn;
  }

  getConnections() {
    return this.database.get("connections");
  }
}
