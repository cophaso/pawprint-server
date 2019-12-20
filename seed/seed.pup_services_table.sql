BEGIN;

TRUNCATE
  pup_services
  RESTART IDENTITY CASCADE;

INSERT INTO pup_services (
  date,
  pup_id,
  pup_name,
  service_type,
  note
) VALUES 
    (
      '10-02-2020',
      '1',
      'Cocoa',
      'Grooming',
      'He likes potatos'
    ),
    (
      '10-02-2020',
      '2',
      'Riggs',
      'Vet',
      'He likes carrots'
    );

COMMIT;