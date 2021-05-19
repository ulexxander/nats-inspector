import { combine, createEvent, createStore } from "effector";
import { InsertConnectionVars } from "../../../../shared/types";
import { createForm, notEmpty } from "../../lib/effector-forms";
import { persistScalar } from "../../lib/effector-localstorage";
import { activeConnsQuery } from "./connectionsRequests";

export const $currentConnectionId = createStore<number>(-1);
persistScalar("connection_current", $currentConnectionId);

export const $currentConnection = combine(
  activeConnsQuery.data,
  $currentConnectionId,
  (activeConns, currentId) => {
    return activeConns?.find((conn) => conn.model.id === currentId) || null;
  },
);

export const setCurrentConnectionId = createEvent<number>();

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
