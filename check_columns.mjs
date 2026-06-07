import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://uygapxzgpcoryrmaxvuh.supabase.co';
const supabaseKey = 'sb_publishable_sizGEYLOa-2P04ADIDx6WQ_xxrVUZjd';

const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
  console.log('Testing column current_section...');
  try {
    const { error } = await supabase
      .from('adventure_sheets')
      .update({ current_section: 123 })
      .eq('id', '00000000-0000-0000-0000-000000000000');

    console.log('Error returned:', error);
  } catch (err) {
    console.error('Unexpected error:', err);
  }
}

check();
