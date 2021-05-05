import { forward, sample } from "effector";
import { nanoid } from "nanoid";
import {
  $previousRequests,
  $requestDataString,
  $requestError,
  $requestSubject,
  deletePreviousRequest,
  sendRequest,
  sendRequestFx,
  setReplyString,
} from "./requestsUnits";

$requestError
  .on(sendRequestFx.failData, (_, { message }) => message)
  .reset(sendRequestFx);

sample({
  clock: sendRequest,
  source: {
    subject: $requestSubject.value,
    data: $requestDataString.value,
  },
  target: sendRequestFx,
});

forward({
  from: sendRequestFx.doneData.map((res) =>
    res ? JSON.stringify(res.reply, null, 2) : "// nothing for now"
  ),
  to: setReplyString,
});

sample({
  clock: sendRequestFx.done,
  source: $previousRequests.value,
  fn(prev, { params, result }) {
    return [
      {
        id: nanoid(),
        subject: params.subject as string,
        input: params.data as string,
        output: JSON.stringify(result.reply, null, 2),
        dateCreated: new Date().toISOString(),
      },
      ...prev,
    ];
  },
  target: $previousRequests.update,
});

sample({
  clock: deletePreviousRequest,
  source: $previousRequests.value,
  fn(requests, idToDelete) {
    return requests.filter((req) => req.id !== idToDelete);
  },
  target: $previousRequests.update,
});
