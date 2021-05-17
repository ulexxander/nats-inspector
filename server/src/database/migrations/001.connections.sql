CREATE TABLE connections (
  id integer PRIMARY KEY AUTOINCREMENT,
  title text NOT NULL,
  description text,
  host text NOT NULL,
  port integer NOT NULL,
  dateCreated text NOT NULL DEFAULT CURRENT_TIMESTAMP,
  dateUpdated text
);
