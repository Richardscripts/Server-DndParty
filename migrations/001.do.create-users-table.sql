CREATE TABLE users (
  user_id INTEGER PRIMARY KEY GENERATED Always AS IDENTITY,
  user_name TEXT  UNIQUE NOT NULL,
  password TEXT NOT NULL,
  user_email TEXT  UNIQUE NOT NULL,
  first_name TEXT,  
  last_name TEXT,
  dnd_experience TEXT,
  location TEXT,
  languages TEXT,
  contact TEXT,
  about_me TEXT,
  preferred_editions TEXT,
  preferred_classes TEXT,
  date_modified TIMESTAMPTZ DEFAULT now() NOT NULL,
  date_created TIMESTAMPTZ DEFAULT now() NOT NULL
);
