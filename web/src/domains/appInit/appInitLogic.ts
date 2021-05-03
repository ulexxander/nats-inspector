import { forward } from "effector";
import { getAllSubsFx } from "../subscribtions/subscribtionsUnits";
import { websocketConnectFx } from "../websocket/websocketUnits";
import { appInit } from "./appInitUnits";

forward({
  from: appInit,
  to: [getAllSubsFx, websocketConnectFx],
});
