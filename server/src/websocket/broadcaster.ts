import { Server as WebsocketServer } from "ws";
import { WebsocketEvents } from "../types";

export type WebsocketBroadcaster = ReturnType<typeof createBrodcaster>;

export function createBrodcaster(ws: WebsocketServer) {
  return {
    send(event: WebsocketEvents, data: any) {
      ws.clients.forEach((client) => {
        client.send(JSON.stringify({ event, data }));
      });
    },

    subMessage(data: unknown) {
      this.send("SUB_MESSAGE", data);
    },
  };
}
