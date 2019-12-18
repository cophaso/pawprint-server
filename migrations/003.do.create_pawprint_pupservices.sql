CREATE TYPE service_category AS ENUM (
  'Grooming',
  'Vet',
  'Daycare'
);

CREATE TABLE IF NOT EXISTS pup_services (
  id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
  date DATE NOT NULL,
  pup_id INTEGER REFERENCES pups(id) ON DELETE SET NULL,
  service_type service_category,
  notes TEXT
);