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
  $currentConnection,
  createConnectionForm,
  setCurrentConnection,
} from "./connectionsUnits";

$currentConnection
  .on(setCurrentConnection, (_, newCurrent) => newCurrent)
  .on(
    activeConnsQuery.doneData,
    (current, activeConns) => current || activeConns[0] || null,
  );

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
