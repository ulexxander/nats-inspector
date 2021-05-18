import { useStore } from "effector-react";
import React from "react";
import { Surface } from "../../components/elements/containers";
import { ErrorBox } from "../../components/elements/errors";
import { LoadingDots } from "../../components/elements/loading";
import { pausedConnsQuery } from "../../domains/connections/connectionsRequests";
import { ConnectionCard } from "./ConnectionCard";

const PausedConnectionsList: React.FC = () => {
  const conns = useStore(pausedConnsQuery.data);
  const connsError = useStore(pausedConnsQuery.error);

  if (connsError) {
    return <ErrorBox error={connsError} />;
  }

  if (!conns) {
    return <LoadingDots />;
  }

  if (!conns.length) {
    return <p className="caption">No paused connections</p>;
  }

  const listItems = conns.map((conn) => (
    <ConnectionCard key={conn.model.id} connection={conn} />
  ));

  return <ul>{listItems}</ul>;
};

export const PausedConnections: React.FC = () => {
  return (
    <Surface className="flex-1">
      <h3>Paused connections</h3>

      <PausedConnectionsList />
    </Surface>
  );
};
