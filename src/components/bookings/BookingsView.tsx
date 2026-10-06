'use client';

import clsx from 'clsx';
import { FC, useState } from 'react';

import Card from '@/components/ui/Card';
import { LoadingBlock, MessageBlock } from '@/components/ui/PageState';
import StatCard from '@/components/ui/StatCard';
import { useBookingsWeek } from '@/hooks/bookings/useBookingsWeek';
import { useNow } from '@/hooks/useNow';
import {
  addDaysToYmd,
  formatDayMonth,
  formatSlot,
  getWeekStart,
} from '@/utils/helpers/dateFormat';

import BookingsAgenda from './BookingsAgenda';
import BookingsTable from './BookingsTable';
import CallPrepCard from './CallPrepCard';
import WeekCapacity from './WeekCapacity';

type ViewMode = 'agenda' | 'table';

const BookingsView: FC = () => {
  const [weekStart, setWeekStart] = useState(() => getWeekStart(Date.now()));
  const [viewMode, setViewMode] = useState<ViewMode>('agenda');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const { data, isPending, isError, error, refetch } = useBookingsWeek(weekStart);

  const weekEnd = addDaysToYmd(weekStart, 6);
  const now = useNow();
  const currentWeekStart = getWeekStart(now);

  const firstUpcoming = data?.bookings.find((booking) => booking.status !== 'cancelled' && new Date(booking.slotStartAt).getTime() > now);
  const selectedBooking =
    data?.bookings.find((booking) => booking.bookingId === selectedId) ?? firstUpcoming ?? data?.bookings[0] ?? null;

  const summary = data?.summary;
  const needsAttention = summary ? summary.failedMessages + summary.heldThisWeek + summary.callsToMark : 0;

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-[32px] font-black tracking-[-0.8px] text-[#020617]">Bookings</h1>
          <p className="mt-1.5 text-sm font-semibold text-(--builder-muted)">
            Who is on the calendar, whether they were notified, and how full the week is.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            disabled={weekStart === currentWeekStart}
            onClick={() => setWeekStart(currentWeekStart)}
            className="min-h-11 cursor-pointer rounded-2xl border border-slate-300 bg-white px-4.5 text-sm font-bold text-(--builder-text) transition hover:border-slate-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            This week
          </button>
          <button
            type="button"
            aria-label="Previous week"
            onClick={() => setWeekStart((current) => addDaysToYmd(current, -7))}
            className="min-h-11 w-11 cursor-pointer rounded-2xl border border-slate-300 bg-white text-lg font-bold text-(--builder-text) transition hover:border-slate-400"
          >
            ‹
          </button>
          <div className="min-w-36 text-center font-black">
            {formatDayMonth(weekStart)} to {formatDayMonth(weekEnd)}
          </div>
          <button
            type="button"
            aria-label="Next week"
            onClick={() => setWeekStart((current) => addDaysToYmd(current, 7))}
            className="min-h-11 w-11 cursor-pointer rounded-2xl border border-slate-300 bg-white text-lg font-bold text-(--builder-text) transition hover:border-slate-400"
          >
            ›
          </button>

          <div role="group" aria-label="View" className="ml-2 flex gap-1 rounded-2xl bg-slate-200 p-1">
            {(['agenda', 'table'] as const).map((mode) => (
              <button
                key={mode}
                type="button"
                aria-pressed={viewMode === mode}
                onClick={() => setViewMode(mode)}
                className={clsx(
                  'min-h-10 cursor-pointer rounded-xl px-4 text-sm font-bold capitalize transition',
                  viewMode === mode ? 'bg-white text-(--builder-text)' : 'text-(--builder-muted)',
                )}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>
      </div>

      <section aria-label="Summary" className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-4">
        <StatCard
          label="Calls today"
          value={summary ? String(summary.callsToday) : '—'}
          note={summary?.nextCallAt ? `Next: ${formatSlot(summary.nextCallAt)}` : 'No upcoming calls'}
        />
        <StatCard
          label="Confirmed this week"
          value={summary ? String(summary.confirmedThisWeek) : '—'}
          note={summary ? `${summary.completedThisWeek} done, ${summary.heldThisWeek} held, ${summary.cancelledThisWeek} cancelled` : ''}
        />
        <StatCard
          label="Week capacity used"
          value={summary ? `${summary.capacityUsedPercent}%` : '—'}
          note="Booked and held, of upcoming open slots"
        />
        <StatCard
          label="Needs attention"
          value={summary ? String(needsAttention) : '—'}
          note={
            summary
              ? `${summary.failedMessages} failed message, ${summary.heldThisWeek} unconfirmed slot, ${summary.callsToMark} to mark done`
              : ''
          }
        />
      </section>

      {isPending && <LoadingBlock label="Loading bookings..." />}

      {isError && (
        <MessageBlock
          title="Could not load bookings"
          description={
            error?.response?.data?.message ??
            (error?.response ? 'Something went wrong while fetching this week.' : 'Could not reach the server. Check that the booking service is running.')
          }
          action={
            <button
              type="button"
              onClick={() => refetch()}
              className="min-h-11 cursor-pointer rounded-2xl bg-(--builder-blue) px-4.5 text-sm font-bold text-white"
            >
              Try again
            </button>
          }
        />
      )}

      {data?.warnings && data.warnings.length > 0 && (
        <div role="status" className="rounded-2xl bg-orange-50 px-3.5 py-2.5 text-[13px] font-bold text-orange-800">
          Message status is temporarily unavailable, so delivery details may be missing. Try again in a moment.
        </div>
      )}

      {data && (
        <div className="flex flex-wrap items-start gap-5">
          <Card className="min-w-0 flex-[999_1_600px] overflow-hidden">
            {data.bookings.length === 0 ? (
              <MessageBlock title="No bookings this week" description="Bookings will appear here as candidates reserve slots." />
            ) : viewMode === 'agenda' ? (
              <BookingsAgenda
                days={data.days}
                bookings={data.bookings}
                selectedId={selectedBooking?.bookingId ?? null}
                onSelect={setSelectedId}
              />
            ) : (
              <BookingsTable
                bookings={data.bookings}
                selectedId={selectedBooking?.bookingId ?? null}
                onSelect={setSelectedId}
              />
            )}
          </Card>

          <aside className="flex min-w-0 flex-[1_1_380px] flex-col gap-5">
            <CallPrepCard booking={selectedBooking} />
            <WeekCapacity days={data.days} />
          </aside>
        </div>
      )}
    </>
  );
};

export default BookingsView;
