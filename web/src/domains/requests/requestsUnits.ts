import { createEffect, createStore } from "effector";
import {
  RequestsApi,
  SendRequestPayload,
  SendRequestResponse,
} from "../../api/requestsApi";
import { createForm } from "../../lib/effector-forms";

export const sendRequestForm = createForm<keyof SendRequestPayload>({
  fields: {
    subject: {
      default: "",
    },
    data: {
      default: "{\n\n}",
    },
  },
});

export const $requestResult = createStore<SendRequestResponse | null>(null);
export const $requestError = createStore<string>("");

export const sendRequestFx = createEffect(RequestsApi.sendRequest);
