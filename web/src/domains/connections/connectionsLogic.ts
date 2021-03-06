import { Event, forward } from "effector";
import { InsertConnectionVars } from "../../../../shared/types";
import { forwardVoid } from "../../lib/effector-shortcuts";
import {
  activeConnsQuery,
  createConnMutation,
  deleteConnMutation,
  pauseConnMutation,
  pausedConnsQuery,
  resumeConnMutation,
} from "./connectionsRequests";
import {
  $currentConnectionId,
  createConnectionForm,
  setCurrentConnectionId,
} from "./connectionsUnits";

$currentConnectionId
  .on(setCurrentConnectionId, (_, newId) => newId)
  .on(activeConnsQuery.doneData, (currentId, activeConns) => {
    const current = activeConns.find((conn) => conn.model.id === currentId);
    if (current) {
      return current.model.id;
    }

    return activeConns[0]?.model.id || -1;
  });

forward({
  from: createConnectionForm.validated as Event<InsertConnectionVars>,
  to: createConnMutation.run,
});

forwardVoid({
  from: createConnMutation.done,
  to: activeConnsQuery.run,
});

forwardVoid({
  from: createConnMutation.fail,
  to: pausedConnsQuery.run,
});

forwardVoid({
  from: [
    pauseConnMutation.done,
    resumeConnMutation.done,
    deleteConnMutation.done,
  ],
  to: [activeConnsQuery.run, pausedConnsQuery.run],
});
