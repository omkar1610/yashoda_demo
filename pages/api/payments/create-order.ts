import type { NextApiRequest, NextApiResponse } from 'next';
import Razorpay from 'razorpay';
import { createServiceClient } from '../../../services/supabaseClient';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const { bookingId, amount } = req.body;
  if (!bookingId || !amount) {
    return res.status(400).json({ error: 'Missing bookingId or amount' });
  }

  const supabase = createServiceClient();
  const { data: booking } = await supabase
    .from('bookings')
    .select('*')
    .eq('id', bookingId)
    .single();
  if (!booking) return res.status(404).json({ error: 'Booking not found' });
  if (booking.payment_status === 'paid') {
    return res.status(400).json({ error: 'Already paid' });
  }

  const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID!,
    key_secret: process.env.RAZORPAY_KEY_SECRET!,
  });

  try {
    const order = await razorpay.orders.create({
      amount: Math.round(amount * 100), // amount in paise
      currency: 'INR',
      receipt: bookingId,
      notes: { bookingId },
    });
    return res.status(200).json({ order });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Payment order creation failed';
    return res.status(500).json({ error: message });
  }
}
