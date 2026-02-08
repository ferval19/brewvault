-- BrewVault Database Schema
-- Initial migration: 7 tables with Row Level Security (RLS)

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================================================
-- PROFILES TABLE
-- =============================================================================
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  preferred_unit TEXT DEFAULT 'metric' CHECK (preferred_unit IN ('metric', 'imperial')),
  preferred_temperature_unit TEXT DEFAULT 'celsius' CHECK (preferred_temperature_unit IN ('celsius', 'fahrenheit')),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- RLS for profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Trigger to create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =============================================================================
-- ROASTERS TABLE
-- =============================================================================
CREATE TABLE roasters (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  country TEXT,
  city TEXT,
  website TEXT,
  notes TEXT,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_roasters_user_id ON roasters(user_id);

-- RLS for roasters
ALTER TABLE roasters ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own roasters"
  ON roasters FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own roasters"
  ON roasters FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own roasters"
  ON roasters FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own roasters"
  ON roasters FOR DELETE
  USING (auth.uid() = user_id);

-- =============================================================================
-- BEANS TABLE
-- =============================================================================
CREATE TABLE beans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  roaster_id UUID REFERENCES roasters(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  origin_country TEXT,
  origin_region TEXT,
  farm TEXT,
  altitude INTEGER,
  variety TEXT,
  process TEXT,
  roast_level TEXT CHECK (roast_level IN ('light', 'medium-light', 'medium', 'medium-dark', 'dark')),
  roast_date DATE,
  flavor_notes TEXT[],
  sca_score DECIMAL(4,1) CHECK (sca_score >= 0 AND sca_score <= 100),
  weight_grams DECIMAL(10,2),
  current_weight_grams DECIMAL(10,2),
  price DECIMAL(10,2),
  currency TEXT DEFAULT 'EUR',
  photo_url TEXT,
  barcode TEXT,
  certifications TEXT[],
  personal_rating INTEGER CHECK (personal_rating >= 1 AND personal_rating <= 5),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'finished', 'archived')),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_beans_user_id ON beans(user_id);
CREATE INDEX idx_beans_roaster_id ON beans(roaster_id);
CREATE INDEX idx_beans_status ON beans(status);
CREATE INDEX idx_beans_roast_date ON beans(roast_date);

-- RLS for beans
ALTER TABLE beans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own beans"
  ON beans FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own beans"
  ON beans FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own beans"
  ON beans FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own beans"
  ON beans FOR DELETE
  USING (auth.uid() = user_id);

-- =============================================================================
-- EQUIPMENT TABLE
-- =============================================================================
CREATE TABLE equipment (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('grinder', 'brewer', 'espresso_machine', 'kettle', 'scale', 'other')),
  brand TEXT,
  model TEXT NOT NULL,
  notes TEXT,
  purchase_date DATE,
  last_maintenance DATE,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_equipment_user_id ON equipment(user_id);
CREATE INDEX idx_equipment_type ON equipment(type);

-- RLS for equipment
ALTER TABLE equipment ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own equipment"
  ON equipment FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own equipment"
  ON equipment FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own equipment"
  ON equipment FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own equipment"
  ON equipment FOR DELETE
  USING (auth.uid() = user_id);

-- =============================================================================
-- WATER RECIPES TABLE
-- =============================================================================
CREATE TABLE water_recipes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  gh DECIMAL(6,2),
  kh DECIMAL(6,2),
  calcium DECIMAL(6,2),
  magnesium DECIMAL(6,2),
  tds DECIMAL(8,2),
  ph DECIMAL(4,2) CHECK (ph >= 0 AND ph <= 14),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_water_recipes_user_id ON water_recipes(user_id);

-- RLS for water_recipes
ALTER TABLE water_recipes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own water recipes"
  ON water_recipes FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own water recipes"
  ON water_recipes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own water recipes"
  ON water_recipes FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own water recipes"
  ON water_recipes FOR DELETE
  USING (auth.uid() = user_id);

-- =============================================================================
-- BREWS TABLE
-- =============================================================================
CREATE TABLE brews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  bean_id UUID NOT NULL REFERENCES beans(id) ON DELETE CASCADE,
  equipment_id UUID REFERENCES equipment(id) ON DELETE SET NULL,
  water_recipe_id UUID REFERENCES water_recipes(id) ON DELETE SET NULL,
  brew_method TEXT NOT NULL,
  grinder_id UUID REFERENCES equipment(id) ON DELETE SET NULL,
  grind_size TEXT,
  dose_grams DECIMAL(6,2) NOT NULL,
  water_grams DECIMAL(8,2) NOT NULL,
  ratio DECIMAL(6,2) GENERATED ALWAYS AS (
    CASE WHEN dose_grams > 0 THEN water_grams / dose_grams ELSE NULL END
  ) STORED,
  water_temperature DECIMAL(5,1),
  total_time_seconds INTEGER,
  bloom_time_seconds INTEGER,
  bloom_water_grams DECIMAL(6,2),
  pours JSONB,
  pressure_bar DECIMAL(4,1),
  yield_grams DECIMAL(8,2),
  tds DECIMAL(4,2),
  extraction_percentage DECIMAL(5,2),
  filter_type TEXT,
  notes TEXT,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  brewed_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_brews_user_id ON brews(user_id);
CREATE INDEX idx_brews_bean_id ON brews(bean_id);
CREATE INDEX idx_brews_brewed_at ON brews(brewed_at);
CREATE INDEX idx_brews_brew_method ON brews(brew_method);

-- RLS for brews
ALTER TABLE brews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own brews"
  ON brews FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own brews"
  ON brews FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own brews"
  ON brews FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own brews"
  ON brews FOR DELETE
  USING (auth.uid() = user_id);

-- Function to update bean weight after brew
CREATE OR REPLACE FUNCTION update_bean_weight_after_brew()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE beans
  SET
    current_weight_grams = GREATEST(0, COALESCE(current_weight_grams, weight_grams) - NEW.dose_grams),
    status = CASE
      WHEN GREATEST(0, COALESCE(current_weight_grams, weight_grams) - NEW.dose_grams) <= 0
      THEN 'finished'
      ELSE status
    END,
    updated_at = NOW()
  WHERE id = NEW.bean_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_brew_created
  AFTER INSERT ON brews
  FOR EACH ROW EXECUTE FUNCTION update_bean_weight_after_brew();

-- =============================================================================
-- CUPPING NOTES TABLE (SCA Protocol)
-- =============================================================================
CREATE TABLE cupping_notes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  brew_id UUID UNIQUE NOT NULL REFERENCES brews(id) ON DELETE CASCADE,
  fragrance DECIMAL(4,2) CHECK (fragrance >= 0 AND fragrance <= 10),
  flavor DECIMAL(4,2) CHECK (flavor >= 0 AND flavor <= 10),
  aftertaste DECIMAL(4,2) CHECK (aftertaste >= 0 AND aftertaste <= 10),
  acidity DECIMAL(4,2) CHECK (acidity >= 0 AND acidity <= 10),
  body DECIMAL(4,2) CHECK (body >= 0 AND body <= 10),
  balance DECIMAL(4,2) CHECK (balance >= 0 AND balance <= 10),
  sweetness DECIMAL(4,2) CHECK (sweetness >= 0 AND sweetness <= 10),
  uniformity DECIMAL(4,2) CHECK (uniformity >= 0 AND uniformity <= 10),
  clean_cup DECIMAL(4,2) CHECK (clean_cup >= 0 AND clean_cup <= 10),
  overall DECIMAL(4,2) CHECK (overall >= 0 AND overall <= 10),
  total_score DECIMAL(5,2) GENERATED ALWAYS AS (
    COALESCE(fragrance, 0) + COALESCE(flavor, 0) + COALESCE(aftertaste, 0) +
    COALESCE(acidity, 0) + COALESCE(body, 0) + COALESCE(balance, 0) +
    COALESCE(sweetness, 0) + COALESCE(uniformity, 0) + COALESCE(clean_cup, 0) +
    COALESCE(overall, 0)
  ) STORED,
  flavor_descriptors TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_cupping_notes_brew_id ON cupping_notes(brew_id);

-- RLS for cupping_notes (access through brew ownership)
ALTER TABLE cupping_notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own cupping notes"
  ON cupping_notes FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM brews WHERE brews.id = cupping_notes.brew_id AND brews.user_id = auth.uid()
  ));

CREATE POLICY "Users can create their own cupping notes"
  ON cupping_notes FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM brews WHERE brews.id = cupping_notes.brew_id AND brews.user_id = auth.uid()
  ));

CREATE POLICY "Users can update their own cupping notes"
  ON cupping_notes FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM brews WHERE brews.id = cupping_notes.brew_id AND brews.user_id = auth.uid()
  ));

CREATE POLICY "Users can delete their own cupping notes"
  ON cupping_notes FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM brews WHERE brews.id = cupping_notes.brew_id AND brews.user_id = auth.uid()
  ));

-- =============================================================================
-- UPDATED_AT TRIGGER FUNCTION
-- =============================================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger to all tables
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_roasters_updated_at
  BEFORE UPDATE ON roasters
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_beans_updated_at
  BEFORE UPDATE ON beans
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_equipment_updated_at
  BEFORE UPDATE ON equipment
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_water_recipes_updated_at
  BEFORE UPDATE ON water_recipes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_brews_updated_at
  BEFORE UPDATE ON brews
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cupping_notes_updated_at
  BEFORE UPDATE ON cupping_notes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
