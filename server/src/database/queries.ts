import { Database } from "better-sqlite3";
import { ConnectionModel } from "./models";

export type InsertConnectionInput = Pick<
  ConnectionModel,
  "title" | "description" | "host" | "port"
>;

export type DatabaseQueries = ReturnType<typeof databaseQueries>;

export function databaseQueries(db: Database) {
  const selectAllConnections = db.prepare(`SELECT * FROM connections`);

  const insertConnection = db.prepare(
    `INSERT INTO connections
    (title, description, host, port)
    VALUES (:title, :description, :host, :port)
    RETURNING *`,
  );

  return {
    selectAllConnections: () => selectAllConnections.all() as ConnectionModel[],
    insertConnection: (i: InsertConnectionInput) =>
      insertConnection.get(i) as ConnectionModel,
  };
}
