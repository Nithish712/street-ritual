import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';

const testUpload = async () => {
  const form = new FormData();
  form.append('image', fs.createReadStream('./test.png'));
  try {
    const res = await axios.post('http://localhost:5000/api/admin/upload', form, {
      headers: {
        'x-admin-secret': 'streetritual_admin_2024',
        ...form.getHeaders()
      }
    });
    console.log(res.data);
  } catch (err) {
    console.error(err.response?.data || err.message);
  }
}
testUpload();
