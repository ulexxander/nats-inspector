CREATE TABLE connections (
  id int PRIMARY KEY,
  title text NOT NULL,
  description text,
  host text NOT NULL,
  port int NOT NULL,
  dateCreated text NOT NULL DEFAULT CURRENT_TIMESTAMP,
  dateUpdated text
);
