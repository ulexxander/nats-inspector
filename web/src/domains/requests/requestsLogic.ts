import { forward, sample } from "effector";
import { nanoid } from "nanoid";
import {
  $previousRequests,
  $requestError,
  $requestInput,
  $requestOutput,
  $requestSubject,
  copyRequestOutput,
  deletePreviousRequest,
  sendRequest,
  sendRequestFx,
  setRequestInput,
  setRequestOutput,
  setRequestSubject,
} from "./requestsUnits";

$requestError
  .on(sendRequestFx.failData, (_, { message }) => message)
  .reset(sendRequestFx);

$requestSubject.on(setRequestSubject, (_, reqSubject) => reqSubject);
$requestInput.on(setRequestInput, (_, reqInput) => reqInput);
$requestOutput.on(setRequestOutput, (_, reqOutput) => reqOutput);

sample({
  clock: sendRequest,
  source: {
    subject: $requestSubject,
    data: $requestInput,
  },
  target: sendRequestFx,
});

forward({
  from: sendRequestFx.doneData.map((res) =>
    res ? JSON.stringify(res.reply, null, 2) : "// nothing for now",
  ),
  to: copyRequestOutput,
});

$previousRequests.on(sendRequestFx.done, (prevRequests, { params, result }) => [
  {
    id: nanoid(),
    subject: params.subject as string,
    input: params.data as string,
    output: JSON.stringify(result.reply, null, 2),
    dateCreated: new Date().toISOString(),
  },
  ...prevRequests,
]);

$previousRequests.on(deletePreviousRequest, (requests, idToDelete) =>
  requests.filter((req) => req.id !== idToDelete),
);
