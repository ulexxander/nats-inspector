import { Database, Statement } from "better-sqlite3";
import type {
  ConnectionModel,
  DeleteConnectionVars,
  DeleteSubscriptionVars,
  InsertConnectionVars,
  InsertSubscriptionVars,
  SubscriptionModel,
} from "../../../shared/types";
import { errWrap } from "../utils/errors";

export type DatabaseQueries = ReturnType<typeof databaseQueries>;

function one<Vars, Row>(name: string, statement: Statement) {
  return (vars: Vars): Row => {
    try {
      return vars ? statement.get(vars) : statement.get();
    } catch (err) {
      throw errWrap(err, `Error during execution of ${name} query`);
    }
  };
}

function many<Vars, Row>(name: string, statement: Statement) {
  return (vars: Vars): Row[] => {
    try {
      return vars ? statement.all(vars) : statement.all();
    } catch (err) {
      throw errWrap(err, `Error during execution of ${name} query`);
    }
  };
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
    selectAllConnections: many<void, ConnectionModel>(
      "selectAllConnections",
      selectAllConnections,
    ),
    insertConnection: one<InsertConnectionVars, ConnectionModel>(
      "insertConnection",
      insertConnection,
    ),
    deleteConnection: one<DeleteConnectionVars, ConnectionModel>(
      "deleteConnection",
      deleteConnection,
    ),
    selectAllSubscriptions: many<void, SubscriptionModel>(
      "selectAllSubscriptions",
      selectAllSubscriptions,
    ),
    insertSubscription: one<InsertSubscriptionVars, SubscriptionModel>(
      "insertSubscription",
      insertSubscription,
    ),
    deleteSubscription: one<DeleteSubscriptionVars, SubscriptionModel>(
      "deleteSubscription",
      deleteSubscription,
    ),
  };
}
