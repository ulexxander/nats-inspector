import { forward } from "effector";
import {
  activeConnsQuery,
  pausedConnsQuery,
} from "../connections/connectionsRequests";
import {
  activeSubsQuery,
  pausedSubsQuery,
} from "../subscriptions/subscriptionsRequests";
import { websocketConnectFx } from "../websocket/websocketUnits";
import { appInit, fetchInitialData } from "./appInitUnits";

forward({
  from: appInit,
  to: [websocketConnectFx, fetchInitialData],
});

forward({
  from: fetchInitialData,
  to: [
    activeConnsQuery.run,
    pausedConnsQuery.run,
    activeSubsQuery.run,
    pausedSubsQuery.run,
  ],
});
