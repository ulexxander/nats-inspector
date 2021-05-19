import {
  ActiveSubscription,
  IdInput,
  InsertSubscriptionVars,
  PausedSubscription,
  SubscriptionModel,
} from "../../../../shared/types";
import { createMutation, createQuery } from "../../api/apiHelpers";

export const activeSubsQuery = createQuery<void, ActiveSubscription[]>(
  "/subscriptions/active",
  { method: "GET" },
);
export const pausedSubsQuery = createQuery<void, PausedSubscription[]>(
  "/subscriptions/paused",
  { method: "GET" },
);
export const createSubMutation = createMutation<
  InsertSubscriptionVars,
  SubscriptionModel
>("/subscriptions/create", { method: "POST" });
export const pauseSubMutation = createMutation<IdInput, SubscriptionModel>(
  "/subscriptions/pause",
  { method: "PUT" },
);
export const resumeSubMutation = createMutation<IdInput, SubscriptionModel>(
  "/subscriptions/resume",
  { method: "PUT" },
);
export const deleteSubMutation = createMutation<IdInput, SubscriptionModel>(
  "/subscriptions/delete",
  { method: "DELETE" },
);
