import { forward, sample } from "effector";
import { $currentConnectionId } from "../connections/connectionsUnits";
import {
  $previousRequests,
  $requestPayload,
  $requestResult,
  $requestSubject,
  copyRequestResult,
  deletePreviousRequest,
  sendRequest,
  sendRequestMutation,
  setRequestPayload,
  setRequestResult,
  setRequestSubject,
} from "./requestsUnits";

$requestSubject.on(setRequestSubject, (_, reqSubject) => reqSubject);
$requestPayload.on(setRequestPayload, (_, reqPayload) => reqPayload);
$requestResult.on(setRequestResult, (_, reqResult) => reqResult);

sample({
  clock: sendRequest,
  source: {
    connectionId: $currentConnectionId,
    subject: $requestSubject,
    data: $requestPayload,
  },
  target: sendRequestMutation.run,
});

forward({
  from: sendRequestMutation.doneData.map(({ result }) => result),
  to: copyRequestResult,
});

$previousRequests.on(
  sendRequestMutation.done,
  (prevRequests, { params, result }) => [
    {
      input: params,
      output: result,
    },
    ...prevRequests,
  ],
);

$previousRequests.on(deletePreviousRequest, (requests, idToDelete) =>
  requests.filter((req) => req.output.id !== idToDelete),
);
