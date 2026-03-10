import { supabase } from './supabaseClient';

export interface CreateBookingParams {
  roomId: string;
  checkInDate: string;
  checkOutDate: string;
  totalPrice: number;
  userId?: string;
  guestName?: string;
  guestEmail?: string;
  isGuest: boolean;
}

export async function checkRoomAvailability(
  roomId: string,
  checkIn: string,
  checkOut: string,
  excludeBookingId?: string
): Promise<boolean> {
  let query = supabase
    .from('bookings')
    .select('id')
    .eq('room_id', roomId)
    .neq('status', 'cancelled')
    .lt('check_in_date', checkOut)
    .gt('check_out_date', checkIn);

  if (excludeBookingId) {
    query = query.neq('id', excludeBookingId);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data.length === 0;
}

export async function getActiveRooms() {
  const { data, error } = await supabase
    .from('rooms')
    .select('*')
    .eq('is_active', true)
    .order('price_per_night', { ascending: true });
  if (error) throw error;
  return data;
}

export async function getRoomById(id: string) {
  const { data, error } = await supabase
    .from('rooms')
    .select('*')
    .eq('id', id)
    .single();
  if (error) throw error;
  return data;
}
