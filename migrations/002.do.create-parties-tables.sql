CREATE TABLE parties (
  party_id INTEGER PRIMARY KEY GENERATED Always AS IDENTITY,
  party_name TEXT UNIQUE NOT NULL,
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
  date_created TIMESTAMPTZ DEFAULT now() NOT NULL,
  user_id_creator int references users (user_id) NOT NULL,
  party_complete TEXT DEFAULT 'Party Incomplete!'
);