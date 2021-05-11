import { Type } from "@sinclair/typebox";
import { NatsClient } from "../../nats/natsClient";
import { validator } from "../../validation";
import { Controller } from "../endpoints";
import { result } from "../responses";
import { Routes } from "../restapiTypedefs";

const sendReqeustInputValidator = validator(
  Type.Object({
    server: Type.String({ minLength: 1 }),
    subject: Type.String({ minLength: 1 }),
    data: Type.Any(),
  }),
);

export class RequestsController implements Controller {
  path = "/requests";

  constructor(private natsClient: NatsClient) {}

  register(routes: Routes): void {
    routes.post("/send", async (req, res) => {
      const input = sendReqeustInputValidator(req.body);

      const response = await this.natsClient.request(
        input.server,
        input.subject,
        input.data,
      );

      result(res, response);
    });
  }
}
