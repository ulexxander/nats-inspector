import { NatsSub } from "../../../shared/types";
import { FormValue } from "../lib/effector-forms";
import { apiMutation, apiQuery } from "./apiHelpers";

export type SubscriptionPayload = {
  subject: FormValue;
};

export const SubscriptionsApi = {
  getAllSubs() {
    return apiQuery<NatsSub[]>("/subscriptions/all", {
      method: "GET",
    });
  },

  createSub(payload: SubscriptionPayload) {
    return apiMutation<NatsSub>(
      "/subscriptions/create",
      { method: "POST" },
      payload
    );
  },

  deleteSub(payload: SubscriptionPayload) {
    return apiMutation<NatsSub>(
      "/subscriptions/delete",
      { method: "DELETE" },
      payload
    );
  },
};
