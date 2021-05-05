import { useStore } from "effector-react";
import React from "react";
import { OutlinedButton } from "../components/elements/buttons";
import { Surface } from "../components/elements/containers";
import { Input } from "../components/elements/inputs";
import { Page } from "../components/elements/layout";
import { JsonEditor } from "../components/JsonEditor";
import {
  $previousRequests,
  $replyString,
  $requestDataString,
  $requestError,
  $requestSubject,
  deletePreviousRequest,
  PreviousRequest,
  sendRequest,
  setReplyString,
  setRequestDataString,
} from "../domains/requests/requestsUnits";

const RequestError: React.FC = () => {
  const error = useStore($requestError);

  return (
    <div>
      <p className="mt-4 text-lg text-red-500">{error}</p>
    </div>
  );
};

const RequestSubject: React.FC = () => {
  const subject = useStore($requestSubject.value);

  return (
    <Input
      label="Request subject"
      placeholder="Subject"
      name="subject"
      value={subject}
      onChange={(e) => $requestSubject.update(e.target.value)}
    />
  );
};

const NewRequest: React.FC = () => {
  return (
    <div className="flex-1">
      <h2>Request</h2>

      <JsonEditor
        initial={$requestDataString.value}
        onChange={$requestDataString.update}
        setValue={setRequestDataString}
      />

      <RequestSubject />

      <OutlinedButton btnColor="blue" onClick={() => sendRequest()}>
        Send
      </OutlinedButton>
    </div>
  );
};

const ReceivedResponse: React.FC = () => {
  return (
    <div className="flex-1">
      <h2>Response</h2>

      <JsonEditor
        initial={$replyString.value}
        onChange={$replyString.update}
        setValue={setReplyString}
      />

      <RequestError />
    </div>
  );
};

const PreviousRequestTile: React.FC<{ request: PreviousRequest }> = ({
  request,
}) => {
  return (
    <li className="flex mt-4 space-x-8">
      <div>
        <h4>
          Subject: <span className="text-green-500">{request.subject}</span>
        </h4>
        <p className="caption">Created: {request.dateCreated}</p>

        <div className="space-x-4">
          <OutlinedButton
            btnColor="green"
            onClick={() => {
              setRequestDataString(request.input);
              setReplyString(request.output);
              $requestSubject.update(request.subject);
            }}
          >
            Copy
          </OutlinedButton>

          <OutlinedButton
            btnColor="red"
            onClick={() => deletePreviousRequest(request.id)}
          >
            Delete
          </OutlinedButton>
        </div>
      </div>

      <table>
        <tbody>
          <tr>
            <th>Input</th>
            <td className="w-4" />
            <td className="font-mono">{request.input}</td>
          </tr>
        </tbody>
      </table>
    </li>
  );
};

const PreviousRequests: React.FC = () => {
  const requests = useStore($previousRequests.value);

  const tiles = requests.map((request) => (
    <PreviousRequestTile key={request.id} request={request} />
  ));

  return (
    <div>
      <h2>Previous Requests</h2>

      <ul>{tiles}</ul>
    </div>
  );
};

export const RequestsPage: React.FC = () => {
  return (
    <Page>
      <Surface>
        <div className="flex justify-between space-x-10">
          <NewRequest />

          <ReceivedResponse />
        </div>
      </Surface>

      <Surface>
        <PreviousRequests />
      </Surface>
    </Page>
  );
};
