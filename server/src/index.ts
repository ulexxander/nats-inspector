import { JSONCodec } from "nats";
import restana from "restana";
import StormDB from "stormdb";
import { Server as WebsocketServer } from "ws";
import { env } from "./config/environment";
import { DatabaseLayer } from "./database/databaseLayer";
import { DatabaseSchema } from "./database/databaseTypedefs";
import { l } from "./logs";
import { NatsClient } from "./nats/natsClient";
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
  if (env("ENV_FILE", "true") === "true") {
    require("dotenv").config();
  }

  const websocketPort = env("WS_SERVER_PORT");
  l({
    msg: "Creating websocket server",
    port: websocketPort,
  });
  const wsServer = new WebsocketServer({
    port: +websocketPort,
  });
  wsServer.on("connection", () => {
    l({ msg: "Client estabilished websocket connection" });
  });

  const wsBroadcaster = new WebsocketBroadcaster(wsServer);

  const httpServ = restana({
    errorHandler(err) {
      // forward error to the errorHandler middleware
      throw err;
    },
  });

  httpServ.use(requestLog());
  httpServ.use(bodyParser());
  httpServ.use(errorHandler());

  const natsClient = new NatsClient(JSONCodec());

  l({
    msg: "Loading json file database client",
  });
  const databaseClient = new DatabaseLayer<DatabaseSchema>(
    new StormDB.localFileEngine("./db.stormdb"),
  );

  l({
    msg: "Perfoming boot procedures",
  });
  const bootService = new BootService(natsClient, databaseClient);
  await bootService.restoreConnections();

  const connectionsService = new ConnectionsService(natsClient, databaseClient);

  const subscriptionsService = new SubscriptionsService(
    natsClient,
    wsBroadcaster,
  );

  applyControllers(httpServ, [
    new ConnectionsController(connectionsService),
    new RequestsController(natsClient),
    new SubscriptionsController(subscriptionsService),
  ]);

  httpServ.get("*", serveWebDist(), serveWebIndex());

  const httpPort = env("HTTP_SERVER_PORT");
  l({
    msg: "Starting http server",
    port: httpPort,
  });
  await httpServ.start(+httpPort);
}

main().catch((err) => {
  console.log(err);
  process.exit(1);
});
