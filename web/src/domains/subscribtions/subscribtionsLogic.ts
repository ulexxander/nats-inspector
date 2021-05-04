import { forward } from "effector";
import {
  $createSubError,
  $subscribtions,
  createSubForm,
  createSubFx,
  deleteSub,
  deleteSubFx,
  getAllSubsFx,
} from "./subscribtionsUnits";

$subscribtions
  .on(getAllSubsFx.doneData, (_, subscribtions) => subscribtions)
  .on(createSubFx.doneData, (subs, newSub) => (subs ? [...subs, newSub] : null))
  .on(deleteSubFx.doneData, (subs, deleted) =>
    subs ? subs.filter(({ subject }) => subject !== deleted.subject) : null
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
