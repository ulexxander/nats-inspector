import { Event, forward } from "effector";
import { InsertConnectionVars } from "../../../../shared/types";
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
  from: createConnectionForm.validated.map((state) => ({
    ...state,
    port: Number(state.port),
  })) as Event<InsertConnectionVars>,
  to: createConnMutation.run,
});

forward({
  from: createConnMutation.done,
  to: activeConnsQuery.run,
});

forward({
  from: createConnMutation.fail,
  to: pausedConnsQuery.run,
});

forward({
  from: [
    pauseConnMutation.done,
    resumeConnMutation.done,
    deleteConnMutation.done,
  ],
  to: [activeConnsQuery.run, pausedConnsQuery.run],
});
