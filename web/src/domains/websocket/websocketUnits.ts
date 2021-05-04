import { createEffect, createEvent, split } from "effector";
import { WsEvent } from "../../../../shared/types";

export const websocketConnectFx = createEffect();

export const websocketMessage = createEvent<WsEvent>();

export const wsMessages = split(websocketMessage, {
  subMessage: ({ type }) => type === "SUB_MESSAGE",
});
