'use client';

import clsx from 'clsx';
import { FC } from 'react';

import Card from '@/components/ui/Card';
import { SLOT_STATUS_META } from '@/constants/adminStatus';
import { useSetSlotBlocked } from '@/hooks/bookings/useSetSlotBlocked';
import { useNow } from '@/hooks/useNow';
import { WeekDay } from '@/types/booking';
import { formatDayHeader, formatTime } from '@/utils/helpers/dateFormat';

type WeekCapacityProps = {
  days: WeekDay[];
};

const LEGEND = ['available', 'booked', 'reserved', 'blocked'] as const;

const WeekCapacity: FC<WeekCapacityProps> = ({ days }) => {
  const { mutate: setSlotBlocked, isPending } = useSetSlotBlocked();
  const now = useNow();
  const rowCount = days[0]?.slots.length ?? 0;

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

        {Array.from({ length: rowCount }, (_, rowIndex) => (
          <div key={rowIndex} className="contents">
            <div className="text-[11px] font-bold text-(--builder-muted-light)">
              {formatTime(days[0].slots[rowIndex].slotStartAt)}
            </div>

            {days.map((day) => {
              const slot = day.slots[rowIndex];
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
