import { connect as natsConnect, NatsConnection } from "nats";
import type {
  ActiveConnection as ActiveConnectionBase,
  ConnectionModel,
  DeleteConnectionVars,
  InsertConnectionVars,
  PausedConnection,
} from "../../../shared/types";
import { DatabaseQueries } from "../database/queries";
import { l } from "../modules/logs";
import { errText } from "../utils/errors";
import { mapTransform, mapValues } from "../utils/maps";
import { address } from "../utils/texts";

export type ActiveConnection = ActiveConnectionBase & {
  nats: NatsConnection;
};

export class ConnectionsService {
  private activeConnections: Map<number, ActiveConnection> = new Map();
  private pausedConnections: Map<number, PausedConnection> = new Map();

  constructor(private readonly db: DatabaseQueries) {}

  async addConnection(model: ConnectionModel): Promise<void> {
    const { id } = model;
    if (this.activeConnections.has(id) || this.pausedConnections.has(id)) {
      throw new Error(`Already have nats connection with id ${id}`);
    }

    let conn: NatsConnection;
    try {
      conn = await natsConnect({
        servers: address(model),
      });
    } catch (err) {
      this.pausedConnections.set(id, {
        model,
        error: { message: errText(err), timestamp: new Date().toISOString() },
      });
      return;
    }

    this.activeConnections.set(id, { model, nats: conn });
  }

  async createConnection(
    input: InsertConnectionVars,
  ): Promise<ConnectionModel> {
    const insertedConn = this.db.insertConnection(input);
    l({
      msg: "Creating nats connection",
      server: address(insertedConn),
    });

    await this.addConnection(insertedConn);

    return insertedConn;
  }

  async deleteConnection(
    input: DeleteConnectionVars,
  ): Promise<ConnectionModel> {
    const { id } = input;
    const activeConn = this.activeConnections.get(id);

    if (activeConn) {
      activeConn.nats.close();
      this.activeConnections.delete(id);
    } else if (this.pausedConnections.has(id)) {
      this.pausedConnections.delete(id);
    } else {
      throw new Error(`No connection with id ${id}`);
    }

    const deletedConn = this.db.deleteConnection(input);
    return deletedConn;
  }

  mustGetNatsConnection(connectionId: number): NatsConnection {
    const conn = this.activeConnections.get(connectionId);
    if (!conn) {
      throw new Error(
        `No nats connection estabilished with id ${connectionId}`,
      );
    }
    return conn.nats;
  }

  getActiveList(): ActiveConnectionBase[] {
    return mapTransform(this.activeConnections, (_id, { model }) => ({
      model,
    }));
  }

  getPausedList(): PausedConnection[] {
    return mapValues(this.pausedConnections);
  }
}
