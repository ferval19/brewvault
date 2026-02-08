-- BrewVault Productivity System Migration
-- Run this in your Supabase SQL Editor

-- Add notification_preferences to profiles
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS notification_preferences JSONB DEFAULT '{"push_enabled": false, "low_stock_alerts": true, "maintenance_alerts": true, "reorder_suggestions": false}'::jsonb;

-- Add low_stock_threshold_grams to beans
ALTER TABLE beans
ADD COLUMN IF NOT EXISTS low_stock_threshold_grams INTEGER DEFAULT 100;

-- Add maintenance fields to equipment
ALTER TABLE equipment
ADD COLUMN IF NOT EXISTS maintenance_interval_days INTEGER;

ALTER TABLE equipment
ADD COLUMN IF NOT EXISTS maintenance_last_notified TIMESTAMPTZ;

-- Create alerts table
CREATE TABLE IF NOT EXISTS alerts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('low_stock', 'maintenance', 'reorder', 'custom')),
  entity_type TEXT CHECK (entity_type IN ('bean', 'equipment')),
  entity_id UUID,
  title TEXT NOT NULL,
  message TEXT,
  priority TEXT DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high')),
  is_read BOOLEAN DEFAULT false,
  is_dismissed BOOLEAN DEFAULT false,
  triggered_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_alerts_user_id ON alerts(user_id);
CREATE INDEX IF NOT EXISTS idx_alerts_unread ON alerts(user_id, is_read, is_dismissed);

-- RLS for alerts
ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own alerts" ON alerts;
CREATE POLICY "Users can view their own alerts"
  ON alerts FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own alerts" ON alerts;
CREATE POLICY "Users can update their own alerts"
  ON alerts FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create their own alerts" ON alerts;
CREATE POLICY "Users can create their own alerts"
  ON alerts FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create push_subscriptions table
CREATE TABLE IF NOT EXISTS push_subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  endpoint TEXT NOT NULL,
  p256dh TEXT NOT NULL,
  auth TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, endpoint)
);

-- RLS for push_subscriptions
ALTER TABLE push_subscriptions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage their own subscriptions" ON push_subscriptions;
CREATE POLICY "Users can manage their own subscriptions"
  ON push_subscriptions FOR ALL USING (auth.uid() = user_id);
