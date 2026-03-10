import { GetServerSideProps } from 'next';
import Link from 'next/link';
import Layout from '../../components/Layout';
import { getActiveRooms } from '../../services/bookingService';

interface Room {
  id: string;
  name: string;
  description: string;
  price_per_night: number;
  capacity: number;
  images: string[];
}

interface Props {
  rooms: Room[];
  error?: string;
}

export default function RoomsPage({ rooms, error }: Props) {
  return (
    <Layout title="Rooms – Hotel Yashoda">
      <div className="rooms-page">
        <div className="rooms-page__header">
          <span className="section__tag">Accommodation</span>
          <h1 className="section__title">Our Rooms</h1>
          <p className="section__sub">
            Choose from our comfortable, well-maintained rooms at affordable prices.
          </p>
        </div>
        {error && (
          <p style={{ textAlign: 'center', color: '#e74c3c', marginBottom: '2rem' }}>{error}</p>
        )}
        <div className="rooms-grid">
          {rooms.map((room) => (
            <div key={room.id} className="room-card">
              <div
                className="room-card__img-wrap"
                style={{
                  background: '#e8dcc8',
                  height: '200px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '3rem',
                }}
              >
                🛏️
              </div>
              <div className="room-card__body">
                <h3 className="room-card__name">{room.name}</h3>
                <p className="room-card__desc">{room.description}</p>
                <div className="room-card__meta">
                  <span className="room-card__capacity">👥 Up to {room.capacity} guests</span>
                </div>
                <div className="room-card__footer">
                  <div className="room-card__price">
                    <span className="room-card__price-amount">
                      ₹{room.price_per_night.toLocaleString('en-IN')}
                    </span>
                    <span className="room-card__price-unit"> / night</span>
                  </div>
                  <Link href={`/rooms/${room.id}`} className="btn btn--primary btn--sm">
                    Book Now
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    const rooms = await getActiveRooms();
    return { props: { rooms: rooms ?? [] } };
  } catch {
    return { props: { rooms: [], error: 'Failed to load rooms. Please try again.' } };
  }
};
