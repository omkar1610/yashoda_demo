import type { NextApiRequest, NextApiResponse } from 'next';
import { createServiceClient } from '../../../services/supabaseClient';
import { verifyRazorpaySignature } from '../../../services/paymentService';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const { bookingId, orderId, paymentId, signature } = req.body;
  if (!bookingId || !orderId || !paymentId || !signature) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const isValid = verifyRazorpaySignature(
    orderId,
    paymentId,
    signature,
    process.env.RAZORPAY_KEY_SECRET!
  );
  if (!isValid) return res.status(400).json({ error: 'Invalid payment signature' });

  const supabase = createServiceClient();
  const { error } = await supabase
    .from('bookings')
    .update({
      payment_status: 'paid',
      status: 'confirmed',
      razorpay_payment_id: paymentId,
    })
    .eq('id', bookingId);
  if (error) return res.status(500).json({ error: error.message });
  return res.status(200).json({ success: true });
}
