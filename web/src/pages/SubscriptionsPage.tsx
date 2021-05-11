import { useStore } from "effector-react";
import React from "react";
import { NatsSub } from "../../../shared/types";
import { OutlinedButton } from "../components/elements/buttons";
import { Surface } from "../components/elements/containers";
import { InputReflected } from "../components/elements/inputs";
import { Page } from "../components/elements/layout";
import {
  $createSubError,
  $subscriptions,
  createSubForm,
  deleteSub,
} from "../domains/subscriptions/subscriptionsUnits";

const SubscriptionsListTile: React.FC<{ data: NatsSub }> = ({ data }) => {
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

const SubscriptionsList: React.FC = () => {
  const subs = useStore($subscriptions);

  if (!subs) {
    return <p className="caption">Loading...</p>;
  }

  if (!subs.length) {
    return <p className="caption">No subscriptions yet</p>;
  }

  const subsList = subs.map((sub) => (
    <SubscriptionsListTile key={sub.subject} data={sub} />
  ));

  return <ol className="mt-4 ml-4 list-decimal">{subsList}</ol>;
};

const SubscriptionSubject = createSubForm.reflect("subject", InputReflected);

const CreateSubscription: React.FC = () => {
  const createSubErr = useStore($createSubError);

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          createSubForm.send();
        }}
      >
        <SubscriptionSubject
          type="text"
          name="subject"
          label="Add new subscription"
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

export const SubscriptionsPage: React.FC = () => {
  return (
    <Page>
      <Surface>
        <h2>Subscriptions</h2>
        <SubscriptionsList />

        <CreateSubscription />
      </Surface>
    </Page>
  );
};
