import SQLite from "better-sqlite3";
import { JSONCodec } from "nats";
import { createServer } from "node:http";
import restana from "restana";
import Websocket from "ws";
import { env } from "./config/environment";
import { DatabaseMigrations } from "./database/migrations";
import { databaseQueries } from "./database/queries";
import { l } from "./logs";
import { NatsClient } from "./nats/natsClient";
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
import { SubscriptionsService } from "./service/subscriptionsService";
import { WebsocketBroadcaster } from "./websocket/broadcaster";

async function main() {
  setupProcess();

  if (env("ENV_FILE", "true") === "true") {
    require("dotenv").config();
  }

  const natsClient = new NatsClient(JSONCodec());
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

  l({
    msg: "Perfoming boot procedures",
  });
  const bootService = new BootService(natsClient, dbQueries);
  await bootService.restoreConnections();

  const connectionsService = new ConnectionsService(natsClient, dbQueries);

  const subscriptionsService = new SubscriptionsService(
    natsClient,
    wsBroadcaster,
  );

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
    new RequestsController(natsClient),
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
  console.log(err);
  process.exit(1);
});
