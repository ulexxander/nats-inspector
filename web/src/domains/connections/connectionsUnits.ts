import { createStore } from "effector";
import {
  ConnectionModel,
  InsertConnectionVars,
} from "../../../../shared/types";
import { createForm, notEmpty } from "../../lib/effector-forms";

export const $currentConnection = createStore<ConnectionModel | null>(null);
export const $currentConnectionId = $currentConnection.map((conn) =>
  conn ? conn.id : -1,
);

export const createConnectionForm = createForm<keyof InsertConnectionVars>({
  fields: {
    title: {
      default: "",
      validator: notEmpty("Title is required"),
    },
    description: {
      default: "",
    },
    host: {
      default: "",
      validator: notEmpty("Host is required"),
    },
    port: {
      default: "",
      validator: notEmpty("Port is required"),
    },
  },
});
