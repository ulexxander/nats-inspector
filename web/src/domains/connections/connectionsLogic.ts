import { Event, forward } from "effector";
import { InsertConnectionVars } from "../../../../shared/types";
import { createConnMutation } from "./connectionsRequests";
import { createConnectionForm } from "./connectionsUnits";

forward({
  from: createConnectionForm.validated.map((state) => ({
    ...state,
    port: Number(state.port),
  })) as Event<InsertConnectionVars>,
  to: createConnMutation.run,
});
