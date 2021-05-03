import { useStore } from "effector-react";
import React from "react";
import { SubscribtionStructure } from "./api/subscribtionsApi";
import { FilledButton } from "./components/elements/buttons";
import { InputReflected } from "./components/elements/inputs";
import { Page } from "./components/elements/layout";
import { $subMessages } from "./domains/subMessages/subMessagesUnits";
import {
  $createSubError,
  $subscribtions,
  createSubForm,
} from "./domains/subscribtions/subscribtionsUnits";

const SubscribtionsListTile: React.FC<{ data: SubscribtionStructure }> = ({
  data,
}) => {
  return (
    <li>
      <p>{data}</p>
    </li>
  );
};

const SubscribtionsList: React.FC = () => {
  const subs = useStore($subscribtions);

  if (!subs) {
    return <p>Loading...</p>;
  }

  if (!subs.length) {
    return <p>No subscribtions...</p>;
  }

  const subsList = subs.map((sub) => (
    <SubscribtionsListTile key={sub} data={sub} />
  ));

  return <ul className="mt-4">{subsList}</ul>;
};

const SubscribtionSubject = createSubForm.reflect("subject", InputReflected);

const CreateSubscribtion: React.FC = () => {
  const createSubErr = useStore($createSubError);

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          createSubForm.send();
        }}
      >
        <SubscribtionSubject
          type="text"
          name="subject"
          label="Add new subject"
          placeholder="Subject"
          error={createSubErr}
        />

        <FilledButton>Subscribe</FilledButton>
      </form>
    </div>
  );
};

const SubMessageTile: React.FC<{ data: unknown }> = ({ data }) => {
  return (
    <li>
      <pre>{JSON.stringify(data)}</pre>
    </li>
  );
};

const SubscribtionMessages: React.FC = () => {
  const messages = useStore($subMessages);

  const messagesList = messages.map((message) => (
    <SubMessageTile key={message.id} data={message.data} />
  ));

  return <ul className="mt-4">{messagesList}</ul>;
};

export const FirstPage: React.FC = () => {
  return (
    <Page>
      <div className="flex space-x-10">
        <div className="flex-1">
          <h3 className="text-xl">Current subscribtions</h3>
          <SubscribtionsList />

          <CreateSubscribtion />
        </div>

        <div className="flex-1">
          <h3 className="text-xl">Incoming messages</h3>
          <SubscribtionMessages />
        </div>
      </div>
    </Page>
  );
};
