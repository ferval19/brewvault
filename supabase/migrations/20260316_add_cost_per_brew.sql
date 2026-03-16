-- Add cost_per_brew column to brews table
-- Stores the calculated cost per brew: bean.price / total_brew_count_for_bean
ALTER TABLE brews ADD COLUMN IF NOT EXISTS cost_per_brew numeric(10,4) NULL;
