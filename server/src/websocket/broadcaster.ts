import WebSocket from "ws";
import type { WsEvent } from "../../../shared/types";
import { l } from "../modules/logs";

export class WebsocketBroadcaster {
  constructor(private readonly ws: WebSocket.Server) {
    this.setupCallbacks();
  }

  private setupCallbacks() {
    this.ws.on("connection", () => {
      l({
        msg: "Client estabilished websocket connection",
      });
    });
  }

  send(event: WsEvent) {
    this.ws.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(event));
      }
    });
  }
}
