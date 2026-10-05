'use client';

import { FC, useState } from 'react';

import Card from '@/components/ui/Card';
import { LoadingBlock, MessageBlock } from '@/components/ui/PageState';
import StatCard from '@/components/ui/StatCard';
import { DEFAULT_PAGE_SIZE, HOT_SCORE_THRESHOLD } from '@/constants/adminStatus';
import { useSubmissions } from '@/hooks/submissions/useSubmissions';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import { SubmissionFilters } from '@/types/submission';
import { downloadCsv } from '@/utils/helpers/downloadCsv';

import SubmissionFiltersBar from './SubmissionFiltersBar';
import SubmissionsTable from './SubmissionsTable';
import SubmissionStatusTabs from './SubmissionStatusTabs';

const DEFAULT_FILTERS: SubmissionFilters = {
  status: 'all',
  temperature: 'all',
  formSlug: 'all',
  source: 'all',
  range: '7d',
  search: '',
  page: 1,
  pageSize: DEFAULT_PAGE_SIZE,
};

const SubmissionsView: FC = () => {
  const [filters, setFilters] = useState<SubmissionFilters>(DEFAULT_FILTERS);
  const debouncedSearch = useDebouncedValue(filters.search, 300);

  const { data, isPending, isError, isFetching, refetch } = useSubmissions({
    ...filters,
    search: debouncedSearch,
  });

  // Any filter change goes back to the first page.
  const updateFilters = (patch: Partial<SubmissionFilters>) => {
    setFilters((current) => ({ ...current, page: 1, ...patch }));
  };

  const handleExport = () => {
    if (!data) return;

    downloadCsv(
      'submissions.csv',
      ['Name', 'Email', 'Phone', 'Form', 'Score', 'Temperature', 'Status', 'Source', 'Campaign'],
      data.items.map((item) => [
        item.candidate.fullName,
        item.candidate.email,
        item.candidate.phone,
        item.formName,
        item.leadScore,
        item.leadTemperature,
        item.status,
        item.source,
        item.utmCampaign,
      ]),
    );
  };

  const summary = data?.summary;
  const bookingRate =
    summary && summary.completedForms > 0
      ? `${Math.round((summary.bookedOrConverted / summary.completedForms) * 100)}%`
      : '—';

  const firstRow = data && data.totalItems > 0 ? (data.page - 1) * data.pageSize + 1 : 0;
  const lastRow = data ? Math.min(data.page * data.pageSize, data.totalItems) : 0;
  const hasNextPage = data ? data.page * data.pageSize < data.totalItems : false;

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-[32px] font-black tracking-[-0.8px] text-[#020617]">Candidate Submissions</h1>
          <p className="mt-1.5 text-sm font-semibold text-(--builder-muted)">
            Every lead from the qualification forms, with score, answers and booking status.
          </p>
        </div>

        <div className="flex flex-wrap gap-2.5">
          <button
            type="button"
            onClick={handleExport}
            disabled={!data || data.items.length === 0}
            title="Exports the rows on this page"
            className="min-h-11 cursor-pointer rounded-2xl border border-slate-300 bg-white px-4.5 text-sm font-bold text-(--builder-text) transition hover:border-slate-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Export CSV
          </button>
          <button
            type="button"
            onClick={() => refetch()}
            disabled={isFetching}
            className="min-h-11 cursor-pointer rounded-2xl bg-(--builder-blue) px-4.5 text-sm font-bold text-white transition hover:bg-(--builder-blue-dark) disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isFetching ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>
      </div>

      <section aria-label="Summary" className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-4">
        <StatCard label="Submissions" value={summary ? String(summary.total) : '—'} note="In the selected date range" />
        <StatCard label="Hot leads" value={summary ? String(summary.hot) : '—'} note={`Score ${HOT_SCORE_THRESHOLD} and above`} />
        <StatCard
          label="Booking rate"
          value={bookingRate}
          note={summary ? `${summary.bookedOrConverted} of ${summary.completedForms} completed forms` : 'Booked of completed forms'}
        />
        <StatCard label="Hot, not booked" value={summary ? String(summary.hotNotBooked) : '—'} note="Follow up by call first" />
      </section>

      <Card className="overflow-hidden">
        <SubmissionStatusTabs
          active={filters.status}
          counts={
            summary?.statusCounts ?? {
              all: 0,
              submission_pending: 0,
              booking_pending: 0,
              booked: 0,
              converted: 0,
              cancelled: 0,
            }
          }
          onChange={(status) => updateFilters({ status })}
        />

        <SubmissionFiltersBar filters={filters} sources={data?.availableSources ?? []} onChange={updateFilters} />

        {isPending && <LoadingBlock label="Loading submissions..." />}

        {isError && (
          <MessageBlock
            title="Could not load submissions"
            description="Something went wrong while fetching the list."
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

        {data && data.items.length === 0 && (
          <MessageBlock title="No submissions match these filters" description="Try a different status, date range or search." />
        )}

        {data && data.items.length > 0 && <SubmissionsTable items={data.items} />}

        {data && (
          <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3.5 text-[13px] font-semibold text-(--builder-muted)">
            <div>
              Showing {firstRow}–{lastRow} of {data.totalItems} submissions
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                disabled={data.page <= 1}
                onClick={() => setFilters((current) => ({ ...current, page: current.page - 1 }))}
                className="min-h-11 cursor-pointer rounded-xl border border-slate-300 bg-white px-4 font-bold text-(--builder-text) disabled:cursor-not-allowed disabled:text-slate-400"
              >
                Previous
              </button>
              <button
                type="button"
                disabled={!hasNextPage}
                onClick={() => setFilters((current) => ({ ...current, page: current.page + 1 }))}
                className="min-h-11 cursor-pointer rounded-xl border border-slate-300 bg-white px-4 font-bold text-(--builder-text) disabled:cursor-not-allowed disabled:text-slate-400"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </Card>
    </>
  );
};

export default SubmissionsView;
