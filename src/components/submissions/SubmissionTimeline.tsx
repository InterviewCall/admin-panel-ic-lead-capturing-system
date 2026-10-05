'use client';

import clsx from 'clsx';
import { FC } from 'react';

import Card from '@/components/ui/Card';
import { useNow } from '@/hooks/useNow';
import { TimelineEvent } from '@/types/submission';
import { formatDayTime } from '@/utils/helpers/dateFormat';

type SubmissionTimelineProps = {
  events: TimelineEvent[];
};

const SubmissionTimeline: FC<SubmissionTimelineProps> = ({ events }) => {
  const now = useNow();

  return (
    <Card ariaLabel="Timeline" className="px-6 py-5">
      <ol className="grid grid-cols-[repeat(auto-fit,minmax(170px,1fr))] gap-4">
        {events.map((event) => {
          const isDone = event.at !== null && new Date(event.at).getTime() <= now;

          return (
            <li key={event.key}>
              <div className="flex items-center gap-2">
                <span
                  aria-hidden="true"
                  className={clsx(
                    'size-3.5 flex-none rounded-full border-2',
                    isDone ? 'border-(--builder-blue) bg-(--builder-blue)' : 'border-slate-300 bg-white',
                  )}
                />
                <span className="font-black">{event.label}</span>
              </div>
              <div className="ml-5.5 text-[13px] font-medium text-(--builder-muted-light)">
                {event.at ? formatDayTime(event.at) : 'Pending'}
              </div>
            </li>
          );
        })}
      </ol>
    </Card>
  );
};

export default SubmissionTimeline;
