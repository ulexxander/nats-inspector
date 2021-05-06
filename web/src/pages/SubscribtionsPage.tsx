import { useStore } from "effector-react";
import React from "react";
import { NatsSub } from "../../../shared/types";
import { OutlinedButton } from ".././components/elements/buttons";
import { InputReflected } from ".././components/elements/inputs";
import { Page } from ".././components/elements/layout";
import { Surface } from "../components/elements/containers";
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
        Subject: <span className="text-green-500">{data.subject}</span>
      </h4>
      <p className="caption">Created: {data.dateCreated}</p>

      <OutlinedButton
        btnColor="red"
        onClick={() => deleteSub({ subject: data.subject })}
      >
        Remove
      </OutlinedButton>
    </li>
  );
};

const SubscribtionsList: React.FC = () => {
  const subs = useStore($subscribtions);

  if (!subs) {
    return <p className="caption">Loading...</p>;
  }

  if (!subs.length) {
    return <p className="caption">No subscribtions yet</p>;
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

        <OutlinedButton type="submit" btnColor="blue">
          Subscribe
        </OutlinedButton>
      </form>
    </div>
  );
};

export const SubscribtionsPage: React.FC = () => {
  return (
    <Page>
      <Surface>
        <h2>Subscribtions</h2>
        <SubscribtionsList />

        <CreateSubscribtion />
      </Surface>
    </Page>
  );
};
