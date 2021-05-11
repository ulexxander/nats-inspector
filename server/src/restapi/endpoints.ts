import { Routes, Serv } from "./restapiTypedefs";

export interface Controller {
  path: string;
  register(routes: Routes): void;
}

export function applyControllers(service: Serv, contollers: Controller[]) {
  for (const contoller of contollers) {
    const router = service.newRouter();
    contoller.register(router);
    service.use("/api" + contoller.path, router);
  }
}
