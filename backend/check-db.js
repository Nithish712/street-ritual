import supabase from './supabaseClient.js';

async function checkSchema() {
  const { data, error } = await supabase.from('store_settings').select('*');
  console.log(data, error);
}
checkSchema();
