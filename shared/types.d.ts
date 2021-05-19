// database models

export type ConnectionModel = {
  id: number;
  title: string;
  description: string | null;
  server: string;
  dateCreated: string;
  dateUpdated?: string;
};

export type SubscriptionModel = {
  id: number;
  connectionId: number;
  subject: string;
  dateCreated: string;
};

// database queries

export type InsertConnectionVars = Pick<
  ConnectionModel,
  "title" | "description" | "server"
>;

export type DeleteConnectionVars = Pick<ConnectionModel, "id">;

export type InsertSubscriptionVars = Pick<
  SubscriptionModel,
  "connectionId" | "subject"
>;

export type DeleteSubscriptionVars = Pick<SubscriptionModel, "id">;

// service typedefs

export type ErrorWithTimestamp = {
  message: string;
  timestamp: string;
};

export type ActiveConnection = {
  type: "active";
  model: ConnectionModel;
};

export type PausedConnection = {
  type: "paused";
  model: ConnectionModel;
  error?: ErrorWithTimestamp;
};

export type ActiveSubscription = {
  type: "active";
  model: SubscriptionModel;
};

export type PausedSubscription = {
  type: "paused";
  model: SubscriptionModel;
  error?: ErrorWithTimestamp;
};

// restapi inputs

export type IdInput = {
  id: number;
};

export type SendRequestInput = {
  connectionId: number;
  subject: string;
  payload?: string;
};

// restapi outputs

export type SendRequestOutput = {
  id: string;
  result: string;
  dateCreated: string;
};

// websocket

export type WsEventDef<Type, Payload> = { t: Type; p: Payload };

export type WsSubscriptionMsgEvent = WsEventDef<
  "SUBSCRIPTION_MSG",
  {
    messageId: string;
    subscriptionId: number;
    subjectFull: string;
    data: unknown;
    timestamp: string;
  }
>;

export type WsSubscriptionErrEvent = WsEventDef<
  "SUBSCRIPTION_ERR",
  {
    subscriptionId: number;
    error: string;
    timestamp: string;
  }
>;

export type WsEvent = WsSubscriptionMsgEvent | WsSubscriptionErrEvent;
