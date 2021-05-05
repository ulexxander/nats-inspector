import { useStore } from "effector-react";
import React from "react";
import { WsSubMessageEvent } from "../../../shared/types";
import { Surface } from "../components/elements/containers";
import { Page } from "../components/elements/layout";
import { $subMessages } from "../domains/subMessages/subMessagesUnits";

const SubMessageTile: React.FC<{ message: WsSubMessageEvent["payload"] }> = ({
  message,
}) => {
  return (
    <tr>
      <td className="text-green-400">{message.subject}</td>
      <td className="w-12"></td>
      <td>{JSON.stringify(message.data, null, 2)}</td>
    </tr>
  );
};

const SubscribtionMessages: React.FC = () => {
  const messages = useStore($subMessages);

  if (!messages.length) {
    return <p className="caption">No messages yet</p>;
  }

  const messagesList = messages.map((message) => (
    <SubMessageTile key={message.id} message={message} />
  ));

  return (
    <table className="mt-4">
      <tbody>{messagesList}</tbody>
    </table>
  );
};

export const MessagesPage: React.FC = () => {
  return (
    <Page>
      <Surface>
        <h2>Incoming messages</h2>
        <SubscribtionMessages />
      </Surface>
    </Page>
  );
};
