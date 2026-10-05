import { getMockSubmissionList } from '@/mocks/submissionsData';
import type {
    SubmissionFilters,
    SubmissionListItem,
    SubmissionsListResponse,
    SubmissionStatus,
} from '@/types/submission';
import { toYmd } from '@/utils/helpers/dateFormat';

// Stands in for the filtering, counting and pagination the backend will do.

const DAY_MS = 24 * 60 * 60 * 1000;

const sortKey = (item: SubmissionListItem): number => new Date(item.submittedAt ?? item.createdAt).getTime();

export function queryMockSubmissions(filters: SubmissionFilters): SubmissionsListResponse {
    const all = getMockSubmissionList().sort((a, b) => sortKey(b) - sortKey(a));
    const now = Date.now();

    // Everything except status, temperature and search, so tab counts stay stable while filtering.
    const base = all.filter((item) => {
        if (filters.formSlug !== 'all' && item.formSlug !== filters.formSlug) return false;
        if (filters.source !== 'all' && item.source !== filters.source) return false;

        const at = sortKey(item);
        if (filters.range === 'today') return toYmd(at) === toYmd(now);
        if (filters.range === '7d') return now - at <= 7 * DAY_MS;
        if (filters.range === '30d') return now - at <= 30 * DAY_MS;
        return true;
    });

    const countStatus = (status: SubmissionStatus): number => base.filter((item) => item.status === status).length;
    const search = filters.search.trim().toLowerCase();

    const matches = base.filter((item) => {
        if (filters.status !== 'all' && item.status !== filters.status) return false;
        if (filters.temperature !== 'all' && item.leadTemperature !== filters.temperature) return false;
        if (!search) return true;

        return [item.candidate.fullName, item.candidate.email, item.candidate.phone].some((field) =>
            field.toLowerCase().includes(search),
        );
    });

    const start = (filters.page - 1) * filters.pageSize;
    const completedForms = base.filter((item) => item.status !== 'submission_pending').length;

    return {
        items: matches.slice(start, start + filters.pageSize),
        page: filters.page,
        pageSize: filters.pageSize,
        totalItems: matches.length,
        availableSources: Array.from(new Set(all.map((item) => item.source).filter((source): source is string => !!source))),
        summary: {
            total: base.length,
            hot: base.filter((item) => item.leadTemperature === 'hot').length,
            completedForms,
            bookedOrConverted: countStatus('booked') + countStatus('converted'),
            hotNotBooked: base.filter((item) => item.leadTemperature === 'hot' && item.status === 'booking_pending').length,
            statusCounts: {
                all: base.length,
                submission_pending: countStatus('submission_pending'),
                booking_pending: countStatus('booking_pending'),
                booked: countStatus('booked'),
                converted: countStatus('converted'),
                cancelled: countStatus('cancelled'),
            },
        },
    };
}
