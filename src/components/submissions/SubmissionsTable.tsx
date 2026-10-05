import Link from 'next/link';
import { FC } from 'react';

import Pill from '@/components/ui/Pill';
import { SUBMISSION_STATUS_META, TEMPERATURE_META } from '@/constants/adminStatus';
import { SubmissionListItem } from '@/types/submission';
import { formatRelative, formatSlot } from '@/utils/helpers/dateFormat';
import { getInitials } from '@/utils/helpers/notifications';

const GRID =
  'grid grid-cols-[minmax(220px,2.2fr)_minmax(150px,1.5fr)_minmax(150px,1.4fr)_minmax(130px,1.2fr)_minmax(150px,1.5fr)_minmax(130px,1.2fr)_minmax(100px,1fr)] items-center gap-4 px-5';

const MAX_REMINDERS = 3;

function getBookedCall(item: SubmissionListItem): { title: string; note: string } {
  if (item.status === 'converted') {
    return { title: item.booking ? formatSlot(item.booking.slotStartAt) : '—', note: 'Call completed' };
  }

  if (item.booking) {
    const notes = { confirmed: 'Confirmed', initiated: 'Slot held, not confirmed', cancelled: 'Booking cancelled' };
    return { title: formatSlot(item.booking.slotStartAt), note: notes[item.booking.status] };
  }

  if (item.status === 'booking_pending') {
    return { title: 'Not booked', note: `${item.reminderCount} of ${MAX_REMINDERS} reminders sent` };
  }

  return { title: '—', note: 'Left before submitting' };
}

type SubmissionsTableProps = {
  items: SubmissionListItem[];
};

const SubmissionsTable: FC<SubmissionsTableProps> = ({ items }) => {
  return (
    <div className="overflow-x-auto">
      <div className="min-w-280">
        <div className={`${GRID} border-b border-(--builder-border) bg-slate-50 py-3 text-xs font-black uppercase tracking-[0.4px] text-(--builder-muted)`}>
          <div>Candidate</div>
          <div>Form</div>
          <div>Lead score</div>
          <div>Status</div>
          <div>Booked call</div>
          <div>Source</div>
          <div>Submitted</div>
        </div>

        {items.map((item) => {
          const status = SUBMISSION_STATUS_META[item.status];
          const temperature = item.leadTemperature ? TEMPERATURE_META[item.leadTemperature] : null;
          const bookedCall = getBookedCall(item);

          return (
            <div key={item.publicId} className={`${GRID} border-b border-slate-100 py-3.5 transition hover:bg-slate-50`}>
              <div className="flex min-w-0 items-center gap-3">
                <div className="grid size-10 flex-none place-items-center rounded-full bg-[#eff6ff] text-sm font-black text-(--builder-blue-dark)">
                  {getInitials(item.candidate.fullName)}
                </div>
                <div className="min-w-0">
                  <Link
                    href={`/submissions/${item.publicId}`}
                    className="font-black text-(--builder-text) hover:text-(--builder-blue-dark)"
                  >
                    {item.candidate.fullName}
                  </Link>
                  <div className="truncate text-[13px] font-medium text-(--builder-muted)">{item.candidate.email}</div>
                  <div className="text-[13px] font-medium text-(--builder-muted-light)">{item.candidate.phone}</div>
                </div>
              </div>

              <div>
                <div className="font-bold">{item.formName}</div>
                <div className="font-mono text-xs text-(--builder-muted-light)">{item.formSlug}</div>
              </div>

              <div>
                {item.leadScore !== null && temperature ? (
                  <>
                    <div className="flex items-center gap-2">
                      <span className="text-xl font-black tracking-[-0.5px]">{item.leadScore}</span>
                      <Pill className={temperature.pillClassName}>{temperature.label}</Pill>
                    </div>
                    <div className="mt-1.5 h-1.5 max-w-35 rounded-full bg-slate-200">
                      <div
                        className={`h-1.5 rounded-full ${temperature.barClassName}`}
                        style={{ width: `${item.leadScore}%` }}
                      />
                    </div>
                  </>
                ) : (
                  <span className="text-(--builder-muted-light)">Not submitted</span>
                )}
              </div>

              <div>
                <Pill className={status.className}>{status.label}</Pill>
              </div>

              <div>
                <div className="font-bold">{bookedCall.title}</div>
                <div className="text-[13px] font-medium text-(--builder-muted-light)">{bookedCall.note}</div>
              </div>

              <div>
                <div className="font-bold">{item.source ?? '—'}</div>
                <div className="font-mono text-xs text-(--builder-muted-light)">{item.utmCampaign ?? ''}</div>
              </div>

              <div className="text-[13px] font-medium text-(--builder-muted)">
                {formatRelative(item.submittedAt ?? item.createdAt)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SubmissionsTable;
