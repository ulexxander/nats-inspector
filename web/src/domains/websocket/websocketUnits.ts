import { createEffect, createEvent, split } from "effector";

// should be shared
export type WebsocketSubMessage = {
  event: "SUB_MESSAGE";
  payload: {
    id: string;
    data: unknown;
  };
};

export type WebsocketMessage = WebsocketSubMessage;

export const websocketConnectFx = createEffect();

export const websocketMessage = createEvent<WebsocketMessage>();

export const wsMessages = split(websocketMessage, {
  subMessage: ({ event }) => event === "SUB_MESSAGE",
});
