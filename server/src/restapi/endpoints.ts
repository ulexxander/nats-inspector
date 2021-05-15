import { Routes, Server } from "./restapiTypedefs";

export interface Controller {
  path: string;
  register(routes: Routes): void;
}

export function applyControllers(server: Server, contollers: Controller[]) {
  for (const contoller of contollers) {
    const router = server.newRouter();
    contoller.register(router);
    server.use("/api" + contoller.path, router);
  }
}
