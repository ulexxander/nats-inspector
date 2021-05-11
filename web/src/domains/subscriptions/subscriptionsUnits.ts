import { createEffect, createEvent, createStore } from "effector";
import { NatsSub } from "../../../../shared/types";
import {
  SubscriptionPayload,
  SubscriptionsApi,
} from "../../api/subscriptionsApi";
import { createForm } from "../../lib/effector-forms";

export const createSubForm = createForm({
  fields: {
    subject: {
      default: "",
    },
  },
});

export const $subscriptions = createStore<NatsSub[] | null>(null);
export const $createSubError = createStore<string>("");

export const createSub = createEvent();
export const deleteSub = createEvent<SubscriptionPayload>();

export const getAllSubsFx = createEffect(SubscriptionsApi.getAllSubs);
export const createSubFx = createEffect(SubscriptionsApi.createSub);
export const deleteSubFx = createEffect(SubscriptionsApi.deleteSub);
