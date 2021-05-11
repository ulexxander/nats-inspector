import type { DatabaseLayer } from "./databaseLayer";

export type ConnectionStructure = {
  title: string;
  description?: string;
  server: {
    host: string;
    port: number;
  };
  dateCreated: string;
  dateUpdated?: string;
};

export type DatabaseSchema = {
  connections: ConnectionStructure[];
};

export type Database = DatabaseLayer<DatabaseSchema>;
