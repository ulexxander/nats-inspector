import { Event, forward } from "effector";
import { InsertSubscriptionVars } from "../../../../shared/types";
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
    subs ? [...subs, { model: newSub }] : null,
  )
  .on(deleteSubMutation.doneData, (subs, deleted) =>
    subs ? subs.filter(({ model }) => model.subject !== deleted.subject) : null,
  );

forward({
  from: createSubscriptionForm.submitted as Event<InsertSubscriptionVars>,
  to: createSubMutation.run,
});

forward({
  from: createSubMutation.done,
  to: createSubscriptionForm.reset,
});

forward({
  from: deleteSubscription,
  to: deleteSubMutation.run,
});
