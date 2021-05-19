import { useStore } from "effector-react";
import React from "react";
import { Surface } from "../../components/elements/containers";
import { ErrorBox } from "../../components/elements/errors";
import { LoadingDots } from "../../components/elements/loading";
import { activeSubsQuery } from "../../domains/subscriptions/subscriptionsRequests";
import { $currentConnActiveSubs } from "../../domains/subscriptions/subscriptionsUnits";
import { SubscriptionCard } from "./SubscriptionCard";

const ActiveSubscriptionsList: React.FC = () => {
  const subs = useStore($currentConnActiveSubs);
  const subsError = useStore(activeSubsQuery.error);

  if (subsError) {
    return <ErrorBox error={subsError} />;
  }

  if (!subs) {
    return <LoadingDots />;
  }

  if (!subs.length) {
    return <p className="caption">No active subscriptions yet</p>;
  }

  const listItems = subs.map((sub) => (
    <SubscriptionCard key={sub.model.id} sub={sub} />
  ));

  return <ul>{listItems}</ul>;
};

export const ActiveSubscriptions: React.FC = () => {
  return (
    <Surface className="flex-1">
      <h3>Active subscriptions</h3>

      <ActiveSubscriptionsList />
    </Surface>
  );
};
