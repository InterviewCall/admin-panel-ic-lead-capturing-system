import { DATE_RANGE_OPTIONS, DEFAULT_PAGE_SIZE, SUBMISSION_TABS, TEMPERATURE_FILTERS } from '@/constants/adminStatus';
import type { DateRange, LeadTemperature, SubmissionFilters, SubmissionStatus } from '@/types/submission';

export const DEFAULT_SUBMISSION_FILTERS: SubmissionFilters = {
    status: 'all',
    temperature: 'all',
    formSlug: 'all',
    source: 'all',
    range: '7d',
    search: '',
    page: 1,
    pageSize: DEFAULT_PAGE_SIZE,
};

const STATUS_KEYS: string[] = SUBMISSION_TABS.map((tab) => tab.key);
const TEMPERATURE_KEYS: string[] = TEMPERATURE_FILTERS.map((option) => option.key);
const RANGE_KEYS: string[] = DATE_RANGE_OPTIONS.map((option) => option.key);

type SearchParamsReader = { get: (name: string) => string | null };

// Reads the filters out of the page URL. Anything missing or not recognised falls back to the default,
// so a hand-edited or outdated link can never break the page.
export function parseSubmissionFilters(params: SearchParamsReader): SubmissionFilters {
    const defaults = DEFAULT_SUBMISSION_FILTERS;

    const status = params.get('status');
    const temperature = params.get('temperature');
    const range = params.get('range');
    const page = Number(params.get('page'));

    return {
        status: status && STATUS_KEYS.includes(status) ? (status as SubmissionStatus | 'all') : defaults.status,
        temperature:
            temperature && TEMPERATURE_KEYS.includes(temperature)
                ? (temperature as LeadTemperature | 'all')
                : defaults.temperature,
        formSlug: params.get('form') || defaults.formSlug,
        source: params.get('source') || defaults.source,
        range: range && RANGE_KEYS.includes(range) ? (range as DateRange) : defaults.range,
        search: params.get('search') ?? defaults.search,
        page: Number.isInteger(page) && page > 1 ? page : defaults.page,
        pageSize: defaults.pageSize,
    };
}

// Builds "?status=booked&range=30d" from the filters. Values that equal the default are left out,
// so the plain page stays /submissions.
export function buildSubmissionQuery(filters: SubmissionFilters): string {
    const defaults = DEFAULT_SUBMISSION_FILTERS;
    const params = new URLSearchParams();

    if (filters.status !== defaults.status) params.set('status', filters.status);
    if (filters.temperature !== defaults.temperature) params.set('temperature', filters.temperature);
    if (filters.formSlug !== defaults.formSlug) params.set('form', filters.formSlug);
    if (filters.source !== defaults.source) params.set('source', filters.source);
    if (filters.range !== defaults.range) params.set('range', filters.range);
    if (filters.search.trim()) params.set('search', filters.search.trim());
    if (filters.page > 1) params.set('page', String(filters.page));

    const query = params.toString();
    return query ? `?${query}` : '';
}

// The detail page's "All submissions" link goes back to the list the user came from, filters included.
const LAST_QUERY_KEY = 'submissions:lastQuery';

export function rememberSubmissionQuery(query: string): void {
    try {
        window.sessionStorage.setItem(LAST_QUERY_KEY, query);
    } catch {
        // Storage can be blocked (private mode); the link then simply opens the unfiltered list.
    }
}

export function recallSubmissionQuery(): string {
    try {
        return window.sessionStorage.getItem(LAST_QUERY_KEY) ?? '';
    } catch {
        return '';
    }
}
