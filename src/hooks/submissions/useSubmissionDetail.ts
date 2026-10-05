import { useQuery } from '@tanstack/react-query';

import { getSubmissionDetailApi } from '@/services/submissionsApi';

export function useSubmissionDetail(submissionId: string) {
    return useQuery({
        queryKey: ['submission', submissionId],
        queryFn: () => getSubmissionDetailApi(submissionId),
        retry: false,
    });
}
