'use client';

import clsx from 'clsx';
import { FC } from 'react';

import Pill from '@/components/ui/Pill';
import { BOOKING_STATUS_META, TEMPERATURE_META } from '@/constants/adminStatus';
import { useNow } from '@/hooks/useNow';
import { BookingListItem, WeekDay } from '@/types/booking';
import { formatLongDay, formatTime, toYmd } from '@/utils/helpers/dateFormat';
import { NOTIFICATION_TONE_CLASS, summarizeBookingNotifications } from '@/utils/helpers/notifications';

type BookingsAgendaProps = {
  days: WeekDay[];
  bookings: BookingListItem[];
  selectedId: string | null;
  onSelect: (bookingId: string) => void;
};

export const BookingBadges: FC<{ booking: BookingListItem }> = ({ booking }) => {
  const temperature = booking.leadTemperature ? TEMPERATURE_META[booking.leadTemperature] : null;
  const status = BOOKING_STATUS_META[booking.status];
  const notification = summarizeBookingNotifications(booking.notifications);

  return (
    <div className="flex flex-wrap items-center gap-2">
      {temperature && (
        <Pill className={temperature.pillClassName}>
          {temperature.label} {booking.leadScore}
        </Pill>
      )}
      <Pill className={status.className}>{status.label}</Pill>
      {booking.status !== 'cancelled' && (
        <Pill className={NOTIFICATION_TONE_CLASS[notification.tone]}>{notification.label}</Pill>
      )}
    </div>
  );
};

const BookingsAgenda: FC<BookingsAgendaProps> = ({ days, bookings, selectedId, onSelect }) => {
  const now = useNow();
  const today = toYmd(now);

  const visibleDays = days.filter(
    (day) => day.date === today || bookings.some((booking) => toYmd(booking.slotStartAt) === day.date),
  );

  return (
    <>
      {visibleDays.map((day) => {
        const dayBookings = bookings.filter((booking) => toYmd(booking.slotStartAt) === day.date);
        // A call marked as done is still a confirmed booking.
        const done = dayBookings.filter((booking) => booking.status === 'completed').length;
        const confirmed = dayBookings.filter((booking) => booking.status === 'confirmed').length + done;
        const held = dayBookings.filter((booking) => booking.status === 'initiated').length;
        const openSlots = day.slots.filter(
          (slot) => slot.status === 'available' && new Date(slot.slotStartAt).getTime() > now,
        ).length;

        return (
          <div key={day.date}>
            <div className="flex flex-wrap items-center justify-between gap-2 border-y border-(--builder-border) bg-slate-50 px-6 py-3">
              <h2 className="font-black tracking-[-0.2px]">
                {day.date === today ? 'Today · ' : ''}
                {formatLongDay(day.date)}
              </h2>
              <div className="text-[13px] font-bold text-(--builder-muted)">
                {confirmed} confirmed{done > 0 ? `, ${done} done` : ''}{held > 0 ? `, ${held} held` : ''}
              </div>
            </div>

            {dayBookings.map((booking) => {
              const isSelected = booking.bookingId === selectedId;

              return (
                <button
                  key={booking.bookingId}
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => onSelect(booking.bookingId)}
                  className={clsx(
                    'flex w-full cursor-pointer flex-wrap items-center gap-x-4 gap-y-3 border-b border-slate-100 px-6 py-3.5 text-left transition',
                    isSelected ? 'bg-[#eff6ff]' : 'bg-white hover:bg-slate-50',
                    booking.status === 'cancelled' && 'opacity-70',
                  )}
                >
                  <div className="w-21 flex-none font-mono text-sm">{formatTime(booking.slotStartAt)}</div>
                  <div className="min-w-55 flex-[1_1_220px]">
                    <div className={clsx('text-[15px] font-black', booking.status === 'cancelled' && 'line-through')}>
                      {booking.candidate.fullName}
                    </div>
                    <div className="text-[13px] font-medium text-(--builder-muted-light)">{booking.formName}</div>
                  </div>
                  <BookingBadges booking={booking} />
                </button>
              );
            })}

            <div className="border-b border-slate-100 px-6 py-3 text-[13px] font-bold text-(--builder-muted-light)">
              {openSlots} more open slot{openSlots === 1 ? '' : 's'}
              {day.date === today ? ' today' : ''}
            </div>
          </div>
        );
      })}
    </>
  );
};

export default BookingsAgenda;
