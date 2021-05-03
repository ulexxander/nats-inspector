import { Type } from "@sinclair/typebox";
import { SubscribtionsService } from "../../service/subscribtionsService";
import { Serv } from "../../types";
import { validator } from "../../validation";
import { result } from "../responses";

const createSubscribtionValidator = validator(
  Type.Object({
    subject: Type.String(),
  })
);

export function subscribtionsContoller(service: SubscribtionsService) {
  return (api: Serv) => {
    api.get("/subscribtions/all", (_req, res) => {
      result(res, {
        subscribtions: service.allSubscribtions(),
      });
    });

    api.post("/subscribtions/create", (req, res) => {
      const input = createSubscribtionValidator(req.body);

      service.createSubscribtion(input.subject);

      result(res, {
        subscribtions: service.allSubscribtions(),
      });
    });
  };
}
