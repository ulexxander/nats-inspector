import { forward } from "effector";
import {
  $createSubError,
  $subscribtions,
  createSubForm,
  createSubFx,
  getAllSubsFx,
} from "./subscribtionsUnits";

$subscribtions.on(
  [getAllSubsFx.doneData, createSubFx.doneData],
  (_, { subscribtions }) => subscribtions
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
