import { useStore } from "effector-react";
import React from "react";
import { ActiveSubscription } from "../../../shared/types";
import { OutlinedButton } from "../components/elements/buttons";
import { Surface } from "../components/elements/containers";
import { InputReflected } from "../components/elements/inputs";
import { Page } from "../components/elements/layout";
import {
  activeSubsQuery,
  createSubMutation,
} from "../domains/subscriptions/subscriptionsRequests";
import {
  createSubscriptionForm,
  deleteSubscription,
} from "../domains/subscriptions/subscriptionsUnits";

const SubscriptionsListTile: React.FC<{ sub: ActiveSubscription }> = ({
  sub,
}) => {
  const { id, subject, dateCreated } = sub.model;

  return (
    <li className="mt-4">
      <h4>
        Subject: <span className="text-green-500">{subject}</span>
      </h4>
      <p className="caption">Created: {dateCreated}</p>

      <OutlinedButton btnColor="red" onClick={() => deleteSubscription({ id })}>
        Remove
      </OutlinedButton>
    </li>
  );
};

const SubscriptionsList: React.FC = () => {
  const activeSubs = useStore(activeSubsQuery.data);

  if (!activeSubs) {
    return <p className="caption">Loading...</p>;
  }

  if (!activeSubs.length) {
    return <p className="caption">No subscriptions yet</p>;
  }

  const subsList = activeSubs.map((sub) => (
    <SubscriptionsListTile key={sub.model.subject} sub={sub} />
  ));

  return <ol className="mt-4 ml-4 list-decimal">{subsList}</ol>;
};

const SubscriptionSubject = createSubscriptionForm.reflect(
  "subject",
  InputReflected,
);

const CreateSubscription: React.FC = () => {
  const createSubErr = useStore(createSubMutation.error);

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          createSubscriptionForm.submit();
        }}
      >
        <SubscriptionSubject
          type="text"
          name="new-sub-subject"
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
