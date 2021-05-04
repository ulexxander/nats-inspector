import { Type } from "@sinclair/typebox";
import { RequestsService } from "../../service/requestsService";
import { validator } from "../../validation";
import { Controller } from "../endpoints";
import { result } from "../responses";

const sendReqeustValidator = validator(
  Type.Object({
    subject: Type.String({ minLength: 1 }),
    data: Type.Any(),
  })
);

export function requestsController(service: RequestsService): Controller {
  return (routes) => {
    routes.post("/requests/send", async (req, res) => {
      const input = sendReqeustValidator(req.body);

      const response = await service.sendRequest(input.subject, input.data);

      result(res, response);
    });
  };
}
