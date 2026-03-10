import { GetServerSideProps } from 'next';

export default function AdminIndexPage() {
  return null;
}

export const getServerSideProps: GetServerSideProps = async () => {
  return { redirect: { destination: '/admin/bookings', permanent: false } };
};
