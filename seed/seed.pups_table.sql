BEGIN;

TRUNCATE
  pups
  RESTART IDENTITY CASCADE;

INSERT INTO pups (
    pup_name,
    parent_id,
    breed,
    allergies,
    hobbies
) VALUES
    (
        'Cocoa',
        1,
        'Lab',
        '',
        'Plays Ball'
    ),
    (
        'Riggs',
        1,
        'Lab',
        '',
        ''
    );

COMMIT;