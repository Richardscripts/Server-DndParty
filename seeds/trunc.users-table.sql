BEGIN;

TRUNCATE
  partyusers,
  partyrequests,
  parties;

INSERT INTO users 
(user_email, user_name, password) 
VALUES 
('1@aol.com', 'Wizard', '$2a$10$hh/8v4wCrJ4JA3mJzRk0S.w2vyJew.F73ZYZwo9/DWJra1SzNk1B2'),
('2@aol.com', 'Barbarian', '$2a$10$hh/8v4wCrJ4JA3mJzRk0S.w2vyJew.F73ZYZwo9/DWJra1SzNk1B2'),
('3@aol.com', 'Elf', '$2a$10$hh/8v4wCrJ4JA3mJzRk0S.w2vyJew.F73ZYZwo9/DWJra1SzNk1B2'),
('4@aol.com', 'Bard', '$2a$10$hh/8v4wCrJ4JA3mJzRk0S.w2vyJew.F73ZYZwo9/DWJra1SzNk1B2');

INSERT INTO parties (party_name, user_id_creator, players_needed, dm_needed)
VALUES('Table - One', '1', '1', 'true');

INSERT INTO partyrequests (user_id, party_id)
VALUES
 ('2', '1'),
 ('3', '1'),
 ('4', '1');

COMMIT;
