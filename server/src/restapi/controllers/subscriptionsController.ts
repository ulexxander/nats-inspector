import { Type } from "@sinclair/typebox";
import { SubscriptionsService } from "../../service/subscriptionsService";
import { validator } from "../../validation";
import { Controller } from "../endpoints";
import { result } from "../responses";
import { Routes } from "../restapiTypedefs";

const subscriptionDataValidator = validator(
  Type.Object({
    server: Type.String({ minLength: 1 }),
    subject: Type.String({ minLength: 1 }),
  }),
);

export class SubscriptionsController implements Controller {
  path = "/subscriptions";

  constructor(private readonly subscriptionsService: SubscriptionsService) {}

  register(routes: Routes) {
    routes.get("/all", (_req, res) => {
      result(res, this.subscriptionsService.allSubscriptions());
    });

    routes.post("/create", (req, res) => {
      const input = subscriptionDataValidator(req.body);

      const subscription = this.subscriptionsService.createSubscription(
        input.server,
        input.subject,
      );

      result(res, subscription);
    });

    routes.delete("/delete", (req, res) => {
      const input = subscriptionDataValidator(req.body);

      result(res, this.subscriptionsService.deleteSubscription(input.subject));
    });
  }
}
