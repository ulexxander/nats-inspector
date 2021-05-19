import { combine, createEvent } from "effector";
import { InsertSubscriptionVars } from "../../../../shared/types";
import { createForm, notEmpty } from "../../lib/effector-forms";
import { voidEvent } from "../../lib/effector-shortcuts";
import { $currentConnectionId } from "../connections/connectionsUnits";
import {
  activeSubsQuery,
  createSubMutation,
  pausedSubsQuery,
} from "./subscriptionsRequests";

export const $currentConnActiveSubs = combine(
  activeSubsQuery.data,
  $currentConnectionId,
  (subs, connId) =>
    subs ? subs.filter((sub) => sub.model.connectionId === connId) : [],
);

export const $currentConnPausedSubs = combine(
  pausedSubsQuery.data,
  $currentConnectionId,
  (subs, connId) =>
    subs ? subs.filter((sub) => sub.model.connectionId === connId) : [],
);

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
