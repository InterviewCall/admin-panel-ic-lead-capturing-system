import clsx from 'clsx';
import { FC } from 'react';

import { BookingListItem } from '@/types/booking';
import { formatShortDay, formatTime } from '@/utils/helpers/dateFormat';

import { BookingBadges } from './BookingsAgenda';

type BookingsTableProps = {
  bookings: BookingListItem[];
  selectedId: string | null;
  onSelect: (bookingId: string) => void;
};

const BookingsTable: FC<BookingsTableProps> = ({ bookings, selectedId, onSelect }) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-170 border-collapse text-left">
        <thead>
          <tr className="bg-slate-50 text-xs font-black uppercase tracking-[0.4px] text-(--builder-muted)">
            <th className="px-6 py-3">Date</th>
            <th className="px-3 py-3">Time</th>
            <th className="px-3 py-3">Candidate</th>
            <th className="px-3 py-3">Status</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((booking) => (
            <tr
              key={booking.bookingId}
              onClick={() => onSelect(booking.bookingId)}
              className={clsx(
                'cursor-pointer border-t border-slate-100 transition',
                booking.bookingId === selectedId ? 'bg-[#eff6ff]' : 'hover:bg-slate-50',
              )}
            >
              <td className="px-6 py-3.5 font-bold">{formatShortDay(booking.slotStartAt)}</td>
              <td className="px-3 py-3.5 font-mono text-sm">{formatTime(booking.slotStartAt)}</td>
              <td className="px-3 py-3.5">
                <button
                  type="button"
                  onClick={() => onSelect(booking.bookingId)}
                  className="cursor-pointer text-left font-black"
                >
                  {booking.candidate.fullName}
                </button>
                <div className="text-[13px] font-medium text-(--builder-muted-light)">{booking.formName}</div>
              </td>
              <td className="px-3 py-3.5">
                <BookingBadges booking={booking} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BookingsTable;
