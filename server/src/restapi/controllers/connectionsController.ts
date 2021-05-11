import { Type } from "@sinclair/typebox";
import {
  ConnectionsService,
  CreateConnectionInput,
} from "../../service/connectionsService";
import { validator } from "../../validation";
import { Controller } from "../endpoints";
import { result } from "../responses";
import { Routes } from "../restapiTypedefs";

const createConnectionInputValidator = validator(
  Type.Object({
    title: Type.String(),
    description: Type.Optional(Type.String()),
    server: Type.Object({
      host: Type.String(),
      port: Type.Number(),
    }),
  }),
);

export class ConnectionsController implements Controller {
  path = "/connections";

  constructor(private readonly connectionsService: ConnectionsService) {}

  register(routes: Routes) {
    routes.get("/all", (_req, res) => {
      result(res, this.connectionsService.getConnections());
    });

    routes.post("/create", async (req, res) => {
      const input: CreateConnectionInput = createConnectionInputValidator(
        req.body,
      );

      result(res, await this.connectionsService.createConnection(input));
    });
  }
}
