import { forward } from "effector";
import {
  $subscribtions,
  createSubForm,
  createSubFx,
  getAllSubsFx,
} from "./subscribtionsUnits";

$subscribtions.on(getAllSubsFx.doneData, (_, subs) => subs);

forward({
  from: createSubForm.submitted,
  to: createSubFx,
});
