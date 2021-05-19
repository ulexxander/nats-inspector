import React from "react";
import { Page } from "../../components/elements/layout";
import { ActiveSubscriptions } from "./ActiveSubscriptions";
import { AddSubscription } from "./AddSubscription";
import { PausedSubscriptions } from "./PausedSubscriptions";

export const SubscriptionsPage: React.FC = () => {
  return (
    <Page>
      <div className="flex space-x-4">
        <ActiveSubscriptions />
        <PausedSubscriptions />
      </div>

      <div>
        <AddSubscription />
      </div>
    </Page>
  );
};
