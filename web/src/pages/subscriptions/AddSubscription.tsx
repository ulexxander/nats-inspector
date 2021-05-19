import { useStore } from "effector-react";
import React from "react";
import { OutlinedButton } from "../../components/elements/buttons";
import { Surface } from "../../components/elements/containers";
import { ErrorBox } from "../../components/elements/errors";
import { InputReflected } from "../../components/elements/inputs";
import { createSubMutation } from "../../domains/subscriptions/subscriptionsRequests";
import { createSubscriptionForm } from "../../domains/subscriptions/subscriptionsUnits";

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

export const AddSubscription: React.FC = () => {
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
