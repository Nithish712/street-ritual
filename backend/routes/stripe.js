import express from 'express';
import Stripe from 'stripe';
import supabase from '../supabaseClient.js';

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Create checkout session
router.post('/create-checkout-session', async (req, res) => {
  try {
    const { items, customerEmail, shippingAddress } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, error: 'No items in cart' });
    }

    // Build Stripe line items
    const lineItems = items.map((item) => ({
      price_data: {
        currency: 'inr',
        product_data: {
          name: `${item.name} - ${item.size}`,
          images: item.images?.[0] ? [item.images[0]] : [],
          metadata: { product_id: item.id, size: item.size },
        },
        unit_amount: Math.round(item.price * 100), // paise
      },
      quantity: item.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      customer_email: customerEmail,
      shipping_address_collection: {
        allowed_countries: ['IN'],
      },
      success_url: `${process.env.CLIENT_URL}/order-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/cart`,
      metadata: {
        items: JSON.stringify(items),
        shipping_address: JSON.stringify(shippingAddress || {}),
      },
    });

    res.json({ success: true, url: session.url, sessionId: session.id });
  } catch (err) {
    console.error('Stripe error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Get session details (for order success page)
router.get('/session/:sessionId', async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.retrieve(req.params.sessionId);
    res.json({ success: true, data: session });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Stripe Webhook
router.post('/webhook', async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('Webhook signature error:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const items = JSON.parse(session.metadata.items || '[]');
    const total = session.amount_total / 100;

    try {
      await supabase.from('orders').insert({
        stripe_session_id: session.id,
        customer_email: session.customer_email,
        items,
        total,
        status: 'processing',
        shipping_address: session.shipping_details || {},
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
      console.log(`✅ Order saved for session ${session.id}`);
    } catch (dbErr) {
      console.error('DB error saving order:', dbErr);
    }
  }

  res.json({ received: true });
});

export default router;
