import express from 'express';
import supabase from '../supabaseClient.js';

const router = express.Router();

// GET all categories
router.get('/categories', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('created_at', { ascending: true });
    
    if (error) throw error;
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET all store settings
router.get('/settings', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('store_settings')
      .select('*');
    
    if (error) throw error;
    
    // Convert array of {key, value} to an object { key: value }
    const settingsObj = data.reduce((acc, curr) => {
      acc[curr.key] = curr.value;
      return acc;
    }, {});

    res.json({ success: true, data: settingsObj });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
