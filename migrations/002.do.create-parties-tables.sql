CREATE TABLE parties (
  party_id INTEGER PRIMARY KEY GENERATED Always AS IDENTITY,
  party_name TEXT NOT NULL,
  language TEXT,
  time_of_event TEXT,
  dnd_edition TEXT,
  players_needed TEXT,
  dm_needed boolean,
  homebrew_rules TEXT,
  classes_needed TEXT,
  group_personality TEXT,
  online_or_not TEXT,
  camera_required boolean,
  about TEXT,
  campaign_or_custom TEXT,
  auto_accepts TEXT,
  banned_books TEXT,
  date_created TIMESTAMPTZ DEFAULT now() NOT NULL
);