import clsx from 'clsx';
import { FC } from 'react';

import { SUBMISSION_TABS } from '@/constants/adminStatus';
import { SubmissionsSummary,SubmissionStatus } from '@/types/submission';

type SubmissionStatusTabsProps = {
  active: SubmissionStatus | 'all';
  counts: SubmissionsSummary['statusCounts'];
  onChange: (status: SubmissionStatus | 'all') => void;
};

const SubmissionStatusTabs: FC<SubmissionStatusTabsProps> = ({ active, counts, onChange }) => {
  return (
    <div role="tablist" aria-label="Submission status" className="flex flex-wrap gap-2 px-5 pt-4">
      {SUBMISSION_TABS.map((tab) => {
        const isActive = active === tab.key;

        return (
          <button
            key={tab.key}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(tab.key)}
            className={clsx(
              'inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-2xl border px-4 text-sm font-bold transition',
              isActive
                ? 'border-(--builder-blue) bg-[#eff6ff] text-(--builder-blue-dark)'
                : 'border-(--builder-border) bg-white text-slate-700 hover:border-slate-300',
            )}
          >
            {tab.label}
            <span
              className={clsx(
                'rounded-full px-2 py-px text-xs font-black',
                isActive ? 'bg-(--builder-blue) text-white' : 'bg-slate-100 text-(--builder-muted)',
              )}
            >
              {counts[tab.key]}
            </span>
          </button>
        );
      })}
    </div>
  );
};

export default SubmissionStatusTabs;
