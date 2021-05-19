import React from "react";
import {
  ActiveSubscription,
  PausedSubscription,
} from "../../../../shared/types";
import { OutlinedButton } from "../../components/elements/buttons";
import { FieldTable } from "../../components/elements/tables";
import {
  deleteSubMutation,
  pauseSubMutation,
  resumeSubMutation,
} from "../../domains/subscriptions/subscriptionsRequests";

const SubscriptionButtons: React.FC<{
  sub: ActiveSubscription | PausedSubscription;
}> = ({ sub }) => {
  const { id } = sub.model;

  return (
    <div className="space-x-2">
      {sub.type === "active" && (
        <OutlinedButton
          btnColor="blue"
          small
          onClick={() => {
            pauseSubMutation.run({ id });
          }}
        >
          Pause
        </OutlinedButton>
      )}

      {sub.type === "paused" && (
        <OutlinedButton
          btnColor="green"
          small
          onClick={() => {
            resumeSubMutation.run({ id });
          }}
        >
          Resume
        </OutlinedButton>
      )}

      <OutlinedButton
        btnColor="red"
        small
        onClick={() => {
          deleteSubMutation.run({ id });
        }}
      >
        Remove
      </OutlinedButton>
    </div>
  );
};

export const SubscriptionCard: React.FC<{
  sub: ActiveSubscription | PausedSubscription;
}> = ({ sub }) => {
  return (
    <li className="pb-4 mt-4 border-b border-gray-700">
      <div className="flex items-center justify-between">
        <p className="text-xl">
          Subject: <span className="text-green-500"> {sub.model.subject}</span>
        </p>

        <SubscriptionButtons sub={sub} />
      </div>

      <FieldTable
        entries={[
          {
            label: "Subscription ID",
            value: sub.model.id,
          },
          {
            label: "Created",
            value: sub.model.dateCreated,
          },
        ]}
        tableClass="mt-2"
      />
    </li>
  );
};
