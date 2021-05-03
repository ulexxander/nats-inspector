import { FormValue } from "../lib/effector-forms";
import { apiMutation, apiQuery } from "./apiHelpers";

export type SubscribtionStructure = string;

export type CreateSubscriptionPayload = {
  subject: FormValue;
};

export const SubscribtionsApi = {
  getAllSubs() {
    return apiQuery<SubscribtionStructure[]>("/subscribtions/all", {
      method: "GET",
    });
  },

  createSub(payload: CreateSubscriptionPayload) {
    return apiMutation<SubscribtionStructure[]>(
      "/subscribtions/create",
      { method: "POST" },
      payload
    );
  },
};
