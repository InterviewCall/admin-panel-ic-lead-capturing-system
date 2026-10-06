import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import { getSubmissionsApi } from '@/services/submissionsApi';
import { ApiErrorResponse } from '@/types/response';
import { SubmissionFilters, SubmissionsListResponse } from '@/types/submission';

export function useSubmissions(filters: SubmissionFilters) {
    return useQuery<SubmissionsListResponse, AxiosError<ApiErrorResponse>>({
        queryKey: ['submissions', filters],
        queryFn: () => getSubmissionsApi(filters),
        placeholderData: keepPreviousData,
    });
}
