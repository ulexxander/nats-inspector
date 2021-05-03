import { Handler, Serv } from "../types";

export function test(): Handler {
  return (_req, res) => {
    res.send("test");
  };
}

type Controller = (api: Serv) => void;

export function applyControllers(api: Serv, contollers: Controller[]) {
  for (const contoller of contollers) {
    contoller(api);
  }
}
