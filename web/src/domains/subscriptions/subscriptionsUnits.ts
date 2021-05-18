import { createEvent } from "effector";
import { IdInput, InsertSubscriptionVars } from "../../../../shared/types";
import { createForm } from "../../lib/effector-forms";
import { voidEvent } from "../../lib/effector-shortcuts";
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
  reset: voidEvent(createSubMutation.done),
});

export const createSubscription = createEvent();
export const deleteSubscription = createEvent<IdInput>();
