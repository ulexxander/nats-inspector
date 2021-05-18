import { WsSubscriptionMsgEvent } from "../../../../shared/types";
import { wsMessages } from "../websocket/websocketUnits";
import { $subMessages } from "./subMessagesUnits";

$subMessages.on(wsMessages.subMessage, (messages, { p }) =>
  [p as WsSubscriptionMsgEvent["p"], ...messages].slice(0, 50),
);
