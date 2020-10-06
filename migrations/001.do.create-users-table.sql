CREATE TABLE users (
  user_id INTEGER PRIMARY KEY GENERATED Always AS IDENTITY,
  user_name TEXT,
  password TEXT NOT NULL,
  user_email TEXT NOT NULL,
  first_name TEXT,
  middle_init TEXT,
  last_name TEXT,
  date_modified TIMESTAMPTZ DEFAULT now() NOT NULL,
  date_created TIMESTAMPTZ DEFAULT now() NOT NULL
);
