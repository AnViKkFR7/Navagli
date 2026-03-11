-- =============================================================
-- Navagli — DB_SCHEMA.sql
-- Main data model for Navagli reformas integrales application
-- =============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ---------------------------------------------------------------
-- Properties
-- ---------------------------------------------------------------
CREATE TABLE IF NOT EXISTS properties (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title          TEXT NOT NULL,
  slug           TEXT NOT NULL UNIQUE,
  description    TEXT,
  price          NUMERIC(12,2),
  price_currency CHAR(3) NOT NULL DEFAULT 'EUR',
  area_m2        NUMERIC(8,2),
  location       TEXT,
  city           TEXT,
  province       TEXT,
  country        TEXT NOT NULL DEFAULT 'ES',
  latitude       DOUBLE PRECISION,
  longitude      DOUBLE PRECISION,
  type           TEXT NOT NULL CHECK (type IN ('apartment','house','villa','commercial','office','land')),
  category       TEXT NOT NULL CHECK (category IN ('sale','rent','renovation')),
  status         TEXT NOT NULL DEFAULT 'available'
                   CHECK (status IN ('available','in_progress','completed','sold')),
  featured       BOOLEAN NOT NULL DEFAULT FALSE,
  main_image_url TEXT,
  images         TEXT[] NOT NULL DEFAULT '{}',
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Trigger to auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER properties_updated_at
  BEFORE UPDATE ON properties
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ---------------------------------------------------------------
-- Projects (renovation works)
-- ---------------------------------------------------------------
CREATE TABLE IF NOT EXISTS projects (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title          TEXT NOT NULL,
  slug           TEXT NOT NULL UNIQUE,
  description    TEXT,
  client_name    TEXT,
  location       TEXT,
  city           TEXT,
  start_date     DATE,
  end_date       DATE,
  area_m2        NUMERIC(8,2),
  budget         NUMERIC(12,2),
  budget_currency CHAR(3) NOT NULL DEFAULT 'EUR',
  status         TEXT NOT NULL DEFAULT 'completed'
                   CHECK (status IN ('planning','in_progress','completed')),
  category       TEXT,
  featured       BOOLEAN NOT NULL DEFAULT FALSE,
  main_image_url TEXT,
  images         TEXT[] NOT NULL DEFAULT '{}',
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ---------------------------------------------------------------
-- Services
-- ---------------------------------------------------------------
CREATE TABLE IF NOT EXISTS services (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title       TEXT NOT NULL,
  slug        TEXT NOT NULL UNIQUE,
  description TEXT,
  icon        TEXT,
  image_url   TEXT,
  order_index INTEGER NOT NULL DEFAULT 0,
  active      BOOLEAN NOT NULL DEFAULT TRUE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ---------------------------------------------------------------
-- Testimonials
-- ---------------------------------------------------------------
CREATE TABLE IF NOT EXISTS testimonials (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  author_name TEXT NOT NULL,
  author_role TEXT,
  content     TEXT NOT NULL,
  rating      SMALLINT NOT NULL DEFAULT 5 CHECK (rating BETWEEN 1 AND 5),
  avatar_url  TEXT,
  featured    BOOLEAN NOT NULL DEFAULT FALSE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ---------------------------------------------------------------
-- Contact Messages
-- ---------------------------------------------------------------
CREATE TABLE IF NOT EXISTS contact_messages (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name        TEXT NOT NULL,
  email       TEXT NOT NULL,
  phone       TEXT,
  subject     TEXT NOT NULL,
  message     TEXT NOT NULL,
  property_id UUID REFERENCES properties(id) ON DELETE SET NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ---------------------------------------------------------------
-- Row Level Security (RLS)
-- ---------------------------------------------------------------

-- Properties: public read
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
CREATE POLICY "properties_public_read" ON properties
  FOR SELECT USING (TRUE);

-- Projects: public read
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "projects_public_read" ON projects
  FOR SELECT USING (TRUE);

-- Services: public read
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
CREATE POLICY "services_public_read" ON services
  FOR SELECT USING (active = TRUE);

-- Testimonials: public read
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
CREATE POLICY "testimonials_public_read" ON testimonials
  FOR SELECT USING (TRUE);

-- Contact Messages: insert only for anonymous users
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "contact_messages_insert" ON contact_messages
  FOR INSERT WITH CHECK (TRUE);

-- ---------------------------------------------------------------
-- Indexes
-- ---------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_properties_slug ON properties(slug);
CREATE INDEX IF NOT EXISTS idx_properties_status ON properties(status);
CREATE INDEX IF NOT EXISTS idx_properties_type ON properties(type);
CREATE INDEX IF NOT EXISTS idx_properties_category ON properties(category);
CREATE INDEX IF NOT EXISTS idx_properties_featured ON properties(featured);
CREATE INDEX IF NOT EXISTS idx_projects_slug ON projects(slug);
CREATE INDEX IF NOT EXISTS idx_projects_featured ON projects(featured);
