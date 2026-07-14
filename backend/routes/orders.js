import express from 'express';
import supabase from '../supabaseClient.js';

const router = express.Router();

// POST /checkout (Bypass Stripe)
router.post('/checkout', async (req, res) => {
  try {
    const { items } = req.body;
    const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const mockSessionId = 'mock_sess_' + Math.random().toString(36).substring(2, 15);
    
    const { data, error } = await supabase
      .from('orders')
      .insert({
        stripe_session_id: mockSessionId,
        customer_email: 'guest@streetritual.com',
        items: items,
        total: total,
        status: 'pending'
      })
      .select()
      .single();

    if (error) throw error;
    res.json({ success: true, url: `/order-success?session_id=${mockSessionId}` });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET session details (mock Stripe)
router.get('/session/:sessionId', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('stripe_session_id', req.params.sessionId)
      .single();

    if (error) throw error;
    // Map to Stripe session format so frontend doesn't break
    res.json({ 
      success: true, 
      data: {
        amount_total: data.total * 100, // back to paise
        customer_email: data.customer_email
      } 
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET all orders (admin only protected by middleware)
router.get('/', async (req, res) => {
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

// GET single order
router.get('/:id', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (error) throw error;
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// UPDATE order status
router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, error: 'Invalid status' });
    }

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

export default router;
