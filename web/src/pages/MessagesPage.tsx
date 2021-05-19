import { useStore } from "effector-react";
import React from "react";
import { WsSubscriptionMsgEvent } from "../../../shared/types";
import { Surface } from "../components/elements/containers";
import { Page } from "../components/elements/layout";
import { $subMessages } from "../domains/subMessages/subMessagesUnits";

const SubMessageRow: React.FC<{ message: WsSubscriptionMsgEvent["p"] }> = ({
  message,
}) => {
  return (
    <tr>
      <td className="text-green-400">{message.subjectFull}</td>
      <td className="w-12"></td>
      <td>{message.data}</td>
    </tr>
  );
};

const SubscriptionMessages: React.FC = () => {
  const messages = useStore($subMessages);

  if (!messages.length) {
    return <p className="caption">No messages yet</p>;
  }

  const messagesList = messages.map((message) => (
    <SubMessageRow key={message.messageId} message={message} />
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
        <h3>Incoming messages</h3>
        <SubscriptionMessages />
      </Surface>
    </Page>
  );
};
