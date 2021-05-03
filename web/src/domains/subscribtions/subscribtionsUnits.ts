import { createEffect, createEvent, createStore } from "effector";
import { SubscribtionsApi } from "../../api/subscribtionsApi";
import { createForm } from "../../lib/effector-forms";

export const createSubForm = createForm({
  fields: {
    subject: {
      default: "",
    },
  },
});

export const $subscribtions = createStore<string[] | null>(null);
export const $createSubError = createStore<string>("");

export const createSub = createEvent();

export const getAllSubsFx = createEffect(SubscribtionsApi.getAllSubs);
export const createSubFx = createEffect(SubscribtionsApi.createSub);
