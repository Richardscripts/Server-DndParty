CREATE TABLE partyusers (
  id INTEGER PRIMARY KEY GENERATED Always AS IDENTITY,
  user_id int references users (user_id),
  party_id int references parties (party_id)
);
