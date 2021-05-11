import { Server as WebsocketServer } from "ws";
import { WsEvent } from "../../../shared/types";

export class WebsocketBroadcaster {
  constructor(private readonly ws: WebsocketServer) {}

  send(event: WsEvent) {
    this.ws.clients.forEach((client) => {
      client.send(JSON.stringify(event));
    });
  }
}
