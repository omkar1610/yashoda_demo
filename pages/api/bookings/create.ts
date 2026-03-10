import type { NextApiRequest, NextApiResponse } from 'next';
import { createServiceClient } from '../../../services/supabaseClient';
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { checkRoomAvailability } from '../../../services/bookingService';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { roomId, checkInDate, checkOutDate, totalPrice, isGuest, guestName, guestEmail } =
    req.body;

  if (!roomId || !checkInDate || !checkOutDate || totalPrice === undefined) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  if (new Date(checkOutDate) <= new Date(checkInDate)) {
    return res.status(400).json({ error: 'Check-out must be after check-in' });
  }
  if (isGuest && (!guestName || !guestEmail)) {
    return res.status(400).json({ error: 'Guest name and email required' });
  }

  try {
    const available = await checkRoomAvailability(roomId, checkInDate, checkOutDate);
    if (!available) {
      return res.status(409).json({ error: 'Room is not available for selected dates' });
    }

    let userId: string | null = null;
    let effectiveGuestName = guestName;
    let effectiveGuestEmail = guestEmail;

    if (!isGuest) {
      const supabaseServer = createServerSupabaseClient({ req, res });
      const {
        data: { session },
      } = await supabaseServer.auth.getSession();
      if (session?.user) {
        userId = session.user.id;
        const supabaseService = createServiceClient();
        const { data: userRow } = await supabaseService
          .from('users')
          .select('name, email')
          .eq('id', userId)
          .single();
        effectiveGuestName = userRow?.name || session.user.email;
        effectiveGuestEmail = userRow?.email || session.user.email;
      }
    }

    const supabase = createServiceClient();
    const { data, error } = await supabase
      .from('bookings')
      .insert({
        room_id: roomId,
        user_id: userId,
        guest_name: effectiveGuestName,
        guest_email: effectiveGuestEmail,
        check_in_date: checkInDate,
        check_out_date: checkOutDate,
        total_price: totalPrice,
        status: 'pending',
        payment_status: 'pending',
        is_guest: isGuest && !userId,
      })
      .select()
      .single();

    if (error) throw error;
    return res.status(201).json({ booking: data });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal server error';
    return res.status(500).json({ error: message });
  }
}
