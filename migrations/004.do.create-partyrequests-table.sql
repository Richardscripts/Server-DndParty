CREATE TABLE partyrequests (
  id INTEGER PRIMARY KEY GENERATED Always AS IDENTITY,
  user_id int references users (user_id) NOT NULL,
  party_id int references parties (party_id) NOT NULL
);
