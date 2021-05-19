import { useStore } from "effector-react";
import React from "react";
import { Surface } from "../../components/elements/containers";
import { ErrorBox } from "../../components/elements/errors";
import { LoadingDots } from "../../components/elements/loading";
import { pausedSubsQuery } from "../../domains/subscriptions/subscriptionsRequests";
import { $currentConnPausedSubs } from "../../domains/subscriptions/subscriptionsUnits";
import { SubscriptionCard } from "./SubscriptionCard";

const PausedSubscriptionsList: React.FC = () => {
  const subs = useStore($currentConnPausedSubs);
  const subsError = useStore(pausedSubsQuery.error);

  if (subsError) {
    return <ErrorBox error={subsError} />;
  }

  if (!subs) {
    return <LoadingDots />;
  }

  if (!subs.length) {
    return <p className="caption">No paused subscriptions yet</p>;
  }

  const listItems = subs.map((sub) => (
    <SubscriptionCard key={sub.model.id} sub={sub} />
  ));

  return <ul>{listItems}</ul>;
};

export const PausedSubscriptions: React.FC = () => {
  return (
    <Surface className="flex-1">
      <h3>Paused subscriptions</h3>

      <PausedSubscriptionsList />
    </Surface>
  );
};
