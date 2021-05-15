import WebSocket from "ws";
import { WsEvent } from "../../../shared/types";
import { l } from "../logs";

export class WebsocketBroadcaster {
  constructor(private readonly ws: WebSocket.Server) {
    this.setupCallbacks();
  }

  private setupCallbacks() {
    this.ws.on("connection", (socket) => {
      l({
        msg: "Client estabilished websocket connection",
      });

      socket.send(
        JSON.stringify({
          msg: "connected",
          time: new Date().toISOString(),
        }),
      );
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
