import { usePathname, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useMemo } from 'react';

import { SubmissionFilters } from '@/types/submission';
import { buildSubmissionQuery, parseSubmissionFilters, rememberSubmissionQuery } from '@/utils/helpers/submissionFilters';

// The submissions filters live in the page URL (/submissions?status=booked&range=30d), so a filtered view
// can be bookmarked, shared, reloaded and reached again with the browser's Back button.
export function useSubmissionFilters() {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const filters = useMemo(() => parseSubmissionFilters(searchParams), [searchParams]);

    // Remember the current filters so the detail page can link back to exactly this view.
    useEffect(() => {
        rememberSubmissionQuery(buildSubmissionQuery(filters));
    }, [filters]);

    // Any filter change goes back to the first page, unless the patch sets the page itself.
    const updateFilters = useCallback(
        (patch: Partial<SubmissionFilters>) => {
            const next: SubmissionFilters = { ...filters, page: 1, ...patch };
            const url = `${pathname}${buildSubmissionQuery(next)}`;

            // Next.js keeps useSearchParams in sync with the native history API, and this avoids a server round trip.
            window.history.replaceState(null, '', url);
        },
        [filters, pathname],
    );

    return { filters, updateFilters };
}
