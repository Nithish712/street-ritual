import supabase from './supabaseClient.js';
import fs from 'fs';

const run = async () => {
  console.log("Reading image...");
  const fileBuffer = fs.readFileSync('./hoodie.jpg');
  
  const fileName = `${Date.now()}-hoodie.jpg`;
  
  console.log("Uploading to Supabase...");
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from('images')
    .upload(fileName, fileBuffer, {
      contentType: 'image/jpeg',
      upsert: false
    });
    
  if (uploadError) {
    console.error("Upload Error:", uploadError);
    return;
  }
  
  const { data: publicUrlData } = supabase.storage
    .from('images')
    .getPublicUrl(fileName);
    
  const url = publicUrlData.publicUrl;
  console.log("URL:", url);
  
  console.log("Updating product...");
  const { data: products } = await supabase.from('products').select('*');
  const hoodie = products.find(p => p.name === 'BLACKOUT HOODIE');
  
  if (hoodie) {
    const { error } = await supabase.from('products').update({ images: [url] }).eq('id', hoodie.id);
    if (error) console.error("Update Error:", error);
    else console.log("SUCCESS! Product updated.");
  }
};
run();
