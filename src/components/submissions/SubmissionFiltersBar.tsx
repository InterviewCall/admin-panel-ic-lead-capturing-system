import clsx from 'clsx';
import { ChangeEvent, FC } from 'react';

import { DATE_RANGE_OPTIONS, FORM_OPTIONS, TEMPERATURE_FILTERS } from '@/constants/adminStatus';
import { DateRange, SubmissionFilters } from '@/types/submission';

type SubmissionFiltersBarProps = {
  filters: SubmissionFilters;
  sources: string[];
  onChange: (patch: Partial<SubmissionFilters>) => void;
};

const SELECT_CLASS =
  'min-h-11 cursor-pointer rounded-2xl border border-slate-300 bg-white px-3 text-sm font-semibold text-(--builder-text) outline-none focus-visible:border-(--builder-blue)';

const SubmissionFiltersBar: FC<SubmissionFiltersBarProps> = ({ filters, sources, onChange }) => {
  return (
    <div className="flex flex-wrap items-center gap-3 border-b border-(--builder-border) px-5 py-4">
      <label className="flex min-h-11 min-w-65 flex-1 items-center gap-2 rounded-2xl border border-slate-300 bg-white px-3.5 text-slate-500 focus-within:border-(--builder-blue)">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
          <circle cx="11" cy="11" r="7" />
          <path d="M20 20l-3.5-3.5" />
        </svg>
        <input
          type="search"
          value={filters.search}
          onChange={(event: ChangeEvent<HTMLInputElement>) => onChange({ search: event.target.value })}
          placeholder="Search name, email or phone"
          aria-label="Search candidates"
          className="min-w-0 flex-1 bg-transparent text-sm font-semibold text-(--builder-text) outline-none placeholder:text-slate-500"
        />
      </label>

      <select
        aria-label="Form"
        value={filters.formSlug}
        onChange={(event) => onChange({ formSlug: event.target.value })}
        className={SELECT_CLASS}
      >
        <option value="all">All forms</option>
        {FORM_OPTIONS.map((form) => (
          <option key={form.slug} value={form.slug}>
            {form.name}
          </option>
        ))}
      </select>

      <select
        aria-label="Source"
        value={filters.source}
        onChange={(event) => onChange({ source: event.target.value })}
        className={SELECT_CLASS}
      >
        <option value="all">All sources</option>
        {sources.map((source) => (
          <option key={source} value={source}>
            {source}
          </option>
        ))}
      </select>

      <select
        aria-label="Date range"
        value={filters.range}
        onChange={(event) => onChange({ range: event.target.value as DateRange })}
        className={SELECT_CLASS}
      >
        {DATE_RANGE_OPTIONS.map((option) => (
          <option key={option.key} value={option.key}>
            {option.label}
          </option>
        ))}
      </select>

      <div role="group" aria-label="Lead temperature" className="flex items-center gap-1.5">
        {TEMPERATURE_FILTERS.map((option) => {
          const isActive = filters.temperature === option.key;

          return (
            <button
              key={option.key}
              type="button"
              aria-pressed={isActive}
              onClick={() => onChange({ temperature: option.key })}
              className={clsx(
                'min-h-11 cursor-pointer rounded-xl border px-3.5 text-sm font-bold transition',
                isActive
                  ? 'border-[#0f172a] bg-[#0f172a] text-white'
                  : 'border-slate-300 bg-white text-slate-700 hover:border-slate-400',
              )}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default SubmissionFiltersBar;
