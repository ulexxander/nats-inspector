import { DatabaseQueries } from "../database/queries";
import { l } from "../modules/logs";
import { errTextWrap } from "../utils/errors";
import { batch } from "../utils/sync";
import { ConnectionsService } from "./connectionsService";
import { SubscriptionsService } from "./subscriptionsService";

export class BootService {
  constructor(private readonly db: DatabaseQueries) {}

  async restoreConnections(
    connectionsService: ConnectionsService,
  ): Promise<void> {
    const conns = this.db.selectAllConnections();
    if (!conns.length) {
      return;
    }

    const jobs = batch();

    for (const conn of conns) {
      l({
        msg: "Recreating and initializing nats connection",
        id: conn.id,
        server: conn.server,
      });

      jobs.add(
        connectionsService.addConnection(conn).catch((err) => {
          l({
            msg: errTextWrap(err, "Failed to restore nats connection on boot"),
          });
        }),
      );
    }

    await jobs.wait();
  }

  async restoreSubscriptions(subscriptionsService: SubscriptionsService) {
    const subs = this.db.selectAllSubscriptions();
    if (!subs.length) {
      return;
    }

    for (const sub of subs) {
      const { id, connectionId, subject } = sub;
      l({
        msg: "Recreating previous nats subscription as paused",
        id,
        connectionId,
        subject,
      });
      subscriptionsService.addPausedSubscription(sub);
    }
  }
}
