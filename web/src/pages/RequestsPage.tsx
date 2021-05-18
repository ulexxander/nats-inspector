import { useStore } from "effector-react";
import React from "react";
import { OutlinedButton } from "../components/elements/buttons";
import { Surface } from "../components/elements/containers";
import { Input } from "../components/elements/inputs";
import { Page } from "../components/elements/layout";
import { JsonEditor } from "../components/JsonEditor";
import { $currentConnection } from "../domains/connections/connectionsUnits";
import {
  $previousRequests,
  $requestPayload,
  $requestResult,
  $requestSubject,
  copyRequestPayload,
  copyRequestResult,
  copyRequestResultFormatted,
  deletePreviousRequest,
  PreviousRequest,
  sendRequest,
  sendRequestMutation,
  setRequestPayload,
  setRequestResult,
  setRequestSubject,
} from "../domains/requests/requestsUnits";

const RequestError: React.FC = () => {
  const error = useStore(sendRequestMutation.error);

  if (!error) {
    return null;
  }

  return (
    <div>
      <p className="mt-4 text-lg text-red-500">{error}</p>
    </div>
  );
};

const RequestSubject: React.FC = () => {
  const subject = useStore($requestSubject);

  return (
    <Input
      label="Request subject"
      placeholder="Subject"
      name="new-reqeust-subject"
      value={subject}
      onChange={(e) => setRequestSubject(e.target.value)}
    />
  );
};

const NewRequestTitle: React.FC = () => {
  const currentConn = useStore($currentConnection);
  const text = currentConn ? `Request (${currentConn.model.title})` : `Request`;
  return <h2>{text}</h2>;
};

const NewRequest: React.FC = () => {
  return (
    <div className="flex-1">
      <NewRequestTitle />

      <JsonEditor
        initial={$requestPayload}
        onChange={setRequestPayload}
        setValue={copyRequestPayload}
      />

      <RequestSubject />

      <OutlinedButton
        btnColor="blue"
        className="mt-4"
        onClick={() => sendRequest()}
      >
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
        initial={$requestResult}
        onChange={setRequestResult}
        setValue={copyRequestResultFormatted}
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
          Subject:{" "}
          <span className="text-green-500">{request.input.subject}</span>
        </h4>
        <p className="caption">Created: {request.output.dateCreated}</p>

        <div className="mt-3 space-x-4">
          <OutlinedButton
            btnColor="green"
            onClick={() => {
              // TODO: bring json formatting
              copyRequestPayload(request.input.payload);
              copyRequestResult(request.output.result);
              setRequestSubject(request.input.subject);
            }}
          >
            Copy
          </OutlinedButton>

          <OutlinedButton
            btnColor="red"
            onClick={() => deletePreviousRequest(request.output.id)}
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
            <td className="font-mono">{request.input.payload}</td>
          </tr>
        </tbody>
      </table>
    </li>
  );
};

const PreviousRequests: React.FC = () => {
  const requests = useStore($previousRequests);

  const tiles = requests.map((request) => (
    <PreviousRequestTile key={request.output.id} request={request} />
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
