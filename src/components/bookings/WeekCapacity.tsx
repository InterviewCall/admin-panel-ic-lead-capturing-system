'use client';

import clsx from 'clsx';
import { FC } from 'react';

import Card from '@/components/ui/Card';
import { SLOT_STATUS_META } from '@/constants/adminStatus';
import { useSetSlotBlocked } from '@/hooks/bookings/useSetSlotBlocked';
import { useNow } from '@/hooks/useNow';
import { WeekDay, WeekSlot } from '@/types/booking';
import { formatDayHeader, formatTime } from '@/utils/helpers/dateFormat';

type WeekCapacityProps = {
  days: WeekDay[];
};

const LEGEND = ['available', 'booked', 'reserved', 'blocked'] as const;

const IST_OFFSET_MINUTES = 330;

// Minutes since midnight in IST: the row a slot belongs to, whatever the date.
function getIstMinutes(slotStartAt: string): number {
  const date = new Date(slotStartAt);
  return (date.getUTCHours() * 60 + date.getUTCMinutes() + IST_OFFSET_MINUTES) % (24 * 60);
}

// Rows are the times of day that exist on any day of the week. A day without that slot (or without any slots) just has a gap.
function buildRows(days: WeekDay[]): { minutes: number; label: string }[] {
  const rows = new Map<number, string>();

  for (const day of days) {
    for (const slot of day.slots) {
      rows.set(getIstMinutes(slot.slotStartAt), formatTime(slot.slotStartAt));
    }
  }

  return Array.from(rows, ([minutes, label]) => ({ minutes, label })).sort((a, b) => a.minutes - b.minutes);
}

const WeekCapacity: FC<WeekCapacityProps> = ({ days }) => {
  const { mutate: setSlotBlocked, isPending } = useSetSlotBlocked();
  const now = useNow();
  const rows = buildRows(days);

  return (
    <Card className="p-5.5">
      <h2 className="mb-1 text-[13px] font-black uppercase tracking-[0.4px] text-(--builder-muted)">Week capacity</h2>
      <p className="mb-3.5 text-[13px] font-medium text-(--builder-muted)">
        Select an open slot to block it, or a blocked slot to open it again.
      </p>

      <div className="grid grid-cols-[52px_repeat(7,minmax(0,1fr))] items-center gap-1">
        <div />
        {days.map((day) => (
          <div key={day.date} className="text-center text-xs font-black text-(--builder-muted)">
            {formatDayHeader(day.date)}
          </div>
        ))}

        {rows.map((row) => (
          <div key={row.minutes} className="contents">
            <div className="text-[11px] font-bold text-(--builder-muted-light)">{row.label}</div>

            {days.map((day) => {
              const slot: WeekSlot | undefined = day.slots.find((entry) => getIstMinutes(entry.slotStartAt) === row.minutes);

              if (!slot) {
                return <div key={day.date} aria-hidden="true" className="h-6 rounded-md border border-dashed border-slate-200" />;
              }

              const meta = SLOT_STATUS_META[slot.status];
              const isPastSlot = new Date(slot.slotStartAt).getTime() <= now;
              const canToggle = !isPastSlot && (slot.status === 'available' || slot.status === 'blocked');
              const label = `${formatDayHeader(day.date)}, ${formatTime(slot.slotStartAt)}: ${isPastSlot ? 'Past' : meta.label}`;

              return (
                <button
                  key={slot.slotId}
                  type="button"
                  disabled={!canToggle || isPending}
                  aria-label={label}
                  title={label}
                  onClick={() => setSlotBlocked({ slotStartAt: slot.slotStartAt, blocked: slot.status === 'available' })}
                  className={clsx(
                    'h-6 rounded-md transition',
                    isPastSlot ? 'border border-slate-100 bg-slate-100' : meta.className,
                    canToggle ? 'cursor-pointer' : 'cursor-default',
                  )}
                />
              );
            })}
          </div>
        ))}
      </div>

      {rows.length === 0 && (
        <p className="py-3 text-center text-[13px] font-semibold text-(--builder-muted)">No slots are set up for this week.</p>
      )}

      <div className="mt-3.5 flex flex-wrap gap-3 text-xs font-bold text-(--builder-muted)">
        {LEGEND.map((key) => (
          <span key={key} className="inline-flex items-center gap-1.5">
            <span className={clsx('size-3.5 rounded', SLOT_STATUS_META[key].className)} />
            {SLOT_STATUS_META[key].label}
          </span>
        ))}
        <span className="inline-flex items-center gap-1.5">
          <span className="size-3.5 rounded bg-slate-100" />
          Past
        </span>
      </div>
    </Card>
  );
};

export default WeekCapacity;
