import { Database, Statement } from "better-sqlite3";
import type {
  ConnectionModel,
  DeleteConnectionVars,
  DeleteSubscriptionVars,
  InsertConnectionVars,
  InsertSubscriptionVars,
  SubscriptionModel,
} from "../../../shared/types";

export type DatabaseQueries = ReturnType<typeof databaseQueries>;

function one<Vars, Row>(statement: Statement) {
  return (vars: Vars): Row => (vars ? statement.get(vars) : statement.get());
}

function many<Vars, Row>(statement: Statement) {
  return (vars: Vars): Row[] => (vars ? statement.all(vars) : statement.all());
}

export function databaseQueries(db: Database) {
  const selectAllConnections = db.prepare(`SELECT * FROM connections`);
  const insertConnection = db.prepare(
    `INSERT INTO connections
    (title, description, server)
    VALUES (:title, :description, :server)
    RETURNING *`,
  );
  const deleteConnection = db.prepare(
    `DELETE FROM connections
    WHERE id = :id
    RETURNING *`,
  );

  const selectAllSubscriptions = db.prepare(`SELECT * FROM subscriptions`);
  const insertSubscription = db.prepare(
    `INSERT INTO subscriptions (connectionId, subject)
    VALUES (:connectionId, :subject)
    RETURNING *`,
  );
  const deleteSubscription = db.prepare(
    `DELETE FROM subscriptions
    WHERE id = :id
    RETURNING *`,
  );

  return {
    selectAllConnections: many<void, ConnectionModel>(selectAllConnections),
    insertConnection:
      one<InsertConnectionVars, ConnectionModel>(insertConnection),
    deleteConnection:
      one<DeleteConnectionVars, ConnectionModel>(deleteConnection),
    selectAllSubscriptions: many<void, SubscriptionModel>(
      selectAllSubscriptions,
    ),
    insertSubscription:
      one<InsertSubscriptionVars, SubscriptionModel>(insertSubscription),
    deleteSubscription:
      one<DeleteSubscriptionVars, SubscriptionModel>(deleteSubscription),
  };
}
