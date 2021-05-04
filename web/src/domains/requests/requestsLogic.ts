import { forward } from "effector";
import {
  $requestError,
  $requestResult,
  sendRequestForm,
  sendRequestFx,
} from "./requestsUnits";

$requestResult.on(sendRequestFx.doneData, (_, result) => result);
$requestError.on(sendRequestFx.failData, (_, { message }) => message);

forward({
  from: sendRequestForm.submitted,
  to: sendRequestFx,
});
