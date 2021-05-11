import { forward } from "effector";
import {
  $createSubError,
  $subscriptions,
  createSubForm,
  createSubFx,
  deleteSub,
  deleteSubFx,
  getAllSubsFx,
} from "./subscriptionsUnits";

$subscriptions
  .on(getAllSubsFx.doneData, (_, subscriptions) => subscriptions)
  .on(createSubFx.doneData, (subs, newSub) => (subs ? [...subs, newSub] : null))
  .on(deleteSubFx.doneData, (subs, deleted) =>
    subs ? subs.filter(({ subject }) => subject !== deleted.subject) : null,
  );

$createSubError
  .on(createSubFx.failData, (_, { message }) => message)
  .reset(createSubFx);

forward({
  from: createSubForm.submitted,
  to: createSubFx,
});

forward({
  from: createSubFx.doneData,
  to: createSubForm.reset,
});

forward({
  from: deleteSub,
  to: deleteSubFx,
});
