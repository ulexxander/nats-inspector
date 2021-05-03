import { wsMessages } from "../websocket/websocketUnits";
import { $subMessages } from "./subMessagesUnits";

$subMessages.on(wsMessages.subMessage, (messages, { payload }) =>
  [payload, ...messages].slice(0, 100)
);
