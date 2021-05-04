import { useStore } from "effector-react";
import React from "react";
import { NatsSub, WsSubMessageEvent } from "../../../shared/types";
import { FilledButton } from ".././components/elements/buttons";
import { InputReflected } from ".././components/elements/inputs";
import { Page } from ".././components/elements/layout";
import { $subMessages } from ".././domains/subMessages/subMessagesUnits";
import { Caption, H2 } from "../components/elements/typography";
import {
  $createSubError,
  $subscribtions,
  createSubForm,
  deleteSub,
} from "../domains/subscribtions/subscribtionsUnits";

const SubscribtionsListTile: React.FC<{ data: NatsSub }> = ({ data }) => {
  return (
    <li className="mt-4">
      <h4>
        Subject: <b>"{data.subject}"</b>
      </h4>
      <Caption>Created: {data.dateCreated}</Caption>

      <FilledButton
        fillColor="red"
        onClick={() => deleteSub({ subject: data.subject })}
      >
        Remove
      </FilledButton>
    </li>
  );
};

const SubscribtionsList: React.FC = () => {
  const subs = useStore($subscribtions);

  if (!subs) {
    return <Caption>Loading...</Caption>;
  }

  if (!subs.length) {
    return <Caption>No subscribtions...</Caption>;
  }

  const subsList = subs.map((sub) => (
    <SubscribtionsListTile key={sub.subject} data={sub} />
  ));

  return <ol className="mt-4 ml-4 list-decimal">{subsList}</ol>;
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
          label="Add new subscribtion"
          placeholder="Subject"
          error={createSubErr}
        />

        <FilledButton type="submit" fillColor="blue">
          Subscribe
        </FilledButton>
      </form>
    </div>
  );
};

const SubMessageTile: React.FC<{ message: WsSubMessageEvent["payload"] }> = ({
  message,
}) => {
  return (
    <li className="flex items-center">
      <p className="flex-1 mr-3 text-nats-g">{message.subject}</p>

      <pre className="">{JSON.stringify(message.data)}</pre>
    </li>
  );
};

const SubscribtionMessages: React.FC = () => {
  const messages = useStore($subMessages);

  if (!messages.length) {
    return <Caption>No messages yet</Caption>;
  }

  const messagesList = messages.map((message) => (
    <SubMessageTile key={message.id} message={message} />
  ));

  return <ul className="mt-4">{messagesList}</ul>;
};

export const SubscribtionsPage: React.FC = () => {
  return (
    <Page>
      <div className="flex space-x-10">
        <div className="flex-1">
          <H2>Subscribtions</H2>
          <SubscribtionsList />

          <CreateSubscribtion />
        </div>

        <div className="flex-2">
          <H2>Incoming messages</H2>
          <SubscribtionMessages />
        </div>
      </div>
    </Page>
  );
};
