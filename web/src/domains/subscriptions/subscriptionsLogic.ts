import { Event, forward, sample } from "effector";
import { InsertSubscriptionVars } from "../../../../shared/types";
import { $currentConnectionId } from "../connections/connectionsUnits";
import {
  activeSubsQuery,
  createSubMutation,
  deleteSubMutation,
} from "./subscriptionsRequests";
import {
  createSubscriptionForm,
  deleteSubscription,
} from "./subscriptionsUnits";

activeSubsQuery.data
  .on(createSubMutation.doneData, (subs, newSub) =>
    subs ? [...subs, { type: "active", model: newSub }] : null,
  )
  .on(deleteSubMutation.doneData, (subs, deleted) =>
    subs ? subs.filter(({ model }) => model.subject !== deleted.subject) : null,
  );

sample({
  source: $currentConnectionId,
  clock: createSubscriptionForm.validated as Event<
    Omit<InsertSubscriptionVars, "connectionId">
  >,
  fn(connId, formState) {
    return {
      connectionId: connId,
      ...formState,
    };
  },
  target: createSubMutation.run,
});

forward({
  from: deleteSubscription,
  to: deleteSubMutation.run,
});
