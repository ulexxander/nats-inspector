import { createEvent } from "effector";
import { IdInput, InsertSubscriptionVars } from "../../../../shared/types";
import { createForm } from "../../lib/effector-forms";
import { createSubMutation } from "./subscriptionsRequests";

export const createSubscriptionForm = createForm<keyof InsertSubscriptionVars>({
  fields: {
    connectionId: {
      default: null,
    },
    subject: {
      default: "",
    },
  },
  reset: createSubMutation.done,
});

export const createSubscription = createEvent();
export const deleteSubscription = createEvent<IdInput>();
