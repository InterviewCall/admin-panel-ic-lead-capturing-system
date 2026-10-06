'use client';

import Link from 'next/link';
import { FC, useState } from 'react';

import Card from '@/components/ui/Card';
import Pill from '@/components/ui/Pill';
import { BOOKING_STATUS_META, TEMPERATURE_META } from '@/constants/adminStatus';
import { useCancelBooking } from '@/hooks/bookings/useCancelBooking';
import { useCompleteBooking, useUndoCompleteBooking } from '@/hooks/bookings/useCompleteBooking';
import { useNow } from '@/hooks/useNow';
import { BookingListItem } from '@/types/booking';
import { toTelLink } from '@/utils/helpers/contactLinks';
import { formatDayTime, formatSlot } from '@/utils/helpers/dateFormat';

type CallPrepCardProps = {
  booking: BookingListItem | null;
};

const CallPrepCard: FC<CallPrepCardProps> = ({ booking }) => {
  // Which button of which booking is waiting for its "Are you sure?" click.
  const [confirming, setConfirming] = useState<{ id: string; action: 'cancel' | 'done' } | null>(null);
  const now = useNow();
  const { mutate: cancelBooking, isPending: isCancelling } = useCancelBooking();
  const { mutate: completeBooking, isPending: isCompleting } = useCompleteBooking();
  const { mutate: undoComplete, isPending: isReopening } = useUndoCompleteBooking();

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
  const isConfirmingCancel = confirming?.id === booking.bookingId && confirming.action === 'cancel';
  const isConfirmingDone = confirming?.id === booking.bookingId && confirming.action === 'done';
  const callHasStarted = new Date(booking.slotStartAt).getTime() <= now;
  const clearConfirming = () => setConfirming(null);

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

      {booking.status === 'completed' && booking.completedAt && (
        <div className="mt-2.5 text-[13px] font-bold text-(--builder-blue-dark)">
          Marked done {formatDayTime(booking.completedAt)}
        </div>
      )}
      {booking.status === 'confirmed' && !callHasStarted && (
        <div className="mt-2.5 text-[13px] font-bold text-(--builder-muted-light)">
          You can mark this call as done once it has started.
        </div>
      )}

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

        {booking.status === 'confirmed' && !isConfirmingDone && !isConfirmingCancel && (
          <button
            type="button"
            disabled={!callHasStarted}
            onClick={() => setConfirming({ id: booking.bookingId, action: 'done' })}
            className="min-h-11 cursor-pointer rounded-2xl bg-(--builder-blue) px-4 text-sm font-bold text-white transition hover:bg-(--builder-blue-dark) disabled:cursor-not-allowed disabled:opacity-50"
          >
            Mark call done
          </button>
        )}

        {isConfirmingDone && (
          <>
            <button
              type="button"
              disabled={isCompleting}
              onClick={() => completeBooking(booking.bookingId, { onSettled: clearConfirming })}
              className="min-h-11 cursor-pointer rounded-2xl bg-(--builder-blue) px-4 text-sm font-bold text-white transition hover:bg-(--builder-blue-dark) disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isCompleting ? 'Saving...' : 'Yes, call is done'}
            </button>
            <button
              type="button"
              disabled={isCompleting}
              onClick={clearConfirming}
              className="min-h-11 cursor-pointer rounded-2xl border border-slate-300 bg-white px-4 text-sm font-bold text-(--builder-text)"
            >
              Not yet
            </button>
          </>
        )}

        {booking.status === 'completed' && (
          <button
            type="button"
            disabled={isReopening}
            onClick={() => undoComplete(booking.bookingId)}
            className="min-h-11 cursor-pointer rounded-2xl border border-slate-300 bg-white px-4 text-sm font-bold text-(--builder-text) transition hover:border-slate-400 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isReopening ? 'Reopening...' : 'Undo: not done'}
          </button>
        )}

        {(booking.status === 'confirmed' || booking.status === 'initiated') && !isConfirmingCancel && !isConfirmingDone && (
          <button
            type="button"
            onClick={() => setConfirming({ id: booking.bookingId, action: 'cancel' })}
            className="min-h-11 cursor-pointer rounded-2xl border border-slate-300 bg-white px-4 text-sm font-bold text-(--builder-text) transition hover:border-slate-400"
          >
            Cancel booking
          </button>
        )}

        {isConfirmingCancel && (
          <>
            <button
              type="button"
              disabled={isCancelling}
              onClick={() => cancelBooking(booking.bookingId, { onSettled: clearConfirming })}
              className="min-h-11 cursor-pointer rounded-2xl bg-red-700 px-4 text-sm font-bold text-white transition hover:bg-red-800 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isCancelling ? 'Cancelling...' : 'Yes, cancel it'}
            </button>
            <button
              type="button"
              disabled={isCancelling}
              onClick={clearConfirming}
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
