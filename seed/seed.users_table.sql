BEGIN;

TRUNCATE
  users
  RESTART IDENTITY CASCADE;

INSERT INTO users (
    name,
    email,
    password
) VALUES
    (
        'Amber',
        'amber@work.com',
        'lovesdog2'
    );

COMMIT;