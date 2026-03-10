import { GetServerSideProps } from 'next';
import { useState } from 'react';
import Link from 'next/link';
import Layout from '../../components/Layout';
import { createServiceClient } from '../../services/supabaseClient';

interface Room {
  name: string;
}

interface Booking {
  id: string;
  room_id: string;
  guest_name: string;
  guest_email: string;
  check_in_date: string;
  check_out_date: string;
  total_price: number;
  status: string;
  payment_status: string;
  rooms?: Room;
}

interface Props {
  booking: Booking | null;
}

declare global {
  interface Window {
    Razorpay: any; // third-party SDK
  }
}

export default function BookingConfirmPage({ booking }: Props) {
  const [paying, setPaying] = useState(false);
  const [paid, setPaid] = useState(false);
  const [error, setError] = useState('');

  if (!booking) {
    return (
      <Layout title="Booking Not Found">
        <div style={{ padding: '6rem 1rem', textAlign: 'center' }}>
          <h2>Booking not found</h2>
          <Link href="/rooms" className="btn btn--primary" style={{ marginTop: '1rem' }}>
            Browse Rooms
          </Link>
        </div>
      </Layout>
    );
  }

  const nights = Math.ceil(
    (new Date(booking.check_out_date).getTime() - new Date(booking.check_in_date).getTime()) /
      86400000
  );

  const handlePay = async () => {
    setError('');
    setPaying(true);
    try {
      const res = await fetch('/api/payments/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookingId: booking.id, amount: booking.total_price }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Payment initiation failed');
        setPaying(false);
        return;
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: data.order.amount,
        currency: data.order.currency,
        name: 'Hotel Yashoda',
        description: `Booking for ${booking.rooms?.name}`,
        order_id: data.order.id,
        handler: async (response: any) => {
          const verifyRes = await fetch('/api/payments/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              bookingId: booking.id,
              orderId: response.razorpay_order_id,
              paymentId: response.razorpay_payment_id,
              signature: response.razorpay_signature,
            }),
          });
          const verifyData = await verifyRes.json();
          if (verifyRes.ok) {
            setPaid(true);
          } else {
            setError(verifyData.error || 'Payment verification failed');
          }
          setPaying(false);
        },
        prefill: { name: booking.guest_name, email: booking.guest_email },
        theme: { color: '#c8973a' },
        modal: { ondismiss: () => setPaying(false) },
      };
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch {
      setError('Payment failed. Please try again.');
      setPaying(false);
    }
  };

  const isAlreadyPaid = paid || booking.payment_status === 'paid';

  return (
    <Layout title="Booking Confirmation – Hotel Yashoda">
      {/* eslint-disable-next-line @next/next/no-sync-scripts */}
      <script src="https://checkout.razorpay.com/v1/checkout.js" />
      <div className="booking-page">
        <div className="booking-container">
          {isAlreadyPaid ? (
            <div className="booking-card-detail" style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>✅</div>
              <h2 style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-secondary)' }}>
                Booking Confirmed!
              </h2>
              <p style={{ color: '#666', margin: '1rem 0' }}>
                Your booking has been confirmed. Thank you for choosing Hotel Yashoda!
              </p>
              <Link href="/dashboard" className="btn btn--primary">
                View My Bookings
              </Link>
            </div>
          ) : (
            <>
              <div className="booking-card-detail">
                <h2
                  style={{
                    fontFamily: 'var(--font-heading)',
                    color: 'var(--color-secondary)',
                    marginBottom: '1.25rem',
                  }}
                >
                  Booking Details
                </h2>
                {[
                  ['Booking ID', `${booking.id.slice(0, 8)}…`],
                  ['Room', booking.rooms?.name ?? '—'],
                  ['Guest', booking.guest_name],
                  [
                    'Check-in',
                    new Date(booking.check_in_date).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    }),
                  ],
                  [
                    'Check-out',
                    new Date(booking.check_out_date).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    }),
                  ],
                  ['Nights', String(nights)],
                ].map(([label, value]) => (
                  <div
                    key={label}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      padding: '0.5rem 0',
                      borderBottom: '1px solid #f0f0f0',
                    }}
                  >
                    <span style={{ color: '#666' }}>{label}</span>
                    <span
                      style={
                        label === 'Booking ID'
                          ? { fontFamily: 'monospace', fontSize: '0.85rem' }
                          : undefined
                      }
                    >
                      {value}
                    </span>
                  </div>
                ))}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '0.75rem 0',
                    fontWeight: 700,
                    fontSize: '1.1rem',
                  }}
                >
                  <span>Total Amount</span>
                  <span style={{ color: 'var(--color-primary)' }}>
                    ₹{booking.total_price.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              <div className="booking-card-detail" style={{ textAlign: 'center' }}>
                <h3
                  style={{
                    fontFamily: 'var(--font-heading)',
                    color: 'var(--color-secondary)',
                    marginBottom: '0.5rem',
                  }}
                >
                  Complete Your Booking
                </h3>
                <p style={{ color: '#666', marginBottom: '1.5rem' }}>
                  Your booking is saved. Pay now to confirm your reservation.
                </p>
                {error && (
                  <p className="form-error" style={{ marginBottom: '1rem' }}>
                    {error}
                  </p>
                )}
                <button
                  className="btn btn--primary"
                  style={{ width: '100%', marginBottom: '0.75rem' }}
                  onClick={handlePay}
                  disabled={paying}
                >
                  {paying
                    ? 'Processing…'
                    : `Pay ₹${booking.total_price.toLocaleString('en-IN')} Now`}
                </button>
                <Link href="/dashboard" style={{ color: '#666', fontSize: '0.9rem' }}>
                  Pay later from My Bookings
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from('bookings')
    .select('*, rooms(name)')
    .eq('id', params?.id as string)
    .single();
  if (error || !data) return { props: { booking: null } };
  return { props: { booking: data } };
};
