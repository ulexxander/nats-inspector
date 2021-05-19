import { createEvent, createStore } from "effector";
import {
  ActiveConnection,
  InsertConnectionVars,
} from "../../../../shared/types";
import { createForm, notEmpty } from "../../lib/effector-forms";

// TODO: persist conn id, and implement stuff using combine, not setting it directly
export const $currentConnection = createStore<ActiveConnection | null>(null);
export const $currentConnectionId = $currentConnection.map((conn) =>
  conn ? conn.model.id : -1,
);

export const setCurrentConnection = createEvent<ActiveConnection | null>();

export const createConnectionForm = createForm<keyof InsertConnectionVars>({
  fields: {
    title: {
      default: "",
      validator: notEmpty("Title is required"),
    },
    description: {
      default: "",
    },
    server: {
      default: "",
      validator: notEmpty("Server is required"),
    },
  },
});
