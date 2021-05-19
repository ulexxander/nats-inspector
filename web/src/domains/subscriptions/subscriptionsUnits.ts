import { createEvent } from "effector";
import { InsertSubscriptionVars } from "../../../../shared/types";
import { createForm, notEmpty } from "../../lib/effector-forms";
import { voidEvent } from "../../lib/effector-shortcuts";
import { createSubMutation } from "./subscriptionsRequests";

export const createSubscriptionForm = createForm<
  keyof Omit<InsertSubscriptionVars, "connectionId">
>({
  fields: {
    subject: {
      default: "",
      validator: notEmpty("Subject is required"),
    },
  },
  reset: voidEvent(createSubMutation.done),
});

export const createSubscription = createEvent();
