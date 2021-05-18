import React from "react";
import { Page } from "../../components/elements/layout";
import { ActiveConnections } from "./ActiveConnections";
import { AddConnection } from "./AddConnection";
import { PausedConnections } from "./PausedConnections";

export const ConnectionsPage: React.FC = () => {
  return (
    <Page>
      <div className="flex space-x-4">
        <ActiveConnections />
        <PausedConnections />
      </div>

      <div>
        <AddConnection />
      </div>
    </Page>
  );
};
