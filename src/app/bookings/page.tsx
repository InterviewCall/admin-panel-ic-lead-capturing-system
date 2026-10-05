import { FC } from 'react';

import BookingsView from '@/components/bookings/BookingsView';
import AdminShell from '@/components/layout/AdminShell';

const BookingsPage: FC = () => {
  return (
    <AdminShell>
      <BookingsView />
    </AdminShell>
  );
};

export default BookingsPage;
