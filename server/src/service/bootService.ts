import { DatabaseQueries } from "../database/queries";
import { l } from "../modules/logs";
import { batch } from "../utils/sync";
import { address } from "../utils/texts";
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
        msg: "Recreating nats connection",
        id: conn.id,
        server: address(conn),
      });

      jobs.add(connectionsService.addConnection(conn));
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
        msg: "Recreating nats subscribtion",
        id,
        connectionId,
        subject,
      });
      subscriptionsService.addSubscription(sub);
    }
  }
}
