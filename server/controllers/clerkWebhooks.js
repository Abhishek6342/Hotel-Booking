import express from 'express';
import { Webhook } from 'svix';
import User from '../models/User.js';

const router = express.Router();

// Webhook endpoint to handle Clerk events
router.post('/', express.raw({ type: 'application/json' }), async (req, res) => {
  const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

  try {
    // Verify the webhook signature
    const payload = wh.verify(req.body, {
      'svix-id': req.headers['svix-id'],
      'svix-timestamp': req.headers['svix-timestamp'],
      'svix-signature': req.headers['svix-signature'],
    });

    const evt = JSON.parse(payload);
    const eventType = evt.type;

    if (eventType === 'user.created') {
      const { id, username, email_addresses, image_url } = evt.data;
      const user = new User({
        _id: id,
        username: username || email_addresses[0].email_address.split('@')[0], // Use email prefix if username not provided
        email: email_addresses[0].email_address,
        image: image_url,
        recentSearchedCities: [], // Initialize as empty array
      });
      await user.save();
      console.log('User created:', id);
    } else if (eventType === 'user.updated') {
      const { id, username, email_addresses, image_url } = evt.data;
      await User.findByIdAndUpdate(id, {
        username: username || email_addresses[0].email_address.split('@')[0],
        email: email_addresses[0].email_address,
        image: image_url,
      });
      console.log('User updated:', id);
    } else if (eventType === 'user.deleted') {
      const { id } = evt.data;
      await User.findByIdAndDelete(id);
      console.log('User deleted:', id);
    }

    res.status(200).json({ success: true });
  } catch (err) {
    console.error('Webhook verification failed:', err);
    res.status(400).json({ error: 'Webhook verification failed' });
  }
});

export default router;
