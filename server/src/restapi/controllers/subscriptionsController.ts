import type {
  DeleteSubscriptionVars,
  InsertSubscriptionVars,
} from "../../../../shared/types";
import { validator } from "../../modules/validation";
import { validateIdInput } from "../../modules/validationPresets";
import { SubscriptionsService } from "../../service/subscriptionsService";
import { Controller } from "../endpoints";
import { result } from "../responses";
import { Routes } from "../restapiTypedefs";

const validateCreateSubscriptionInput = validator<InsertSubscriptionVars>({
  type: "object",
  properties: {
    connectionId: { type: "number" },
    subject: { type: "string" },
  },
  required: ["connectionId", "subject"],
});

const validateDeleteSubscriptionInput = validator<DeleteSubscriptionVars>({
  type: "object",
  properties: {
    id: { type: "number" },
  },
  required: ["id"],
});

export class SubscriptionsController implements Controller {
  path = "/subscriptions";

  constructor(private readonly subscriptionsService: SubscriptionsService) {}

  register(routes: Routes) {
    routes.get("/active", (_req, res) => {
      result(res, this.subscriptionsService.getActiveList());
    });

    routes.get("/paused", (_req, res) => {
      result(res, this.subscriptionsService.getPausedList());
    });

    routes.post("/create", (req, res) => {
      const input = validateCreateSubscriptionInput(req.body);
      result(res, this.subscriptionsService.createSubscription(input));
    });

    routes.put("/pause", (req, res) => {
      const input = validateIdInput(req.body);
      result(res, this.subscriptionsService.pauseSubscription(input));
    });

    routes.put("/resume", (req, res) => {
      const input = validateIdInput(req.body);
      result(res, this.subscriptionsService.resumeSubscription(input));
    });

    routes.delete("/delete", (req, res) => {
      const input = validateDeleteSubscriptionInput(req.body);
      result(res, this.subscriptionsService.deleteSubscription(input));
    });
  }
}
