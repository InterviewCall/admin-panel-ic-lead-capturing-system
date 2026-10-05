import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { getSubmissionsApi } from '@/services/submissionsApi';
import { SubmissionFilters } from '@/types/submission';

export function useSubmissions(filters: SubmissionFilters) {
    return useQuery({
        queryKey: ['submissions', filters],
        queryFn: () => getSubmissionsApi(filters),
        placeholderData: keepPreviousData,
    });
}
