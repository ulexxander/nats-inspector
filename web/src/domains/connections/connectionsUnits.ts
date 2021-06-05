import { createEvent, createStore } from "effector";
import { InsertConnectionVars } from "../../../../shared/types";
import { createForm, notEmpty } from "../../lib/effector-forms";
import { persistScalar } from "../../lib/effector-localstorage";

export const $currentConnectionId = createStore<number>(-1);
persistScalar("connection_current", $currentConnectionId);

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
