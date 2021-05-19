import { connect as natsConnect, NatsConnection } from "nats";
import type {
  ActiveConnection as ActiveConnectionBase,
  ConnectionModel,
  DeleteConnectionVars,
  IdInput,
  InsertConnectionVars,
  PausedConnection,
} from "../../../shared/types";
import { DatabaseQueries } from "../database/queries";
import { l } from "../modules/logs";
import { errText, errWrap } from "../utils/errors";
import { mapTransform, mapValues } from "../utils/maps";

export type ActiveConnection = ActiveConnectionBase & {
  nats: NatsConnection;
};

// TODO: get rid of "type" field in maps
// add it only when sending to the user
// make better type hierarchy

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
        servers: model.server,
      });
    } catch (err) {
      this.pausedConnections.set(id, {
        type: "paused",
        model,
        error: {
          message: errText(err),
          timestamp: new Date().toISOString(),
        },
      });
      throw errWrap(err, `Cannot connect to nats server ${model.server}`);
    }

    this.activeConnections.set(id, { type: "active", model, nats: conn });
  }

  async createConnection(
    input: InsertConnectionVars,
  ): Promise<ConnectionModel> {
    const insertedConn = this.db.insertConnection(input);
    l({
      msg: "Creating nats connection",
      server: insertedConn.server,
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
    l({
      msg: "Deleted nats connection",
      server: deletedConn.server,
    });
    return deletedConn;
  }

  pauseConnection(input: IdInput): ConnectionModel {
    const { id } = input;

    const activeConn = this.activeConnections.get(id);
    if (!activeConn) {
      throw new Error(`No active connection with id ${id}`);
    }
    const { model } = activeConn;

    this.activeConnections.delete(id);
    this.pausedConnections.set(id, { type: "paused", model });

    l({
      msg: "Paused nats connection",
      server: model.server,
    });

    return model;
  }

  async resumeConnection(input: IdInput): Promise<ConnectionModel> {
    const { id } = input;

    const pausedConn = this.pausedConnections.get(id);
    if (!pausedConn) {
      throw new Error(`No paused connection with id ${id}`);
    }
    const { model } = pausedConn;

    this.pausedConnections.delete(id);
    await this.addConnection(model);

    l({
      msg: "Resumed nats connection",
      server: model.server,
    });

    return model;
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
      type: "active",
      model,
    }));
  }

  getPausedList(): PausedConnection[] {
    return mapValues(this.pausedConnections);
  }
}
