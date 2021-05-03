import { FormValue } from "../lib/effector-forms";
import { apiMutation, apiQuery } from "./apiHelpers";

export type SubscribtionStructure = string;

export type CreateSubscriptionPayload = {
  subject: FormValue;
};

export type CreateSubscriptionResponse = {
  subscribtions: SubscribtionStructure[];
};

export const SubscribtionsApi = {
  getAllSubs() {
    return apiQuery<CreateSubscriptionResponse>("/subscribtions/all", {
      method: "GET",
    });
  },

  createSub(payload: CreateSubscriptionPayload) {
    return apiMutation<CreateSubscriptionResponse>(
      "/subscribtions/create",
      { method: "POST" },
      payload
    );
  },
};
