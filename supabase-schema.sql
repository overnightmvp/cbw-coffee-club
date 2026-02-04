-- The Bean Route — Supabase Schema
-- Run this in Supabase SQL Editor on a fresh project.

-- Vendors table
CREATE TABLE vendors (
  id TEXT PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  business_name TEXT NOT NULL,
  specialty TEXT NOT NULL,
  suburbs TEXT[] NOT NULL DEFAULT '{}',
  price_min INTEGER,
  price_max INTEGER,
  capacity_min INTEGER,
  capacity_max INTEGER,
  description TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  website TEXT,
  image_url TEXT,
  tags TEXT[] NOT NULL DEFAULT '{}',
  verified BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Inquiries table
CREATE TABLE inquiries (
  id TEXT PRIMARY KEY,
  vendor_id TEXT NOT NULL REFERENCES vendors(id),
  event_type TEXT,
  event_date TEXT,
  event_duration_hours INTEGER,
  guest_count INTEGER,
  location TEXT,
  contact_name TEXT NOT NULL,
  contact_email TEXT NOT NULL,
  contact_phone TEXT,
  special_requests TEXT,
  estimated_cost INTEGER,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'contacted', 'converted')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Row-Level Security
ALTER TABLE vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;

-- Anyone can read vendors
CREATE POLICY "vendors_public_read" ON vendors
  FOR SELECT USING (TRUE);

-- Anyone can submit an inquiry
CREATE POLICY "inquiries_public_insert" ON inquiries
  FOR INSERT WITH CHECK (TRUE);

-- Inquiries are read-only via anon (admin reads via service role)
CREATE POLICY "inquiries_no_anon_read" ON inquiries
  FOR SELECT USING (FALSE);

-- Vendor self-registration submissions
CREATE TABLE vendor_applications (
  id                TEXT        PRIMARY KEY,
  business_name     TEXT        NOT NULL,
  specialty         TEXT        NOT NULL,
  description       TEXT        NOT NULL,
  suburbs           TEXT[]      NOT NULL,
  price_min         INTEGER     NOT NULL,
  price_max         INTEGER     NOT NULL,
  capacity_min      INTEGER     NOT NULL,
  capacity_max      INTEGER     NOT NULL,
  event_types       TEXT[]      NOT NULL,
  contact_name      TEXT        NOT NULL,
  contact_email     TEXT        NOT NULL,
  contact_phone     TEXT,
  website           TEXT,
  status            TEXT        NOT NULL DEFAULT 'pending',
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Event owner job postings
CREATE TABLE jobs (
  id                   TEXT        PRIMARY KEY,
  event_title          TEXT        NOT NULL,
  event_type           TEXT        NOT NULL,
  event_date           TEXT        NOT NULL,
  duration_hours       INTEGER     NOT NULL,
  guest_count          INTEGER     NOT NULL,
  location             TEXT        NOT NULL,
  budget_min           INTEGER,
  budget_max           INTEGER     NOT NULL,
  special_requirements TEXT,
  contact_name         TEXT        NOT NULL,
  contact_email        TEXT        NOT NULL,
  contact_phone        TEXT,
  status               TEXT        NOT NULL DEFAULT 'open',
  created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Vendor quotes against a job
CREATE TABLE quotes (
  id              TEXT        PRIMARY KEY,
  job_id          TEXT        NOT NULL REFERENCES jobs(id),
  vendor_name     TEXT        NOT NULL,
  price_per_hour  INTEGER     NOT NULL,
  message         TEXT,
  contact_email   TEXT        NOT NULL,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- RLS — world-readable, world-writable (MVP)
ALTER TABLE vendor_applications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "vendor_applications_all" ON vendor_applications FOR ALL USING (TRUE) WITH CHECK (TRUE);

ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "jobs_all" ON jobs FOR ALL USING (TRUE) WITH CHECK (TRUE);

ALTER TABLE quotes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "quotes_all" ON quotes FOR ALL USING (TRUE) WITH CHECK (TRUE);

-- Admin users whitelist
CREATE TABLE admin_users (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  name TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- RLS: Admin table is private (no public access)
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- No public policies - only service role can access
-- (Admin API routes use supabaseAdmin client with service role key)

-- Seed primary admin
INSERT INTO admin_users (id, email, name) VALUES
  ('adm_' || extract(epoch from now())::bigint || '_' || substr(md5(random()::text), 1, 7), 'johnnytoshio@icloud.com', 'Johnny Toshio');
