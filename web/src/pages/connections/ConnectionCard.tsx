import React from "react";
import { ActiveConnection, PausedConnection } from "../../../../shared/types";
import { ErrorBox } from "../../components/elements/errors";
import { FieldTable } from "../../components/elements/tables";

export const ConnectionCard: React.FC<{
  connection: ActiveConnection | PausedConnection;
}> = ({ connection }) => {
  const { id, description, host, port, dateCreated, dateUpdated } =
    connection.model;

  const descriptionText = description || "(No description)";
  const server = host + ":" + port;

  const fieldTableEntries = [
    { label: "ID", value: id },
    { label: "Server", value: server },
    { label: "Created", value: dateCreated },
  ];

  if (dateUpdated) {
    fieldTableEntries.push({ label: "Updated", value: dateUpdated });
  }

  return (
    <li className="mt-2">
      <h4 className="text-yellow-400">{connection.model.title}</h4>
      <p className="caption">{descriptionText}</p>

      {"error" in connection && connection.error && (
        <ErrorBox error={connection.error.message} />
      )}

      <div className="mt-2">
        <FieldTable entries={fieldTableEntries} />
      </div>
    </li>
  );
};
