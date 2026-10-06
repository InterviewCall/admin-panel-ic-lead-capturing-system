import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import { getSubmissionDetailApi } from '@/services/submissionsApi';
import { ApiErrorResponse } from '@/types/response';
import { SubmissionDetail } from '@/types/submission';

export function useSubmissionDetail(submissionId: string) {
    return useQuery<SubmissionDetail, AxiosError<ApiErrorResponse>>({
        queryKey: ['submission', submissionId],
        queryFn: () => getSubmissionDetailApi(submissionId),
        // A 404 will not fix itself; other failures (network, 5xx) get the default single retry.
        retry: (failureCount, error) => error.response?.status !== 404 && failureCount < 1,
    });
}
