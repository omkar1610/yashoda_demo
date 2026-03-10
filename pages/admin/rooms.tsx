import { GetServerSideProps } from 'next';
import { useState } from 'react';
import Link from 'next/link';
import Layout from '../../components/Layout';
import { createServiceClient } from '../../services/supabaseClient';
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';

interface Room {
  id: string;
  name: string;
  description: string;
  price_per_night: number;
  capacity: number;
  is_active: boolean;
}

interface FormState {
  name: string;
  description: string;
  price_per_night: string;
  capacity: string;
  is_active: boolean;
}

interface Props {
  rooms: Room[];
}

export default function AdminRoomsPage({ rooms: initialRooms }: Props) {
  const [rooms, setRooms] = useState(initialRooms);
  const [showModal, setShowModal] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [form, setForm] = useState<FormState>({
    name: '',
    description: '',
    price_per_night: '',
    capacity: '2',
    is_active: true,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const openAdd = () => {
    setEditingRoom(null);
    setForm({ name: '', description: '', price_per_night: '', capacity: '2', is_active: true });
    setShowModal(true);
    setError('');
  };

  const openEdit = (room: Room) => {
    setEditingRoom(room);
    setForm({
      name: room.name,
      description: room.description,
      price_per_night: String(room.price_per_night),
      capacity: String(room.capacity),
      is_active: room.is_active,
    });
    setShowModal(true);
    setError('');
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    const payload = {
      name: form.name,
      description: form.description,
      price_per_night: parseFloat(form.price_per_night),
      capacity: parseInt(form.capacity),
      is_active: form.is_active,
    };
    const url = editingRoom ? `/api/admin/rooms?id=${editingRoom.id}` : '/api/admin/rooms';
    const method = editingRoom ? 'PUT' : 'POST';
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || 'Save failed');
      setSaving(false);
      return;
    }
    if (editingRoom) {
      setRooms((prev) => prev.map((r) => (r.id === editingRoom.id ? data.room : r)));
    } else {
      setRooms((prev) => [...prev, data.room]);
    }
    setSaving(false);
    setShowModal(false);
  };

  const handleToggle = async (room: Room) => {
    const res = await fetch(`/api/admin/rooms?id=${room.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ is_active: !room.is_active }),
    });
    if (res.ok) {
      const data = await res.json();
      setRooms((prev) => prev.map((r) => (r.id === room.id ? data.room : r)));
    }
  };

  return (
    <Layout title="Admin – Rooms – Hotel Yashoda">
      <div className="admin-page">
        <div className="admin-container">
          <div className="admin-header">
            <h1>Manage Rooms</h1>
            <button className="btn btn--primary" onClick={openAdd}>
              + Add Room
            </button>
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <Link href="/admin/bookings" className="btn btn--outline btn--sm"
               style={{ color: 'var(--color-text-muted)', borderColor: '#e0e0e0' }}>
              View Bookings →
            </Link>
          </div>
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Room Name</th>
                  <th>Price/Night</th>
                  <th>Capacity</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {rooms.map((room) => (
                  <tr key={room.id}>
                    <td>
                      <strong>{room.name}</strong>
                      <br />
                      <span style={{ color: '#888', fontSize: '0.85rem' }}>
                        {room.description?.slice(0, 60)}…
                      </span>
                    </td>
                    <td>₹{room.price_per_night.toLocaleString('en-IN')}</td>
                    <td>{room.capacity} guests</td>
                    <td>
                      <span
                        className={`badge ${
                          room.is_active ? 'badge--confirmed' : 'badge--cancelled'
                        }`}
                      >
                        {room.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button
                          className="btn btn--outline btn--sm"
                          style={{ color: 'var(--color-secondary)', borderColor: '#e0e0e0' }}
                          onClick={() => openEdit(room)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn--outline btn--sm"
                          style={{ color: 'var(--color-text-muted)', borderColor: '#e0e0e0' }}
                          onClick={() => handleToggle(room)}
                        >
                          {room.is_active ? 'Deactivate' : 'Activate'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {rooms.length === 0 && (
                  <tr>
                    <td colSpan={5} style={{ textAlign: 'center', padding: '2rem', color: '#888' }}>
                      No rooms found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showModal && (
        <div
          className="modal-overlay"
          onClick={(e) => e.target === e.currentTarget && setShowModal(false)}
        >
          <div className="modal">
            <h2>{editingRoom ? 'Edit Room' : 'Add New Room'}</h2>
            <form onSubmit={handleSave}>
              <div className="form-group">
                <label>Room Name</label>
                <input
                  className="form-control"
                  value={form.name}
                  onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                  required
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  className="form-control"
                  value={form.description}
                  onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                  rows={3}
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label>Price/Night (₹)</label>
                  <input
                    className="form-control"
                    type="number"
                    value={form.price_per_night}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, price_per_night: e.target.value }))
                    }
                    required
                    min="1"
                  />
                </div>
                <div className="form-group">
                  <label>Capacity</label>
                  <input
                    className="form-control"
                    type="number"
                    value={form.capacity}
                    onChange={(e) => setForm((p) => ({ ...p, capacity: e.target.value }))}
                    required
                    min="1"
                  />
                </div>
              </div>
              <div className="form-group">
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={form.is_active}
                    onChange={(e) => setForm((p) => ({ ...p, is_active: e.target.checked }))}
                  />
                  Active (visible to guests)
                </label>
              </div>
              {error && <p className="form-error">{error}</p>}
              <div className="modal-actions">
                <button
                  type="button"
                  className="btn btn--outline"
                  style={{ color: 'var(--color-text-muted)', borderColor: '#e0e0e0' }}
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn--primary" disabled={saving}>
                  {saving ? 'Saving…' : 'Save Room'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const supabaseServer = createServerSupabaseClient(ctx);
  const {
    data: { session },
  } = await supabaseServer.auth.getSession();
  if (!session) return { redirect: { destination: '/auth/login', permanent: false } };
  const supabase = createServiceClient();
  const { data: userRow } = await supabase
    .from('users')
    .select('role')
    .eq('id', session.user.id)
    .single();
  if (userRow?.role !== 'admin') return { redirect: { destination: '/', permanent: false } };
  const { data: rooms } = await supabase.from('rooms').select('*').order('created_at');
  return { props: { rooms: rooms ?? [] } };
};
