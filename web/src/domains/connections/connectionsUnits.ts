import { createStore } from "effector";
import { ConnectionModel } from "../../../../shared/types";

export const $currentConnection = createStore<ConnectionModel | null>(null);
export const $currentConnectionId = $currentConnection.map((conn) =>
  conn ? conn.id : -1,
);
