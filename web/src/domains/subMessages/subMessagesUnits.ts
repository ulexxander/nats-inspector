import { createStore } from "effector";
import { WsSubscriptionMsgEvent } from "../../../../shared/types";

export const $subMessages = createStore<WsSubscriptionMsgEvent["p"][]>([]);
