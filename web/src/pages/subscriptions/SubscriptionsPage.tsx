import { useStore } from "effector-react";
import React from "react";
import { OutlinedButton } from "../../components/elements/buttons";
import { Surface } from "../../components/elements/containers";
import { ErrorBox } from "../../components/elements/errors";
import { InputReflected } from "../../components/elements/inputs";
import { Page } from "../../components/elements/layout";
import { createSubMutation } from "../../domains/subscriptions/subscriptionsRequests";
import { createSubscriptionForm } from "../../domains/subscriptions/subscriptionsUnits";
import { ActiveSubscriptions } from "./ActiveSubscriptions";
import { PausedSubscriptions } from "./PausedSubscriptions";

const CreateSubError: React.FC = () => {
  const createSubErr = useStore(createSubMutation.error);
  if (createSubErr) {
    return <ErrorBox error={createSubErr} />;
  }

  return null;
};

const SubscriptionSubject = createSubscriptionForm.reflect(
  "subject",
  InputReflected,
);

const CreateSubscription: React.FC = () => {
  return (
    <Surface>
      <h3>Create subscription</h3>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          createSubscriptionForm.submit();
        }}
      >
        <SubscriptionSubject
          type="text"
          name="new-sub-subject"
          label="Subject"
          placeholder="subject.sub.ject"
        />

        <OutlinedButton type="submit" btnColor="blue" className="mt-4">
          Subscribe
        </OutlinedButton>
      </form>

      <CreateSubError />
    </Surface>
  );
};

export const SubscriptionsPage: React.FC = () => {
  return (
    <Page>
      <div className="flex space-x-4">
        <ActiveSubscriptions />
        <PausedSubscriptions />
      </div>

      <div>
        <CreateSubscription />
      </div>
    </Page>
  );
};
