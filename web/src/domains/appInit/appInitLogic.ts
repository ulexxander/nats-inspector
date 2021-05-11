import { forward } from "effector";
import { getAllSubsFx } from "../subscriptions/subscriptionsUnits";
import { websocketConnectFx } from "../websocket/websocketUnits";
import { appInit } from "./appInitUnits";

forward({
  from: appInit,
  to: [getAllSubsFx, websocketConnectFx],
});
