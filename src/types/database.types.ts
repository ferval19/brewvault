export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          preferred_unit: "metric" | "imperial"
          preferred_temperature_unit: "celsius" | "fahrenheit"
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          preferred_unit?: "metric" | "imperial"
          preferred_temperature_unit?: "celsius" | "fahrenheit"
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          preferred_unit?: "metric" | "imperial"
          preferred_temperature_unit?: "celsius" | "fahrenheit"
          created_at?: string
          updated_at?: string
        }
      }
      roasters: {
        Row: {
          id: string
          user_id: string
          name: string
          country: string | null
          city: string | null
          website: string | null
          notes: string | null
          rating: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          country?: string | null
          city?: string | null
          website?: string | null
          notes?: string | null
          rating?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          country?: string | null
          city?: string | null
          website?: string | null
          notes?: string | null
          rating?: number | null
          created_at?: string
          updated_at?: string
        }
      }
      beans: {
        Row: {
          id: string
          user_id: string
          roaster_id: string | null
          name: string
          origin_country: string | null
          origin_region: string | null
          farm: string | null
          altitude: number | null
          variety: string | null
          process: string | null
          roast_level: "light" | "medium-light" | "medium" | "medium-dark" | "dark" | null
          roast_date: string | null
          flavor_notes: string[] | null
          sca_score: number | null
          weight_grams: number | null
          current_weight_grams: number | null
          price: number | null
          currency: string | null
          photo_url: string | null
          barcode: string | null
          certifications: string[] | null
          personal_rating: number | null
          status: "active" | "finished" | "archived"
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          roaster_id?: string | null
          name: string
          origin_country?: string | null
          origin_region?: string | null
          farm?: string | null
          altitude?: number | null
          variety?: string | null
          process?: string | null
          roast_level?: "light" | "medium-light" | "medium" | "medium-dark" | "dark" | null
          roast_date?: string | null
          flavor_notes?: string[] | null
          sca_score?: number | null
          weight_grams?: number | null
          current_weight_grams?: number | null
          price?: number | null
          currency?: string | null
          photo_url?: string | null
          barcode?: string | null
          certifications?: string[] | null
          personal_rating?: number | null
          status?: "active" | "finished" | "archived"
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          roaster_id?: string | null
          name?: string
          origin_country?: string | null
          origin_region?: string | null
          farm?: string | null
          altitude?: number | null
          variety?: string | null
          process?: string | null
          roast_level?: "light" | "medium-light" | "medium" | "medium-dark" | "dark" | null
          roast_date?: string | null
          flavor_notes?: string[] | null
          sca_score?: number | null
          weight_grams?: number | null
          current_weight_grams?: number | null
          price?: number | null
          currency?: string | null
          photo_url?: string | null
          barcode?: string | null
          certifications?: string[] | null
          personal_rating?: number | null
          status?: "active" | "finished" | "archived"
          created_at?: string
          updated_at?: string
        }
      }
      equipment: {
        Row: {
          id: string
          user_id: string
          type: "grinder" | "brewer" | "espresso_machine" | "kettle" | "scale" | "other"
          brand: string | null
          model: string
          notes: string | null
          purchase_date: string | null
          last_maintenance: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          type: "grinder" | "brewer" | "espresso_machine" | "kettle" | "scale" | "other"
          brand?: string | null
          model: string
          notes?: string | null
          purchase_date?: string | null
          last_maintenance?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          type?: "grinder" | "brewer" | "espresso_machine" | "kettle" | "scale" | "other"
          brand?: string | null
          model?: string
          notes?: string | null
          purchase_date?: string | null
          last_maintenance?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      water_recipes: {
        Row: {
          id: string
          user_id: string
          name: string
          gh: number | null
          kh: number | null
          calcium: number | null
          magnesium: number | null
          tds: number | null
          ph: number | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          gh?: number | null
          kh?: number | null
          calcium?: number | null
          magnesium?: number | null
          tds?: number | null
          ph?: number | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          gh?: number | null
          kh?: number | null
          calcium?: number | null
          magnesium?: number | null
          tds?: number | null
          ph?: number | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      brews: {
        Row: {
          id: string
          user_id: string
          bean_id: string
          equipment_id: string | null
          water_recipe_id: string | null
          brew_method: string
          grinder_id: string | null
          grind_size: string | null
          dose_grams: number
          water_grams: number
          ratio: number | null
          water_temperature: number | null
          total_time_seconds: number | null
          bloom_time_seconds: number | null
          bloom_water_grams: number | null
          pours: Json | null
          pressure_bar: number | null
          yield_grams: number | null
          tds: number | null
          extraction_percentage: number | null
          filter_type: string | null
          notes: string | null
          rating: number | null
          brewed_at: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          bean_id: string
          equipment_id?: string | null
          water_recipe_id?: string | null
          brew_method: string
          grinder_id?: string | null
          grind_size?: string | null
          dose_grams: number
          water_grams: number
          ratio?: number | null
          water_temperature?: number | null
          total_time_seconds?: number | null
          bloom_time_seconds?: number | null
          bloom_water_grams?: number | null
          pours?: Json | null
          pressure_bar?: number | null
          yield_grams?: number | null
          tds?: number | null
          extraction_percentage?: number | null
          filter_type?: string | null
          notes?: string | null
          rating?: number | null
          brewed_at?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          bean_id?: string
          equipment_id?: string | null
          water_recipe_id?: string | null
          brew_method?: string
          grinder_id?: string | null
          grind_size?: string | null
          dose_grams?: number
          water_grams?: number
          ratio?: number | null
          water_temperature?: number | null
          total_time_seconds?: number | null
          bloom_time_seconds?: number | null
          bloom_water_grams?: number | null
          pours?: Json | null
          pressure_bar?: number | null
          yield_grams?: number | null
          tds?: number | null
          extraction_percentage?: number | null
          filter_type?: string | null
          notes?: string | null
          rating?: number | null
          brewed_at?: string
          created_at?: string
          updated_at?: string
        }
      }
      cupping_notes: {
        Row: {
          id: string
          brew_id: string
          fragrance: number | null
          flavor: number | null
          aftertaste: number | null
          acidity: number | null
          body: number | null
          balance: number | null
          sweetness: number | null
          uniformity: number | null
          clean_cup: number | null
          overall: number | null
          total_score: number | null
          flavor_descriptors: string[] | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          brew_id: string
          fragrance?: number | null
          flavor?: number | null
          aftertaste?: number | null
          acidity?: number | null
          body?: number | null
          balance?: number | null
          sweetness?: number | null
          uniformity?: number | null
          clean_cup?: number | null
          overall?: number | null
          total_score?: number | null
          flavor_descriptors?: string[] | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          brew_id?: string
          fragrance?: number | null
          flavor?: number | null
          aftertaste?: number | null
          acidity?: number | null
          body?: number | null
          balance?: number | null
          sweetness?: number | null
          uniformity?: number | null
          clean_cup?: number | null
          overall?: number | null
          total_score?: number | null
          flavor_descriptors?: string[] | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
