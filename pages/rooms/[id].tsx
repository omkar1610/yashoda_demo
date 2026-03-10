import type { User } from '@supabase/supabase-js';
import { GetServerSideProps } from 'next';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Layout from '../../components/Layout';
import { getRoomById } from '../../services/bookingService';
import { supabase } from '../../services/supabaseClient';

interface Room {
  id: string;
  name: string;
  description: string;
  price_per_night: number;
  capacity: number;
}

interface Props {
  room: Room | null;
}

export default function RoomDetailPage({ room }: Props) {
  const router = useRouter();
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [isGuest, setIsGuest] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setIsGuest(!session?.user);
    });
  }, []);

  if (!room) {
    return (
      <Layout title="Room Not Found">
        <div style={{ padding: '6rem 1rem', textAlign: 'center' }}>
          <h2>Room not found</h2>
          <Link href="/rooms" className="btn btn--primary" style={{ marginTop: '1rem' }}>
            Browse Rooms
          </Link>
        </div>
      </Layout>
    );
  }

  const today = new Date().toISOString().split('T')[0];
  const nights =
    checkIn && checkOut
      ? Math.max(
          0,
          (new Date(checkOut).getTime() - new Date(checkIn).getTime()) / 86400000
        )
      : 0;
  const total = nights * room.price_per_night;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!checkIn || !checkOut) {
      setError('Please select check-in and check-out dates');
      return;
    }
    if (new Date(checkOut) <= new Date(checkIn)) {
      setError('Check-out must be after check-in');
      return;
    }
    if (isGuest && (!guestName || !guestEmail)) {
      setError('Please enter your name and email');
      return;
    }
    setLoading(true);
    try {
      const body: Record<string, unknown> = {
        roomId: room.id,
        checkInDate: checkIn,
        checkOutDate: checkOut,
        totalPrice: total,
        isGuest,
      };
      if (isGuest) {
        body.guestName = guestName;
        body.guestEmail = guestEmail;
      }
      const res = await fetch('/api/bookings/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Booking failed');
        return;
      }
      router.push(`/booking/${data.booking.id}`);
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout title={`${room.name} – Hotel Yashoda`}>
      <div className="booking-page">
        <div className="booking-container">
          <div className="booking-card-detail">
            <div style={{ fontSize: '3rem', textAlign: 'center', marginBottom: '1rem' }}>🛏️</div>
            <h2
              className="room-card__name"
              style={{ fontFamily: 'var(--font-heading)', textAlign: 'center' }}
            >
              {room.name}
            </h2>
            <p style={{ color: '#666', textAlign: 'center', marginBottom: '1rem' }}>
              {room.description}
            </p>
            <p
              style={{
                textAlign: 'center',
                fontSize: '1.5rem',
                fontWeight: 700,
                color: 'var(--color-primary)',
              }}
            >
              ₹{room.price_per_night.toLocaleString('en-IN')}
              <span style={{ fontSize: '0.9rem', color: '#666', fontWeight: 400 }}>/night</span>
            </p>
          </div>

          <div className="booking-card-detail">
            <h3
              style={{
                fontFamily: 'var(--font-heading)',
                marginBottom: '1.25rem',
                color: 'var(--color-secondary)',
              }}
            >
              Book This Room
            </h3>
            <form onSubmit={handleSubmit}>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '1rem',
                  marginBottom: '1rem',
                }}
              >
                <div className="form-group" style={{ margin: 0 }}>
                  <label>Check-in Date</label>
                  <input
                    className="form-control"
                    type="date"
                    value={checkIn}
                    min={today}
                    onChange={(e) => setCheckIn(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group" style={{ margin: 0 }}>
                  <label>Check-out Date</label>
                  <input
                    className="form-control"
                    type="date"
                    value={checkOut}
                    min={checkIn || today}
                    onChange={(e) => setCheckOut(e.target.value)}
                    required
                  />
                </div>
              </div>

              {isGuest && (
                <>
                  <div className="form-group">
                    <label>Your Name</label>
                    <input
                      className="form-control"
                      type="text"
                      value={guestName}
                      onChange={(e) => setGuestName(e.target.value)}
                      required
                      placeholder="Full name"
                    />
                  </div>
                  <div className="form-group">
                    <label>Email</label>
                    <input
                      className="form-control"
                      type="email"
                      value={guestEmail}
                      onChange={(e) => setGuestEmail(e.target.value)}
                      required
                      placeholder="you@example.com"
                    />
                  </div>
                  <p style={{ fontSize: '0.85rem', color: '#666', marginBottom: '1rem' }}>
                    Have an account?{' '}
                    <a
                      href={`/auth/login?redirect=/rooms/${room.id}`}
                      style={{ color: 'var(--color-primary)' }}
                    >
                      Login
                    </a>{' '}
                    or{' '}
                    <a
                      href={`/auth/signup?redirect=/rooms/${room.id}`}
                      style={{ color: 'var(--color-primary)' }}
                    >
                      Sign up
                    </a>{' '}
                    for a better experience.
                  </p>
                </>
              )}

              {nights > 0 && (
                <div className="booking-summary" style={{ marginBottom: '1rem' }}>
                  <h3>Booking Summary</h3>
                  <div className="summary-row">
                    <span>Room</span>
                    <span>{room.name}</span>
                  </div>
                  <div className="summary-row">
                    <span>Nights</span>
                    <span>{nights}</span>
                  </div>
                  <div className="summary-row">
                    <span>Rate</span>
                    <span>₹{room.price_per_night.toLocaleString('en-IN')}/night</span>
                  </div>
                  <div className="summary-row total">
                    <span>Total</span>
                    <span>₹{total.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              )}

              {error && <p className="form-error">{error}</p>}
              <button
                className="btn btn--primary"
                style={{ width: '100%' }}
                type="submit"
                disabled={loading || nights === 0}
              >
                {loading
                  ? 'Creating Booking…'
                  : nights > 0
                  ? `Confirm Booking – ₹${total.toLocaleString('en-IN')}`
                  : 'Select Dates to Continue'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  try {
    const room = await getRoomById(params?.id as string);
    return { props: { room } };
  } catch {
    return { props: { room: null } };
  }
};
