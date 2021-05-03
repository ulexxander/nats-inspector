import { useStore } from "effector-react";
import React from "react";
import { SubscribtionStructure } from "./api/subscribtionsApi";
import { FilledButton } from "./components/elements/buttons";
import { InputReflected } from "./components/elements/inputs";
import { Page } from "./components/elements/layout";
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

export const FirstPage: React.FC = () => {
  return (
    <Page>
      <h3 className="text-xl">Current subscribtions</h3>
      <SubscribtionsList />

      <CreateSubscribtion />
    </Page>
  );
};
