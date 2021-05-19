import { useStore } from "effector-react";
import React from "react";
import { ActiveConnection, PausedConnection } from "../../../../shared/types";
import { OutlinedButton } from "../../components/elements/buttons";
import { ErrorBox } from "../../components/elements/errors";
import { LoadingDots } from "../../components/elements/loading";
import { FieldTable } from "../../components/elements/tables";
import {
  deleteConnMutation,
  pauseConnMutation,
  resumeConnMutation,
} from "../../domains/connections/connectionsRequests";

const ConnectionResumingStatus: React.FC = () => {
  const loading = useStore(resumeConnMutation.loading);
  if (!loading) {
    return null;
  }

  return <LoadingDots className="mt-0 mr-4">Resuming</LoadingDots>;
};

const ConnectionButtons: React.FC<{
  connection: ActiveConnection | PausedConnection;
}> = ({ connection }) => {
  const { id } = connection.model;

  return (
    <div className="flex items-center">
      <ConnectionResumingStatus />
      {connection.type === "paused" && (
        <OutlinedButton
          small
          btnColor="green"
          onClick={() => {
            resumeConnMutation.run({ id });
          }}
        >
          Resume
        </OutlinedButton>
      )}

      {connection.type === "active" && (
        <OutlinedButton
          small
          btnColor="blue"
          className="ml-2"
          onClick={() => {
            pauseConnMutation.run({ id });
          }}
        >
          Pause
        </OutlinedButton>
      )}

      <OutlinedButton
        small
        btnColor="red"
        className="ml-2"
        onClick={() => {
          deleteConnMutation.run({ id });
        }}
      >
        Delete
      </OutlinedButton>
    </div>
  );
};

export const ConnectionCard: React.FC<{
  connection: ActiveConnection | PausedConnection;
}> = ({ connection }) => {
  const { id, description, server, dateCreated, dateUpdated } =
    connection.model;

  const descriptionText = description || "(No description)";

  const fieldTableEntries = [
    { label: "ID", value: id },
    { label: "Server", value: server },
    { label: "Created", value: dateCreated },
  ];

  if (dateUpdated) {
    fieldTableEntries.push({ label: "Updated", value: dateUpdated });
  }

  return (
    <li className="pb-4 mt-4 border-b border-gray-700">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-yellow-400">{connection.model.title}</h4>
          <p className="caption">{descriptionText}</p>
        </div>

        <ConnectionButtons connection={connection} />
      </div>

      {connection.type === "paused" && connection.error && (
        <ErrorBox error={connection.error.message} />
      )}

      <div className="mt-2">
        <FieldTable entries={fieldTableEntries} />
      </div>
    </li>
  );
};
