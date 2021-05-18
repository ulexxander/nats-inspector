import { createEvent, createStore } from "effector";
import { SendRequestInput, SendRequestOutput } from "../../../../shared/types";
import { createMutation } from "../../api/apiHelpers";
import { persistJSON, persistText } from "../../lib/effector-localstorage";

export type PreviousRequest = {
  input: SendRequestInput;
  output: SendRequestOutput;
};

export const initialRequestPayload = "{}";
export const initialRequestResult = "// nothing yet";

export const $requestSubject = createStore("");
persistText("request_subject", $requestSubject);

export const $requestPayload = createStore(initialRequestPayload);
persistText("request_payload", $requestPayload);

export const $requestResult = createStore(initialRequestResult);
persistText("request_result", $requestResult);

export const $previousRequests = createStore<PreviousRequest[]>([]);
persistJSON("previous_requests", $previousRequests);

export const sendRequest = createEvent();

export const setRequestSubject = createEvent<string>();
export const setRequestPayload = createEvent<string>();
export const setRequestResult = createEvent<string>();

export const copyRequestPayload = createEvent<string | undefined>();
export const copyRequestResult = createEvent<string>();

export const deletePreviousRequest = createEvent<string>();

export const sendRequestMutation = createMutation<
  SendRequestInput,
  SendRequestOutput
>("/requests/send", { method: "POST" });
