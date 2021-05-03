import { forward } from "effector";
import { getAllSubsFx } from "../subscribtions/subscribtionsUnits";
import { appInit } from "./appInitUnits";

forward({
  from: appInit,
  to: [getAllSubsFx],
});
