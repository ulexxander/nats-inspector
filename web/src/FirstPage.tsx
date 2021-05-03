import { useStore } from "effector-react";
import React from "react";
import { SubscribtionStructure } from "./api/subscribtionsApi";
import { FilledButton } from "./components/elements/buttons";
import { InputReflected } from "./components/elements/inputs";
import { Page } from "./components/elements/layout";
import {
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
    return <p>No subs</p>;
  }

  const subsList = subs.map((sub) => (
    <SubscribtionsListTile key={sub} data={sub} />
  ));

  return <ul>{subsList}</ul>;
};

const SubscribtionSubject = createSubForm.reflect("subject", InputReflected);

const CreateSubscribtion: React.FC = () => {
  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          createSubForm.send();
        }}
      >
        <SubscribtionSubject type="text" label="Subject" />

        <FilledButton>test</FilledButton>
      </form>
    </div>
  );
};

export const FirstPage: React.FC = () => {
  return (
    <Page>
      <SubscribtionsList />

      <CreateSubscribtion />
    </Page>
  );
};
