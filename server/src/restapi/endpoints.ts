import { Routes } from "../types";

export type Controller = (router: Routes) => void;

export function applyControllers(router: Routes, contollers: Controller[]) {
  for (const contoller of contollers) {
    contoller(router);
  }
}
