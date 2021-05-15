import { DatabaseQueries } from "../database/queries";
import { l } from "../logs";
import { NatsClient } from "../nats/natsClient";
import { batch } from "../utils";

export class BootService {
  constructor(
    private readonly natsClient: NatsClient,
    private readonly db: DatabaseQueries,
  ) {}

  async restoreConnections() {
    const conns = this.db.selectAllConnections();

    if (!conns.length) {
      return;
    }

    l({
      msg: "Restoring nats connections from database and initializing them",
      conns: conns.length,
    });

    const jobs = batch();

    for (const conn of conns) {
      jobs.add(this.natsClient.addConnection(conn.host + ":" + conn.port));
    }

    await jobs.wait();
  }
}
