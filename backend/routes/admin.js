import express from 'express';
import supabase from '../supabaseClient.js';

const router = express.Router();

// Simple secret-based admin auth middleware
const requireAdmin = (req, res, next) => {
  const secret = req.headers['x-admin-secret'];
  if (secret !== process.env.ADMIN_SECRET) {
    return res.status(401).json({ success: false, error: 'Unauthorized' });
  }
  next();
};

// Admin login check
router.post('/login', (req, res) => {
  const { secret } = req.body;
  if (secret === process.env.ADMIN_SECRET) {
    res.json({ success: true, token: process.env.ADMIN_SECRET });
  } else {
    res.status(401).json({ success: false, error: 'Invalid credentials' });
  }
});

// --- PRODUCT CRUD ---

// GET all products (including inactive)
router.get('/products', requireAdmin, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// CREATE product
router.post('/products', requireAdmin, async (req, res) => {
  try {
    const { name, description, price, category, sizes, images, stock } = req.body;
    const { data, error } = await supabase
      .from('products')
      .insert({ name, description, price, category, sizes, images, stock, active: true })
      .select()
      .single();
    if (error) throw error;
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// UPDATE product
router.put('/products/:id', requireAdmin, async (req, res) => {
  try {
    const { name, description, price, category, sizes, images, stock, active } = req.body;
    const { data, error } = await supabase
      .from('products')
      .update({ name, description, price, category, sizes, images, stock, active, updated_at: new Date().toISOString() })
      .eq('id', req.params.id)
      .select()
      .single();
    if (error) throw error;
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// DELETE product
router.delete('/products/:id', requireAdmin, async (req, res) => {
  try {
    const { error } = await supabase.from('products').delete().eq('id', req.params.id);
    if (error) throw error;
    res.json({ success: true, message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// --- ORDERS ---

// GET all orders
router.get('/orders', requireAdmin, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// UPDATE order status
router.patch('/orders/:id/status', requireAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    const { data, error } = await supabase
      .from('orders')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', req.params.id)
      .select()
      .single();
    if (error) throw error;
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// --- CATEGORY CRUD ---

// CREATE category
router.post('/categories', requireAdmin, async (req, res) => {
  try {
    const { name, slug } = req.body;
    const { data, error } = await supabase
      .from('categories')
      .insert({ name, slug })
      .select()
      .single();
    if (error) throw error;
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// DELETE category
router.delete('/categories/:id', requireAdmin, async (req, res) => {
  try {
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', req.params.id);
    if (error) throw error;
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// --- STORE SETTINGS ---

// UPDATE settings (accepts an object of key: value pairs)
router.post('/settings', requireAdmin, async (req, res) => {
  try {
    const settings = req.body; // e.g. { hero_bg_url: 'http...', marquee_text: '...' }
    
    // Prepare upsert array
    const updates = Object.keys(settings).map(key => ({
      key,
      value: settings[key],
      updated_at: new Date().toISOString()
    }));

    if (updates.length > 0) {
      const { error } = await supabase
        .from('store_settings')
        .upsert(updates);
      if (error) throw error;
    }

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
