import axios from 'axios';

const testSave = async () => {
  try {
    const res = await axios.post('http://localhost:5000/api/admin/settings', {
      hero_bg_url: 'https://ioqypwxopkdkqvnqljyt.supabase.co/storage/v1/object/public/images/1784036090417-plibll.png'
    }, {
      headers: {
        'x-admin-secret': 'streetritual_admin_2024'
      }
    });
    console.log("Save settings response:", res.data);
  } catch (err) {
    console.error("Error:", err.response?.data || err.message);
  }
}
testSave();
