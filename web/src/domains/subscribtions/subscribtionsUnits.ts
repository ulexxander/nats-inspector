import { createEffect, createEvent, createStore } from "effector";
import { NatsSub } from "../../../../shared/types";
import {
  SubscribtionsApi,
  SubscriptionPayload,
} from "../../api/subscribtionsApi";
import { createForm } from "../../lib/effector-forms";

export const createSubForm = createForm({
  fields: {
    subject: {
      default: "",
    },
  },
});

export const $subscribtions = createStore<NatsSub[] | null>(null);
export const $createSubError = createStore<string>("");

export const createSub = createEvent();
export const deleteSub = createEvent<SubscriptionPayload>();

export const getAllSubsFx = createEffect(SubscribtionsApi.getAllSubs);
export const createSubFx = createEffect(SubscribtionsApi.createSub);
export const deleteSubFx = createEffect(SubscribtionsApi.deleteSub);
