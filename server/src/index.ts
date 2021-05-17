import SQLite from "better-sqlite3";
import { StringCodec } from "nats";
import { createServer } from "node:http";
import restana from "restana";
import Websocket from "ws";
import { env } from "./config/environment";
import { DatabaseMigrations } from "./database/migrations";
import { databaseQueries } from "./database/queries";
import { l } from "./modules/logs";
import { setupProcess } from "./process";
import { ConnectionsController } from "./restapi/controllers/connectionsController";
import { RequestsController } from "./restapi/controllers/requestsController";
import { SubscriptionsController } from "./restapi/controllers/subscriptionsController";
import { applyControllers } from "./restapi/endpoints";
import {
  bodyParser,
  errorHandler,
  requestLog,
  serveWebDist,
  serveWebIndex,
} from "./restapi/middleware";
import { BootService } from "./service/bootService";
import { ConnectionsService } from "./service/connectionsService";
import { NatsService } from "./service/natsService";
import { RequestsService } from "./service/requestsService";
import { SubscriptionsService } from "./service/subscriptionsService";
import { errText } from "./utils/errors";
import { WebsocketBroadcaster } from "./websocket/broadcaster";

async function main() {
  setupProcess();

  if (env("ENV_FILE", "true") === "true") {
    require("dotenv").config();
  }

  const httpServer = createServer();

  l({
    msg: "Creating websocket server",
  });
  const wsServer = new Websocket.Server({
    server: httpServer,
  });

  const wsBroadcaster = new WebsocketBroadcaster(wsServer);

  l({
    msg: "Loading sqlite3 database",
  });
  const sqlite = new SQLite("data/database.sqlite3");
  const migrations = new DatabaseMigrations(sqlite);
  await migrations.run();

  const dbQueries = databaseQueries(sqlite);

  const natsService = new NatsService(StringCodec());

  const connectionsService = new ConnectionsService(dbQueries);
  const subscriptionsService = new SubscriptionsService(
    connectionsService,
    natsService,
    wsBroadcaster,
    dbQueries,
  );

  const requestsService = new RequestsService(connectionsService, natsService);

  const bootService = new BootService(dbQueries);

  l({
    msg: "Restoring nats connections",
  });
  await bootService.restoreConnections(connectionsService);
  l({
    msg: "Restoring subscriptions",
  });
  await bootService.restoreSubscriptions(subscriptionsService);

  const app = restana({
    server: httpServer,
    errorHandler(err) {
      throw err; // forward error to the errorHandler middleware
    },
  });

  app.use(requestLog());
  app.use(bodyParser());
  app.use(errorHandler());

  applyControllers(app, [
    new ConnectionsController(connectionsService),
    new RequestsController(requestsService),
    new SubscriptionsController(subscriptionsService),
  ]);

  app.get("*", serveWebDist(), serveWebIndex());

  const serverPort = env("SERVER_PORT", "80");
  l({
    msg: "Starting http server",
    port: serverPort,
  });
  httpServer.listen(+serverPort);
}

main().catch((err) => {
  l({
    msg: "Exception in main func",
    err: errText(err),
    stack: err.stack,
  });
  process.exit(1);
});
