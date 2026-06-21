import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);

export interface AttributeModifiers {
  skill?: number;
  energy?: number;
  luck?: number;
  magic?: number;
  faith?: number;
  fear?: number;
  damageReduction?: number;
}

export interface DbItem {
  id: string;
  name: string;
  quantity: number;
  equipped: boolean;
  modifiers?: AttributeModifiers;
}

// Database types
export interface DbSheet {
  id: string;
  user_id: string;
  title: string;
  attributes: {
    skill: { initial: number; current: number };
    energy: { initial: number; current: number };
    luck: { initial: number; current: number };
    currentSection?: string;
  };
  gold: number;
  provisions: number;
  inventory: DbItem[];
  monsters: Array<{
    id: string;
    name: string;
    skill: number;
    energyMax: number;
    energyCurrent: number;
    status: 'alive' | 'defeated';
  }>;
  notes: string;
  theme: 'papyrus' | 'night';
  combat_log: Array<{ type: string; value: string }>;
  created_at: string;
  updated_at: string;
}
