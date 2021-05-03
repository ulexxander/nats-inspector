import { Server as WebsocketServer } from "ws";
import { WebsocketEvents } from "../types";

export type WebsocketBroadcaster = ReturnType<typeof createBrodcaster>;

export function createBrodcaster(ws: WebsocketServer) {
  return {
    send(event: WebsocketEvents, payload: unknown) {
      ws.clients.forEach((client) => {
        client.send(JSON.stringify({ event, payload }));
      });
    },

    subMessage(payload: { id: string; data: unknown }) {
      this.send("SUB_MESSAGE", payload);
    },
  };
}
