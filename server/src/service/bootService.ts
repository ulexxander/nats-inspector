import { Database } from "../database/databaseTypedefs";
import { l } from "../logs";
import { NatsClient } from "../nats/natsClient";
import { batch } from "../utils";

export class BootService {
  constructor(
    private readonly natsClient: NatsClient,
    private readonly database: Database,
  ) {}

  async restoreConnections() {
    const conns = this.database.get("connections").value();

    if (!conns.length) {
      return;
    }

    l({
      msg: "Restoring nats connections from database and initializing them",
      conns: conns.length,
    });

    const jobs = batch();

    for (const conn of conns) {
      jobs.add(
        this.natsClient.addConnection(
          conn.server.host + ":" + conn.server.port,
        ),
      );
    }

    await jobs.wait();
  }
}
