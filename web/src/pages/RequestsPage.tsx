import Editor, { EditorProps } from "@monaco-editor/react";
import { useStore } from "effector-react";
import React from "react";
import { FilledButton } from "../components/elements/buttons";
import { InputReflected } from "../components/elements/inputs";
import { Page } from "../components/elements/layout";
import { H2 } from "../components/elements/typography";
import {
  $requestError,
  $requestResult,
  sendRequestForm,
} from "../domains/requests/requestsUnits";

const RequestError: React.FC = () => {
  const error = useStore($requestError);

  return (
    <div>
      <p className="text-red-500">{error}</p>
    </div>
  );
};

const editorPropsBase: EditorProps = {
  className: "my-4",
  height: "50vh",
  defaultLanguage: "json",
  theme: "vs-dark",
  options: {
    tabSize: 2,
    minimap: {
      enabled: false,
    },
  },
};

const RequestSubject = sendRequestForm.reflect("subject", InputReflected);

const NewRequest: React.FC = () => {
  const editorProps: EditorProps = {
    ...editorPropsBase,
    value: useStore(sendRequestForm.values["data"]) as string,
    onChange(val) {
      sendRequestForm.updaters["data"](val || "");
    },
  };

  return (
    <div className="flex-1">
      <H2>Request</H2>

      <Editor {...editorProps} />

      <RequestSubject
        label="Request subject"
        placeholder="Subject"
        name="subject"
      />

      <FilledButton fillColor="blue" onClick={() => sendRequestForm.send()}>
        Send
      </FilledButton>
    </div>
  );
};

const ReceivedResponse: React.FC = () => {
  const reply = useStore($requestResult)?.reply;
  const replyStringified = JSON.stringify(reply, null, 2);

  const editorProps: EditorProps = {
    ...editorPropsBase,
    defaultValue: "// nothing yet",
    value: replyStringified,
  };

  return (
    <div className="flex-1">
      <H2>Response</H2>

      <Editor {...editorProps} />

      <RequestError />
    </div>
  );
};

export const RequestsPage: React.FC = () => {
  return (
    <Page>
      <div className="flex justify-between space-x-10">
        <NewRequest />

        <ReceivedResponse />
      </div>
    </Page>
  );
};
