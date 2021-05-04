import dotenv from "dotenv";
import { connect as natsConnect, JSONCodec } from "nats";
import restana from "restana";
import { Server as WebsocketServer } from "ws";
import { l } from "./logs";
import { createNatsClient } from "./nats";
import { requestsController } from "./restapi/controllers/requestsController";
import { subscribtionsContoller } from "./restapi/controllers/subscribtionsController";
import { applyControllers } from "./restapi/endpoints";
import { bodyParser, errorHandler, requestLog } from "./restapi/middleware";
import { requestsService } from "./service/requestsService";
import { subscribtionsService } from "./service/subscribtionsService";
import { createBrodcaster } from "./websocket/broadcaster";

function env(key: string, fallback?: string) {
  const val = process.env[key];
  if (val) {
    return val;
  }

  if (fallback) {
    return fallback;
  }

  throw new Error(`Mandatory env variable ${key} is missing`);
}

async function main() {
  if (env("ENV_FILE", "true") === "true") {
    dotenv.config();
  }

  const natsAddress = `${env("NATS_HOST")}:${env("NATS_PORT")}`;
  l({
    msg: "Connecting to nats",
    address: natsAddress,
  });

  const natsConn = await natsConnect({
    servers: [natsAddress],
  });

  const natsClient = createNatsClient(natsConn, JSONCodec());

  const websocketPort = env("WS_SERVER_PORT");
  l({
    msg: "Creating websocket server",
    port: websocketPort,
  });
  const wsServer = new WebsocketServer({
    port: +websocketPort,
  });

  wsServer.on("connection", () => {
    l({ msg: "Incoming websocket connection" });
  });

  const wsBroadcaster = createBrodcaster(wsServer);

  const restapi = restana({
    errorHandler(err) {
      // forward error to errorHandler middleware
      throw err;
    },
  });

  restapi.use(requestLog());
  restapi.use(bodyParser());
  restapi.use(errorHandler());

  const services = {
    subscribtions: subscribtionsService(natsClient, wsBroadcaster),
    request: requestsService(natsClient),
  };

  const apiRouter = restapi.newRouter();
  applyControllers(apiRouter, [
    subscribtionsContoller(services.subscribtions),
    requestsController(services.request),
  ]);

  restapi.use("/api", apiRouter);

  const restapiPort = env("API_SERVER_PORT");
  l({
    msg: "Starting restapi http server",
    port: restapiPort,
  });
  await restapi.start(+restapiPort);
}

main().catch((err) => {
  console.log(err);
  process.exit(1);
});
