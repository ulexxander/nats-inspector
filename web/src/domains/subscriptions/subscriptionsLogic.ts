import { Event, sample } from "effector";
import { InsertSubscriptionVars } from "../../../../shared/types";
import { forwardVoid } from "../../lib/effector-shortcuts";
import { $currentConnectionId } from "../connections/connectionsUnits";
import {
  activeSubsQuery,
  createSubMutation,
  deleteSubMutation,
  pausedSubsQuery,
  pauseSubMutation,
  resumeSubMutation,
} from "./subscriptionsRequests";
import {
  createSubscriptionForm,
  pauseSubsOfInnactiveConnsFx,
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

forwardVoid({
  from: [pauseSubMutation.done, resumeSubMutation.done, deleteSubMutation.done],
  to: [activeSubsQuery.run, pausedSubsQuery.run],
});

sample({
  clock: $currentConnectionId.updates,
  source: activeSubsQuery.data,
  fn(activeSubs, newConnId) {
    return (
      activeSubs?.filter((conn) => conn.model.connectionId !== newConnId) || []
    );
  },
  target: pauseSubsOfInnactiveConnsFx,
});
