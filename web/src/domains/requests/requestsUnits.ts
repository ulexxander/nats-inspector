import { createEffect, createEvent, createStore } from "effector";
import { RequestsApi, SendRequestResponse } from "../../api/requestsApi";
import { createPersistentStore } from "../../lib/effector-localstorage";

export type PreviousRequest = {
  id: string;
  subject: string;
  input: string;
  output: string;
  dateCreated: string;
};

export const $requestResult = createStore<SendRequestResponse | null>(null);
export const $requestError = createStore<string>("");

export const $requestSubject = createPersistentStore({
  key: "request_subject",
  initialState: "",
  marshal(state) {
    return state;
  },
  unmarshal(state) {
    return state;
  },
});

export const $requestDataString = createPersistentStore({
  key: "request_data",
  initialState: "{}",
  marshal(state) {
    return state;
  },
  unmarshal(state) {
    return state;
  },
});

export const $replyString = createPersistentStore({
  key: "request_result",
  initialState: "// nothing yet",
  marshal(state) {
    return state;
  },
  unmarshal(state) {
    return state;
  },
});

export const $previousRequests = createPersistentStore<PreviousRequest[]>({
  key: "previous_requests",
  initialState: [],
  marshal(state) {
    return JSON.stringify(state.slice(0, 20));
  },
  unmarshal(rawState) {
    return JSON.parse(rawState);
  },
});

export const sendRequest = createEvent();

export const sendRequestFx = createEffect(RequestsApi.sendRequest);

export const setRequestDataString = createEvent<string>();
export const setReplyString = createEvent<string>();

export const deletePreviousRequest = createEvent<string>();
