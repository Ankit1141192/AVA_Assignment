-- Run this in your Supabase SQL Editor

-- 1. Create the invoices table
CREATE TABLE invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_name TEXT,
  invoice_number TEXT,
  invoice_date TEXT,
  total_amount NUMERIC,
  currency TEXT DEFAULT 'USD',
  json_data JSONB,
  file_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  user_id UUID REFERENCES auth.users(id) -- Optional
);

-- 2. Create the storage bucket (do this in UI or via API)
-- Bucket Name: invoices
-- Access: Public (so we can get public URLs)
