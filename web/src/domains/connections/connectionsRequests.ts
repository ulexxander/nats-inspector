import {
  ActiveConnection,
  ConnectionModel,
  DeleteConnectionVars,
  IdInput,
  InsertConnectionVars,
  PausedConnection,
} from "../../../../shared/types";
import { createMutation, createQuery } from "../../api/apiHelpers";

export const activeConnsQuery = createQuery<void, ActiveConnection[]>(
  "/connections/active",
  { method: "GET" },
);
export const pausedConnsQuery = createQuery<void, PausedConnection[]>(
  "/connections/paused",
  { method: "GET" },
);
export const createConnMutation = createMutation<
  InsertConnectionVars,
  ConnectionModel
>("/connections/create", { method: "POST" });
export const pauseConnMutation = createMutation<IdInput, ConnectionModel>(
  "/connections/pause",
  { method: "PUT" },
);
export const resumeConnMutation = createMutation<IdInput, ConnectionModel>(
  "/connections/resume",
  { method: "PUT" },
);
export const deleteConnMutation = createMutation<
  DeleteConnectionVars,
  ConnectionModel
>("/connections/delete", { method: "delete" });
