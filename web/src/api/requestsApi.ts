import { FormValue } from "../lib/effector-forms";
import { apiMutation } from "./apiHelpers";

export type SendRequestPayload = {
  subject: FormValue;
  data: FormValue;
};

export type SendRequestResponse = {
  subject: string;
  reply: unknown;
};

export const RequestsApi = {
  sendRequest(payload: SendRequestPayload) {
    return apiMutation<SendRequestResponse>(
      "/requests/send",
      { method: "POST" },
      {
        subject: payload.subject,
        data: JSON.parse(payload.data as string),
      }
    );
  },
};
