import { useStore } from "effector-react";
import React from "react";
import { OutlinedButton } from "../components/elements/buttons";
import { Surface } from "../components/elements/containers";
import { Input } from "../components/elements/inputs";
import { Page } from "../components/elements/layout";
import { JsonEditor } from "../components/JsonEditor";
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
  resetRequestPayload,
  resetRequestResult,
  sendRequest,
  sendRequestMutation,
  setRequestPayload,
  setRequestResult,
  setRequestSubject,
} from "../domains/requests/requestsUnits";
import { truncate } from "../lib/texts";

const RequestError: React.FC = () => {
  const error = useStore(sendRequestMutation.error);

  if (!error) {
    return null;
  }

  return (
    <div>
      <p className="mt-4 text-lg text-red-500">{error.message}</p>
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

const NewRequest: React.FC = () => {
  return (
    <div className="flex-1">
      <div className="flex items-center justify-between">
        <h3>Request</h3>

        <OutlinedButton
          btnColor="red"
          small
          onClick={() => {
            resetRequestPayload();
          }}
        >
          Clear
        </OutlinedButton>
      </div>

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

const RequestResult: React.FC = () => {
  return (
    <div className="flex-1">
      <div className="flex items-center justify-between">
        <h3>Response</h3>

        <OutlinedButton
          btnColor="red"
          small
          onClick={() => {
            resetRequestResult();
          }}
        >
          Clear
        </OutlinedButton>
      </div>

      <JsonEditor
        initial={$requestResult}
        onChange={setRequestResult}
        setValue={copyRequestResult}
      />

      <RequestError />
    </div>
  );
};

const PreviousRequestTile: React.FC<{ request: PreviousRequest }> = ({
  request,
}) => {
  return (
    <li className="flex mt-4 space-x-8 overflow-hidden">
      <div className="flex-shrink-0">
        <h4>
          Subject:{" "}
          <span className="text-green-500">{request.input.subject}</span>
        </h4>
        <p className="caption">Created: {request.output.dateCreated}</p>

        <div className="mt-3 space-x-4">
          <OutlinedButton
            btnColor="green"
            small
            onClick={() => {
              copyRequestPayload(request.input.payload || "");
              copyRequestResultFormatted(request.output.result);
              setRequestSubject(request.input.subject);
            }}
          >
            Copy
          </OutlinedButton>

          <OutlinedButton
            btnColor="red"
            small
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
            <td className="pl-5 font-mono text-sm">
              {truncate(request.input.payload || "", 300)}
            </td>
          </tr>
          <tr>
            <th>Output</th>
            <td className="pl-5 font-mono text-sm">
              {truncate(request.output.result, 300)}
            </td>
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
      <h3>Previous Requests</h3>

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

          <RequestResult />
        </div>
      </Surface>

      <Surface>
        <PreviousRequests />
      </Surface>
    </Page>
  );
};
