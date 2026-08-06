import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';
import https from 'https';

const run = async () => {
  console.log("Downloading image...");
  const file = fs.createWriteStream("hoodie.jpg");
  https.get("https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=600&auto=format&fit=crop", response => {
    response.pipe(file);
    file.on("finish", async () => {
      file.close();
      console.log("Uploading to Supabase...");
      
      const form = new FormData();
      form.append('image', fs.createReadStream('./hoodie.jpg'));
      
      try {
        const res = await axios.post('http://localhost:5000/api/admin/upload', form, {
          headers: {
            'x-admin-secret': 'streetritual_admin_2024',
            ...form.getHeaders()
          }
        });
        const url = res.data.url;
        console.log("Uploaded URL:", url);
        
        console.log("Saving to product...");
        // Get products
        const prodRes = await axios.get('http://localhost:5000/api/admin/products', {
          headers: { 'x-admin-secret': 'streetritual_admin_2024' }
        });
        const hoodie = prodRes.data.data.find(p => p.name === 'BLACKOUT HOODIE');
        
        if (hoodie) {
          const payload = { ...hoodie, images: [url] };
          await axios.put(`http://localhost:5000/api/admin/products/${hoodie.id}`, payload, {
            headers: { 'x-admin-secret': 'streetritual_admin_2024' }
          });
          console.log("Product successfully updated! Check the storefront.");
        }
      } catch (err) {
        console.error(err.response?.data || err.message);
      }
    });
  });
}
run();
