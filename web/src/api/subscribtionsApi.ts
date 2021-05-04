import { NatsSub } from "../../../shared/types";
import { FormValue } from "../lib/effector-forms";
import { apiMutation, apiQuery } from "./apiHelpers";

export type SubscriptionPayload = {
  subject: FormValue;
};

export const SubscribtionsApi = {
  getAllSubs() {
    return apiQuery<NatsSub[]>("/subscribtions/all", {
      method: "GET",
    });
  },

  createSub(payload: SubscriptionPayload) {
    return apiMutation<NatsSub>(
      "/subscribtions/create",
      { method: "POST" },
      payload
    );
  },

  deleteSub(payload: SubscriptionPayload) {
    return apiMutation<NatsSub>(
      "/subscribtions/delete",
      { method: "DELETE" },
      payload
    );
  },
};
