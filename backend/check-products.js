import supabase from './supabaseClient.js';

async function checkProducts() {
  const { data, error } = await supabase.from('products').select('*').limit(3);
  console.log(data, error);
}
checkProducts();
