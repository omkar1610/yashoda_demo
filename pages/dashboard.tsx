import { GetServerSideProps } from 'next';
import { useState } from 'react';
import Link from 'next/link';
import Layout from '../components/Layout';
import { createServiceClient } from '../services/supabaseClient';
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';

// Extend Window to include the Razorpay SDK
declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => { open: () => void };
  }
}

interface Room {
  name: string;
}

interface Booking {
  id: string;
  check_in_date: string;
  check_out_date: string;
  total_price: number;
  status: string;
  payment_status: string;
  rooms?: Room;
}

interface Props {
  bookings: Booking[];
}

export default function DashboardPage({ bookings: initialBookings }: Props) {
  const [bookings, setBookings] = useState(initialBookings);
  const [cancelling, setCancelling] = useState<string | null>(null);

  const handleCancel = async (bookingId: string) => {
    if (!confirm('Are you sure you want to cancel this booking?')) return;
    setCancelling(bookingId);
    const res = await fetch('/api/bookings/cancel', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ bookingId }),
    });
    if (res.ok) {
      setBookings((prev) =>
        prev.map((b) => (b.id === bookingId ? { ...b, status: 'cancelled' } : b))
      );
    }
    setCancelling(null);
  };

  const handlePay = async (booking: Booking) => {
    const res = await fetch('/api/payments/create-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ bookingId: booking.id, amount: booking.total_price }),
    });
    const data = await res.json();
    if (!res.ok) return;
    const rzp = new window.Razorpay({
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount: data.order.amount,
      currency: data.order.currency,
      name: 'Hotel Yashoda',
      order_id: data.order.id,
      handler: async (response: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) => {
        await fetch('/api/payments/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            bookingId: booking.id,
            orderId: response.razorpay_order_id,
            paymentId: response.razorpay_payment_id,
            signature: response.razorpay_signature,
          }),
        });
        window.location.reload();
      },
      theme: { color: '#c8973a' },
    });
    rzp.open();
  };

  return (
    <Layout title="My Bookings – Hotel Yashoda">
      {/* Razorpay SDK */}
      {/* eslint-disable-next-line @next/next/no-sync-scripts */}
      <script src="https://checkout.razorpay.com/v1/checkout.js" />
      <div className="dashboard-page">
        <div className="dashboard-header">
          <h1>My Bookings</h1>
          <p style={{ color: '#666' }}>Manage all your hotel reservations</p>
        </div>
        {bookings.length === 0 ? (
          <div
            style={{
              textAlign: 'center',
              padding: '3rem 0',
              maxWidth: '1180px',
              margin: '0 auto',
            }}
          >
            <p style={{ color: '#666', fontSize: '1.1rem', marginBottom: '1.5rem' }}>
              You have no bookings yet.
            </p>
            <Link href="/rooms" className="btn btn--primary">
              Browse Rooms
            </Link>
          </div>
        ) : (
          <div className="bookings-grid">
            {bookings.map((booking) => (
              <div key={booking.id} className="booking-card">
                <div className="booking-card__header">
                  <div>
                    <div className="booking-card__room">{booking.rooms?.name}</div>
                    <div className="booking-card__dates">
                      {new Date(booking.check_in_date).toLocaleDateString('en-IN')} →{' '}
                      {new Date(booking.check_out_date).toLocaleDateString('en-IN')}
                    </div>
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.375rem',
                      alignItems: 'flex-end',
                    }}
                  >
                    <span className={`badge badge--${booking.status}`}>{booking.status}</span>
                    <span
                      className={`badge ${
                        booking.payment_status === 'paid' ? 'badge--paid' : 'badge--unpaid'
                      }`}
                    >
                      {booking.payment_status === 'paid' ? 'Paid' : 'Payment Pending'}
                    </span>
                  </div>
                </div>
                <div className="booking-card__price">
                  ₹{booking.total_price.toLocaleString('en-IN')}
                </div>
                <div className="booking-card__actions">
                  {booking.payment_status !== 'paid' && booking.status !== 'cancelled' && (
                    <button
                      className="btn btn--primary btn--sm"
                      onClick={() => handlePay(booking)}
                    >
                      Pay Now
                    </button>
                  )}
                  {booking.status !== 'confirmed' && booking.status !== 'cancelled' && (
                    <button
                      className="btn btn--outline btn--sm"
                      style={{ color: 'var(--color-text-muted)', borderColor: '#e0e0e0' }}
                      onClick={() => handleCancel(booking.id)}
                      disabled={cancelling === booking.id}
                    >
                      {cancelling === booking.id ? 'Cancelling…' : 'Cancel'}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const supabaseServer = createServerSupabaseClient(ctx);
  const {
    data: { session },
  } = await supabaseServer.auth.getSession();
  if (!session) {
    return {
      redirect: { destination: '/auth/login?redirect=/dashboard', permanent: false },
    };
  }
  const supabase = createServiceClient();
  const { data } = await supabase
    .from('bookings')
    .select('*, rooms(name)')
    .eq('user_id', session.user.id)
    .order('created_at', { ascending: false });
  return { props: { bookings: data ?? [] } };
};
