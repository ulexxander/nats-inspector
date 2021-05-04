import { Type } from "@sinclair/typebox";
import { SubscribtionsService } from "../../service/subscribtionsService";
import { validator } from "../../validation";
import { Controller } from "../endpoints";
import { result } from "../responses";

const subscribtionDataValidator = validator(
  Type.Object({
    subject: Type.String({ minLength: 1 }),
  })
);

export function subscribtionsContoller(
  service: SubscribtionsService
): Controller {
  return (routes) => {
    routes.get("/subscribtions/all", (_req, res) => {
      result(res, service.allSubscribtions());
    });

    routes.post("/subscribtions/create", (req, res) => {
      const input = subscribtionDataValidator(req.body);

      const subscribtion = service.createSubscribtion(input.subject);

      result(res, subscribtion);
    });

    routes.delete("/subscribtions/delete", (req, res) => {
      const input = subscribtionDataValidator(req.body);

      result(res, service.deleteSubscribtion(input.subject));
    });
  };
}
