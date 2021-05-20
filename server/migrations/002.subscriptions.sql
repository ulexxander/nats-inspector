CREATE TABLE subscriptions (
  id integer PRIMARY KEY AUTOINCREMENT,
  connectionId integer NOT NULL,
  subject text NOT NULL,
  dateCreated text NOT NULL DEFAULT CURRENT_TIMESTAMP,
  dateUpdated text,

  FOREIGN KEY (connectionId)
    REFERENCES connections(id)
);
