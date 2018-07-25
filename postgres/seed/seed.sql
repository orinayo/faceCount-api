BEGIN TRANSACTION;

INSERT into users (name, email, entries, joined) values ('Jessie', 'jessie@example.com', 5, '2018-01-01');
INSERT into login (hash, email) values ('$2a$10$dCvovYs65W9crfgslIv34.dr1CM7kuO3rF97EXbLps6qWtrGYnA9G', 'jessie@example.com');

COMMIT;