-- SQL Schema for BrandSparkX Environment Manager
-- Copy and run these commands in the Supabase SQL Editor

-- 1. Create the whitelabel_product_demo_environment table
CREATE TABLE IF NOT EXISTS whitelabel_product_demo_environment (
    id TEXT PRIMARY KEY,
    client_name TEXT NOT NULL,
    product_type TEXT NOT NULL CHECK (product_type IN ('crm', 'hrms', 'erp')),
    product_label TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('Active', 'Provisioning', 'Expired')),
    expires_at TEXT NOT NULL,
    last_activity TEXT NOT NULL,
    admin_email TEXT NOT NULL,
    data_preset TEXT NOT NULL CHECK (data_preset IN ('empty', 'retail', 'fintech', 'healthcare')),
    session_recording BOOLEAN NOT NULL DEFAULT FALSE,
    analytics_tracking BOOLEAN NOT NULL DEFAULT TRUE,
    health_score NUMERIC NOT NULL DEFAULT 100,
    load_state TEXT NOT NULL CHECK (load_state IN ('Operational', 'High Load', 'In Progress', 'Awaiting')),
    avatar_initials TEXT NOT NULL,
    avatar_bg TEXT NOT NULL,
    avatar_text TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create the customers table
CREATE TABLE IF NOT EXISTS customers (
    id TEXT PRIMARY KEY,
    client_name TEXT NOT NULL,
    admin_email TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'Active',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create the audit_logs table
CREATE TABLE IF NOT EXISTS audit_logs (
    id TEXT PRIMARY KEY,
    timestamp TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('info', 'warn', 'error', 'success')),
    client TEXT NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Create the users table
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    name TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS (Row Level Security) - OPTIONAL but recommended for production.
-- For simple integration in this prototype, you can keep them open or configure appropriate policies.
ALTER TABLE whitelabel_product_demo_environment ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create public access policies for ease of testing in this internship prototype:
CREATE POLICY "Allow public select" ON users FOR SELECT USING (true);
CREATE POLICY "Allow public insert" ON users FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update" ON users FOR UPDATE USING (true);
CREATE POLICY "Allow public delete" ON users FOR DELETE USING (true);

-- Create public access policies for ease of testing in this internship prototype:
CREATE POLICY "Allow public select" ON whitelabel_product_demo_environment FOR SELECT USING (true);
CREATE POLICY "Allow public insert" ON whitelabel_product_demo_environment FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update" ON whitelabel_product_demo_environment FOR UPDATE USING (true);
CREATE POLICY "Allow public delete" ON whitelabel_product_demo_environment FOR DELETE USING (true);

CREATE POLICY "Allow public select" ON customers FOR SELECT USING (true);
CREATE POLICY "Allow public insert" ON customers FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update" ON customers FOR UPDATE USING (true);
CREATE POLICY "Allow public delete" ON customers FOR DELETE USING (true);

CREATE POLICY "Allow public select" ON audit_logs FOR SELECT USING (true);
CREATE POLICY "Allow public insert" ON audit_logs FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public delete" ON audit_logs FOR DELETE USING (true);
