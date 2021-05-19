import { useStore } from "effector-react";
import React from "react";
import { OutlinedButton } from "../../components/elements/buttons";
import { Surface } from "../../components/elements/containers";
import { ErrorBox } from "../../components/elements/errors";
import { InputReflected } from "../../components/elements/inputs";
import { LoadingDots } from "../../components/elements/loading";
import { createConnMutation } from "../../domains/connections/connectionsRequests";
import { createConnectionForm } from "../../domains/connections/connectionsUnits";

const ConnectionTitle = createConnectionForm.reflect("title", InputReflected);
const ConnectionDescription = createConnectionForm.reflect(
  "description",
  InputReflected,
);
const ConnectionServer = createConnectionForm.reflect("server", InputReflected);

export const AddConnectionForm: React.FC = () => {
  return (
    <div>
      <h3>Add new connection</h3>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          createConnectionForm.submit();
        }}
      >
        <ConnectionTitle
          name="new-connection-title"
          label="Title"
          placeholder="my fancy connection"
        />
        <ConnectionDescription
          name="new-connection-description"
          label="Description"
          placeholder="optional"
        />
        <ConnectionServer
          name="new-connection-server"
          label="Server"
          placeholder="nats://somehost:4222"
        />

        <OutlinedButton type="submit" className="mt-5" btnColor="green">
          Create
        </OutlinedButton>
      </form>
    </div>
  );
};

export const AddConnectionRight: React.FC = () => {
  const loading = useStore(createConnMutation.loading);
  const error = useStore(createConnMutation.error);

  if (loading) {
    return <LoadingDots>Adding connection</LoadingDots>;
  }

  if (error) {
    return <ErrorBox error={error} />;
  }

  return <div></div>;
};

export const AddConnection: React.FC = () => {
  return (
    <Surface>
      <div className="flex items-start space-x-8">
        <AddConnectionForm />
        <AddConnectionRight />
      </div>
    </Surface>
  );
};
