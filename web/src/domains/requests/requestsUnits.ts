import { createEffect, createEvent, createStore } from "effector";
import { RequestsApi, SendRequestResponse } from "../../api/requestsApi";
import { persistJSON, persistText } from "../../lib/effector-localstorage";

export type PreviousRequest = {
  id: string;
  subject: string;
  input: string;
  output: string;
  dateCreated: string;
};

export const $requestResult = createStore<SendRequestResponse | null>(null);
export const $requestError = createStore("");

export const $requestSubject = createStore("");
persistText("request_subject", $requestSubject);

export const $requestInput = createStore("{}");
persistText("request_input", $requestInput);

export const $requestOutput = createStore("// nothing yet");
persistText("request_output", $requestOutput);

export const $previousRequests = createStore<PreviousRequest[]>([]);
persistJSON("previous_requests", $previousRequests);

export const sendRequest = createEvent();
export const sendRequestFx = createEffect(RequestsApi.sendRequest);

export const setRequestSubject = createEvent<string>();
export const setRequestInput = createEvent<string>();
export const setRequestOutput = createEvent<string>();

export const copyRequestInput = createEvent<string>();
export const copyRequestOutput = createEvent<string>();

export const deletePreviousRequest = createEvent<string>();
