import { Type } from "@sinclair/typebox";
import { SubscribtionsService } from "../../service/subscribtionsService";
import { Routes } from "../../types";
import { validator } from "../../validation";
import { Controller } from "../endpoints";
import { result } from "../responses";

const createSubscribtionValidator = validator(
  Type.Object({
    subject: Type.String({ minLength: 1 }),
  })
);

export function subscribtionsContoller(
  service: SubscribtionsService
): Controller {
  return (routes: Routes) => {
    routes.get("/subscribtions/all", (_req, res) => {
      result(res, {
        subscribtions: service.allSubscribtions(),
      });
    });

    routes.post("/subscribtions/create", (req, res) => {
      const input = createSubscribtionValidator(req.body);

      service.createSubscribtion(input.subject);

      result(res, {
        subscribtions: service.allSubscribtions(),
      });
    });
  };
}
