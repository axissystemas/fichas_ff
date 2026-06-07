import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://uygapxzgpcoryrmaxvuh.supabase.co';
const supabaseKey = 'sb_publishable_sizGEYLOa-2P04ADIDx6WQ_xxrVUZjd';

const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  console.log('Testing saving custom JSON key in attributes...');
  try {
    // Try to update a non-existent UUID. If the query parses and has no syntax error or schema mismatch, 
    // it will return success with empty data or a 200 status.
    const { error } = await supabase
      .from('adventure_sheets')
      .update({
        attributes: {
          skill: { initial: 10, current: 10 },
          energy: { initial: 14, current: 14 },
          luck: { initial: 8, current: 8 },
          currentSection: '42'
        }
      })
      .eq('id', '00000000-0000-0000-0000-000000000000');

    console.log('Result error:', error);
  } catch (err) {
    console.error('Unexpected error:', err);
  }
}

test();
