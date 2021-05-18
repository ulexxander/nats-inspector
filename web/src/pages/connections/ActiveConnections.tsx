import { useStore } from "effector-react";
import React from "react";
import { Surface } from "../../components/elements/containers";
import { ErrorBox } from "../../components/elements/errors";
import { LoadingDots } from "../../components/elements/loading";
import { activeConnsQuery } from "../../domains/connections/connectionsRequests";
import { ConnectionCard } from "./ConnectionCard";

const ActiveConnectionsList: React.FC = () => {
  const conns = useStore(activeConnsQuery.data);
  const connsError = useStore(activeConnsQuery.error);

  if (connsError) {
    return <ErrorBox error={connsError} />;
  }

  if (!conns) {
    return <LoadingDots />;
  }

  if (!conns.length) {
    return <p className="caption">No active connections yet</p>;
  }

  const listItems = conns.map((conn) => (
    <ConnectionCard key={conn.model.id} connection={conn} />
  ));

  return <ul>{listItems}</ul>;
};

export const ActiveConnections: React.FC = () => {
  return (
    <Surface className="flex-1">
      <h3>Active connections</h3>

      <ActiveConnectionsList />
    </Surface>
  );
};
