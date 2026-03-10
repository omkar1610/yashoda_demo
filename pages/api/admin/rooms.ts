import type { NextApiRequest, NextApiResponse } from 'next';
import { createServiceClient } from '../../../services/supabaseClient';
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';

async function checkAdmin(req: NextApiRequest, res: NextApiResponse): Promise<boolean> {
  const supabaseServer = createServerSupabaseClient({ req, res });
  const {
    data: { session },
  } = await supabaseServer.auth.getSession();
  if (!session) return false;
  const supabase = createServiceClient();
  const { data: userRow } = await supabase
    .from('users')
    .select('role')
    .eq('id', session.user.id)
    .single();
  return userRow?.role === 'admin';
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const isAdmin = await checkAdmin(req, res);
  if (!isAdmin) return res.status(403).json({ error: 'Forbidden' });

  const supabase = createServiceClient();

  if (req.method === 'POST') {
    const { name, description, price_per_night, capacity, is_active } = req.body;
    const { data, error } = await supabase
      .from('rooms')
      .insert({ name, description, price_per_night, capacity, is_active: is_active ?? true })
      .select()
      .single();
    if (error) return res.status(500).json({ error: error.message });
    return res.status(201).json({ room: data });
  }

  if (req.method === 'PUT') {
    const { id } = req.query;
    if (!id) return res.status(400).json({ error: 'Room ID required' });
    const { data, error } = await supabase
      .from('rooms')
      .update({ ...req.body, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ room: data });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
