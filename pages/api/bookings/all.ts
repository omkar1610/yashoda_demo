import type { NextApiRequest, NextApiResponse } from 'next';
import { createServiceClient } from '../../../services/supabaseClient';
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const supabaseServer = createServerSupabaseClient({ req, res });
  const {
    data: { session },
  } = await supabaseServer.auth.getSession();
  if (!session) return res.status(401).json({ error: 'Unauthorized' });

  const supabase = createServiceClient();
  const { data: userRow } = await supabase
    .from('users')
    .select('role')
    .eq('id', session.user.id)
    .single();
  if (userRow?.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });

  const { data, error } = await supabase
    .from('bookings')
    .select('*, rooms(name), users(name, email)')
    .order('created_at', { ascending: false });
  if (error) return res.status(500).json({ error: error.message });
  return res.status(200).json({ bookings: data });
}
