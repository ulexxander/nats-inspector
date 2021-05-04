import { createStore } from "effector";
import { WsSubMessageEvent } from "../../../../shared/types";

export const $subMessages = createStore<WsSubMessageEvent["payload"][]>([]);
