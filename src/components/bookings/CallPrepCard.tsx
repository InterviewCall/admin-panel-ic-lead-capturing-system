'use client';

import Link from 'next/link';
import { FC, useState } from 'react';

import Card from '@/components/ui/Card';
import Pill from '@/components/ui/Pill';
import { BOOKING_STATUS_META, TEMPERATURE_META } from '@/constants/adminStatus';
import { useCancelBooking } from '@/hooks/bookings/useCancelBooking';
import { BookingListItem } from '@/types/booking';
import { toTelLink } from '@/utils/helpers/contactLinks';
import { formatSlot } from '@/utils/helpers/dateFormat';

type CallPrepCardProps = {
  booking: BookingListItem | null;
};

const CallPrepCard: FC<CallPrepCardProps> = ({ booking }) => {
  const [confirmingId, setConfirmingId] = useState<string | null>(null);
  const { mutate: cancelBooking, isPending } = useCancelBooking();

  if (!booking) {
    return (
      <Card className="p-5.5">
        <h2 className="text-[13px] font-black uppercase tracking-[0.4px] text-(--builder-muted)">Call prep</h2>
        <p className="mt-3 text-sm font-semibold text-(--builder-muted)">Select a booking to see the candidate details.</p>
      </Card>
    );
  }

  const temperature = booking.leadTemperature ? TEMPERATURE_META[booking.leadTemperature] : null;
  const status = BOOKING_STATUS_META[booking.status];
  const isConfirming = confirmingId === booking.bookingId;

  const rows = [
    { label: 'Phone', value: booking.candidate.phone, href: toTelLink(booking.candidate.phone) },
    { label: 'Email', value: booking.candidate.email, href: `mailto:${booking.candidate.email}` },
    { label: 'Experience', value: booking.callPrep.experience },
    { label: 'Current CTC', value: booking.callPrep.currentCtc },
    { label: 'Main gap', value: booking.callPrep.mainGap },
    { label: 'Urgency', value: booking.callPrep.urgency },
  ];

  return (
    <Card className="p-5.5">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-[13px] font-black uppercase tracking-[0.4px] text-(--builder-muted)">Call prep</h2>
        <span className="font-mono text-xs text-(--builder-muted-light)">booking #{booking.bookingId}</span>
      </div>

      <div className="mt-2.5 text-[22px] font-black tracking-[-0.5px]">{booking.candidate.fullName}</div>
      <div className="font-bold text-(--builder-muted)">{formatSlot(booking.slotStartAt)}</div>

      <div className="mt-2.5 flex flex-wrap gap-2">
        {temperature && (
          <Pill size="md" className={temperature.pillClassName}>
            {temperature.label} {booking.leadScore}
          </Pill>
        )}
        <Pill size="md" className={status.className}>
          {status.label}
        </Pill>
      </div>

      <dl className="mt-4 grid grid-cols-[110px_1fr] gap-x-3 gap-y-2.5 border-t border-(--builder-border) pt-4">
        {rows.map((row) => (
          <div key={row.label} className="contents">
            <dt className="font-bold text-(--builder-muted-light)">{row.label}</dt>
            <dd className="m-0 font-bold wrap-anywhere">
              {row.value && row.href ? (
                <a href={row.href} className="hover:text-(--builder-blue-dark)">
                  {row.value}
                </a>
              ) : (
                (row.value ?? '—')
              )}
            </dd>
          </div>
        ))}
      </dl>

      <div className="mt-4 flex flex-wrap gap-2.5">
        <Link
          href={`/submissions/${booking.submissionId}`}
          className="inline-flex min-h-11 items-center rounded-2xl bg-(--builder-blue) px-4 text-sm font-bold text-white transition hover:bg-(--builder-blue-dark)"
        >
          All answers →
        </Link>

        {booking.status !== 'cancelled' && !isConfirming && (
          <button
            type="button"
            onClick={() => setConfirmingId(booking.bookingId)}
            className="min-h-11 cursor-pointer rounded-2xl border border-slate-300 bg-white px-4 text-sm font-bold text-(--builder-text) transition hover:border-slate-400"
          >
            Cancel booking
          </button>
        )}

        {isConfirming && (
          <>
            <button
              type="button"
              disabled={isPending}
              onClick={() => cancelBooking(booking.bookingId, { onSettled: () => setConfirmingId(null) })}
              className="min-h-11 cursor-pointer rounded-2xl bg-red-700 px-4 text-sm font-bold text-white transition hover:bg-red-800 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isPending ? 'Cancelling...' : 'Yes, cancel it'}
            </button>
            <button
              type="button"
              disabled={isPending}
              onClick={() => setConfirmingId(null)}
              className="min-h-11 cursor-pointer rounded-2xl border border-slate-300 bg-white px-4 text-sm font-bold text-(--builder-text)"
            >
              Keep booking
            </button>
          </>
        )}
      </div>
    </Card>
  );
};

export default CallPrepCard;
