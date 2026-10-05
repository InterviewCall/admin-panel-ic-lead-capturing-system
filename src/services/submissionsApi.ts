import { getMockSubmissionDetail } from '@/mocks/submissionsData';
import { queryMockSubmissions } from '@/mocks/submissionsQuery';
import { SubmissionDetail, SubmissionFilters, SubmissionsListResponse } from '@/types/submission';

const simulateLatency = (ms = 350) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * TODO(api): the backend is not ready, so these functions return dummy data from src/mocks.
 * When the endpoints are live, replace each body with the real call and delete src/mocks:
 *
 *   const response = await apiClient.get<...>('/admin/submissions', { params: filters });
 *   return response.data.data;
 */
export async function getSubmissionsApi(filters: SubmissionFilters): Promise<SubmissionsListResponse> {
    await simulateLatency();
    return queryMockSubmissions(filters);
}

export async function getSubmissionDetailApi(submissionId: string): Promise<SubmissionDetail> {
    await simulateLatency();

    const detail = getMockSubmissionDetail(submissionId);
    if (!detail) {
        throw new Error('Submission not found');
    }

    return detail;
}
