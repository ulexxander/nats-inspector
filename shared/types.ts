export type WsSubMessageEvent = {
  type: "SUB_MESSAGE";
  payload: {
    id: string;
    subject: string;
    data: unknown;
  };
};

export type WsEvent = WsSubMessageEvent;

export type NatsSub = {
  subject: string;
  dateCreated: string;
};
