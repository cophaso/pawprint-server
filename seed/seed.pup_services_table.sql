BEGIN;

TRUNCATE
  pup_services
  RESTART IDENTITY CASCADE;

INSERT INTO pup_services (
  date,
  pup_id,
  service_type,
  note
) VALUES 
    (
      '10-02-2020',
      '1',
      'Grooming',
      'He likes potatos'
    ),
    (
      '10-02-2020',
      '2',
      'Vet',
      'He likes carrots'
    );

COMMIT;