import { GetServerSideProps } from 'next';
import { useState } from 'react';
import Link from 'next/link';
import Layout from '../../components/Layout';
import { createServiceClient } from '../../services/supabaseClient';
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';

interface Room {
  name: string;
}

interface User {
  name: string;
  email: string;
}

interface Booking {
  id: string;
  guest_name: string;
  guest_email: string;
  check_in_date: string;
  check_out_date: string;
  total_price: number;
  status: string;
  payment_status: string;
  is_guest: boolean;
  rooms?: Room;
  users?: User;
  created_at: string;
}

interface Props {
  bookings: Booking[];
}

export default function AdminBookingsPage({ bookings: initialBookings }: Props) {
  const [bookings] = useState(initialBookings);
  const [statusFilter, setStatusFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  const filtered = bookings.filter((b) => {
    if (statusFilter && b.status !== statusFilter) return false;
    if (dateFilter && !b.check_in_date.startsWith(dateFilter)) return false;
    return true;
  });

  return (
    <Layout title="Admin – Bookings – Hotel Yashoda">
      <div className="admin-page">
        <div className="admin-container">
          <div className="admin-header">
            <h1>All Bookings</h1>
            <Link
              href="/admin/rooms"
              className="btn btn--outline btn--sm"
              style={{ color: 'var(--color-text-muted)', borderColor: '#e0e0e0' }}
            >
              Manage Rooms
            </Link>
          </div>
          <div className="admin-filters">
            <select
              className="filter-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <input
              type="month"
              className="filter-select"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              placeholder="Filter by month"
            />
          </div>
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Guest</th>
                  <th>Room</th>
                  <th>Check-in</th>
                  <th>Check-out</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Payment</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((booking) => (
                  <tr key={booking.id}>
                    <td>
                      <strong>
                        {booking.is_guest ? booking.guest_name : booking.users?.name}
                      </strong>
                      <br />
                      <span style={{ color: '#888', fontSize: '0.8rem' }}>
                        {booking.is_guest ? booking.guest_email : booking.users?.email}{' '}
                        {booking.is_guest && (
                          <span className="badge badge--pending" style={{ fontSize: '0.7rem' }}>
                            Guest
                          </span>
                        )}
                      </span>
                    </td>
                    <td>{booking.rooms?.name}</td>
                    <td>{new Date(booking.check_in_date).toLocaleDateString('en-IN')}</td>
                    <td>{new Date(booking.check_out_date).toLocaleDateString('en-IN')}</td>
                    <td>₹{booking.total_price.toLocaleString('en-IN')}</td>
                    <td>
                      <span className={`badge badge--${booking.status}`}>{booking.status}</span>
                    </td>
                    <td>
                      <span
                        className={`badge ${
                          booking.payment_status === 'paid'
                            ? 'badge--confirmed'
                            : 'badge--pending'
                        }`}
                      >
                        {booking.payment_status}
                      </span>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td
                      colSpan={7}
                      style={{ textAlign: 'center', padding: '2rem', color: '#888' }}
                    >
                      No bookings found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <p style={{ marginTop: '1rem', color: '#666', fontSize: '0.9rem' }}>
            Total: {filtered.length} bookings
          </p>
        </div>
      </div>
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
  const { data: bookings } = await supabase
    .from('bookings')
    .select('*, rooms(name), users(name, email)')
    .order('created_at', { ascending: false });
  return { props: { bookings: bookings ?? [] } };
};
