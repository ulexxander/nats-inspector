// database models

export type ConnectionModel = {
  id: number;
  title: string;
  description: string | null;
  host: string;
  port: number;
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
  "title" | "description" | "host" | "port"
>;

export type DeleteConnectionVars = Pick<ConnectionModel, "id">;

export type InsertSubscriptionVars = Pick<
  SubscriptionModel,
  "connectionId" | "subject"
>;

export type DeleteSubscriptionVars = Pick<SubscriptionModel, "id">;

// service typedefs

export type PausedConnection = {
  model: ConnectionModel;
  error?: {
    message: string;
    timestamp: string;
  };
};

export type ActiveConnection = {
  model: ConnectionModel;
};

// restapi inputs

export type SendRequestInput = {
  connectionId: number;
  subject: string;
  payload?: string;
};

// restapi outputs

export type SendRequestOutput = {
  id: string;
  response: string;
  dateCreated: string;
};

export type ActiveConnectionsOutput = Pick<ActiveConnection, "model">[];
export type PausedConnectionsOutput = PausedConnection[];

// websocket

export type WsEventDef<Type, Payload> = { t: Type; p: Payload };

export type WsSubscriptionMsgEvent = WsEventDef<
  "SUBSCRIPTION_MSG",
  {
    id: string;
    subject: string;
    data: unknown;
  }
>;

export type WsSubscriptionErrEvent = WsEventDef<
  "SUBSCRIPTION_ERR",
  {
    id: string;
    subject: string;
    error: string;
  }
>;

export type WsEvent = WsSubscriptionMsgEvent | WsSubscriptionErrEvent;
