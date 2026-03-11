-- =============================================================
-- Navagli — RegiaMare.sql
-- Attribute values model (EAV pattern for property attributes)
-- =============================================================

-- ---------------------------------------------------------------
-- Attribute Definitions
-- ---------------------------------------------------------------
CREATE TABLE IF NOT EXISTS attribute_definitions (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name       TEXT NOT NULL,
  slug       TEXT NOT NULL UNIQUE,
  unit       TEXT,
  type       TEXT NOT NULL DEFAULT 'text'
               CHECK (type IN ('number','text','boolean','select')),
  options    TEXT[],            -- Available options for 'select' type
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ---------------------------------------------------------------
-- Attribute Values (linked to properties)
-- ---------------------------------------------------------------
CREATE TABLE IF NOT EXISTS attribute_values (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id    UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  attribute_id   UUID NOT NULL REFERENCES attribute_definitions(id) ON DELETE CASCADE,
  value_text     TEXT,
  value_number   NUMERIC,
  value_boolean  BOOLEAN,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (property_id, attribute_id)
);

-- ---------------------------------------------------------------
-- RLS for attribute tables
-- ---------------------------------------------------------------
ALTER TABLE attribute_definitions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "attribute_definitions_public_read" ON attribute_definitions
  FOR SELECT USING (TRUE);

ALTER TABLE attribute_values ENABLE ROW LEVEL SECURITY;
CREATE POLICY "attribute_values_public_read" ON attribute_values
  FOR SELECT USING (TRUE);

-- ---------------------------------------------------------------
-- Indexes
-- ---------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_attribute_values_property_id
  ON attribute_values(property_id);
CREATE INDEX IF NOT EXISTS idx_attribute_values_attribute_id
  ON attribute_values(attribute_id);

-- ---------------------------------------------------------------
-- Seed: Standard attribute definitions for residential properties
-- ---------------------------------------------------------------
INSERT INTO attribute_definitions (name, slug, unit, type) VALUES
  ('Habitaciones',         'bedrooms',          NULL,  'number'),
  ('Baños',                'bathrooms',          NULL,  'number'),
  ('Plantas',              'floors',             NULL,  'number'),
  ('Año de construcción',  'year_built',         NULL,  'number'),
  ('Garaje',               'garage',             NULL,  'boolean'),
  ('Ascensor',             'elevator',           NULL,  'boolean'),
  ('Terraza',              'terrace',            NULL,  'boolean'),
  ('Jardín',               'garden',             NULL,  'boolean'),
  ('Piscina',              'pool',               NULL,  'boolean'),
  ('Aire acondicionado',   'air_conditioning',   NULL,  'boolean'),
  ('Calefacción',          'heating',            NULL,  'boolean'),
  ('Orientación',          'orientation',        NULL,  'select'),
  ('Estado',               'condition',          NULL,  'select'),
  ('Certificado energético','energy_certificate',NULL,  'select')
ON CONFLICT (slug) DO NOTHING;

-- Update options for select-type attributes
UPDATE attribute_definitions
SET options = ARRAY['Norte','Sur','Este','Oeste','Noreste','Noroeste','Sureste','Suroeste']
WHERE slug = 'orientation';

UPDATE attribute_definitions
SET options = ARRAY['Nuevo','Buen estado','A reformar','En construcción']
WHERE slug = 'condition';

UPDATE attribute_definitions
SET options = ARRAY['A','B','C','D','E','F','G','En trámite']
WHERE slug = 'energy_certificate';
