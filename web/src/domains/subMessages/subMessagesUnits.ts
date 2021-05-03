import { createStore } from "effector";
import { WebsocketSubMessage } from "../websocket/websocketUnits";

export const $subMessages = createStore<WebsocketSubMessage["payload"][]>([]);
