import { Server as WebsocketServer } from "ws";
import { WsEvent } from "../../../shared/types";

export type WebsocketBroadcaster = ReturnType<typeof createBrodcaster>;

export function createBrodcaster(ws: WebsocketServer) {
  return {
    send(event: WsEvent) {
      ws.clients.forEach((client) => {
        client.send(JSON.stringify(event));
      });
    },
  };
}
