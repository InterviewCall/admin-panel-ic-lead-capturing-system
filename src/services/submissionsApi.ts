import { apiClient } from '@/lib/apiClient';
import { SubmissionDetail, SubmissionFilters, SubmissionsListResponse } from '@/types/submission';

type GetSubmissionsResponse = {
    success: boolean;
    message: string;
    data: {
        publicId: string;
        formSlug: string;
        form: {
            name: string;
        };
        status: string;
        leadScore: number | null;
        leadTemperature: string | null;
        submittedAt: string | null;
        candidate: {
            fullName: string;
            email: string;
            phone: string;
        };
    }[];
    error?: Record<string, unknown>;
};

type FrontendSubmissionFilters = SubmissionFilters & {
    status?: string;
    page?: number;
    pageSize?: number;
};

export async function getSubmissionsApi(filters: SubmissionFilters): Promise<SubmissionsListResponse> {
    const response = await apiClient.get<GetSubmissionsResponse>('/submissions');

    const now = new Date();
    const currentFilters = filters as FrontendSubmissionFilters;

    const pageSize = currentFilters.pageSize ?? 10;
    const page = Math.max(currentFilters.page ?? 1, 1);

    const baseFilteredSubmissions = response.data.data.filter((submission) => {
        if (filters.formSlug !== 'all' && submission.formSlug !== filters.formSlug) {
            return false;
        }

        if (filters.temperature !== 'all' && submission.leadTemperature !== filters.temperature) {
            return false;
        }

        if (filters.search.trim()) {
            const search = filters.search.trim().toLowerCase();

            const matchesSearch =
                submission.candidate.fullName.toLowerCase().includes(search) ||
                submission.candidate.email.toLowerCase().includes(search) ||
                submission.candidate.phone.toLowerCase().includes(search) ||
                submission.publicId.toLowerCase().includes(search);

            if (!matchesSearch) {
                return false;
            }
        }

        if (filters.range !== 'all') {
            if (!submission.submittedAt) {
                return false;
            }

            const submittedAt = new Date(submission.submittedAt);

            if (Number.isNaN(submittedAt.getTime())) {
                return false;
            }

            if (filters.range === 'today') {
                const startOfToday = new Date(now);
                startOfToday.setHours(0, 0, 0, 0);

                if (submittedAt < startOfToday) {
                    return false;
                }
            }

            if (filters.range === '7d') {
                const startDate = new Date(now);
                startDate.setDate(startDate.getDate() - 6);
                startDate.setHours(0, 0, 0, 0);

                if (submittedAt < startDate) {
                    return false;
                }
            }

            if (filters.range === '30d') {
                const startDate = new Date(now);
                startDate.setDate(startDate.getDate() - 29);
                startDate.setHours(0, 0, 0, 0);

                if (submittedAt < startDate) {
                    return false;
                }
            }
        }

        return true;
    });

    const status = currentFilters.status ?? 'all';

    const statusFilteredSubmissions =
        status === 'all'
            ? baseFilteredSubmissions
            : baseFilteredSubmissions.filter((submission) => submission.status === status);

    const totalItems = statusFilteredSubmissions.length;
    const totalPages = Math.max(Math.ceil(totalItems / pageSize), 1);
    const currentPage = Math.min(page, totalPages);

    const startIndex = (currentPage - 1) * pageSize;
    const paginatedSubmissions = statusFilteredSubmissions.slice(startIndex, startIndex + pageSize);

    const items = paginatedSubmissions.map((submission) => ({
        publicId: submission.publicId,
        candidate: submission.candidate,
        formSlug: submission.formSlug,
        formName: submission.form.name,
        status: submission.status as SubmissionsListResponse['items'][number]['status'],
        leadScore: submission.leadScore,
        leadTemperature: submission.leadTemperature as SubmissionsListResponse['items'][number]['leadTemperature'],
        source: null,
        utmCampaign: null,
        reminderCount: 0,
        createdAt: submission.submittedAt ?? '',
        submittedAt: submission.submittedAt,
        booking: null
    }));

    const statusCounts = {
        all: baseFilteredSubmissions.length,
        submission_pending: baseFilteredSubmissions.filter((item) => item.status === 'submission_pending').length,
        booking_pending: baseFilteredSubmissions.filter((item) => item.status === 'booking_pending').length,
        booked: baseFilteredSubmissions.filter((item) => item.status === 'booked').length,
        converted: baseFilteredSubmissions.filter((item) => item.status === 'converted').length,
        cancelled: baseFilteredSubmissions.filter((item) => item.status === 'cancelled').length
    };

    return {
        items,
        page: currentPage,
        pageSize,
        totalItems,
        summary: {
            total: baseFilteredSubmissions.length,
            hot: baseFilteredSubmissions.filter((item) => item.leadTemperature === 'hot').length,
            completedForms: baseFilteredSubmissions.filter((item) => item.status !== 'submission_pending').length,
            bookedOrConverted: baseFilteredSubmissions.filter((item) => item.status === 'booked' || item.status === 'converted').length,
            hotNotBooked: baseFilteredSubmissions.filter((item) => item.leadTemperature === 'hot' && item.status === 'booking_pending').length,
            statusCounts
        },
        availableSources: []
    };
}

type GetSubmissionDetailResponse = {
    success: boolean;
    message: string;
    data: {
        publicId: string;
        createdAt: string | null;
        candidate: {
            fullName: string;
            email: string;
            phone: string;
        };
        formSlug: string;
        formName: string;
        status: string;
        leadScore: number | null;
        leadTemperature: string | null;
        submittedAt: string | null;
        steps: {
            stepNo: number;
            title: string;
            answers: {
                questionKey: string;
                questionText: string;
                answerText: string | null;
                optionScore: number | null;
            }[];
        }[];
    };
    error?: Record<string, unknown>;
};

export async function getSubmissionDetailApi(submissionId: string): Promise<SubmissionDetail> {
    if (!submissionId) {
        throw new Error('Submission ID is required');
    }

    const response = await apiClient.get<GetSubmissionDetailResponse>(`/submissions/${submissionId}`);

    const submission = response.data.data;

    const timeline = [
        {
            key: 'started',
            label: 'Form started',
            at: submission.createdAt
        },
        {
            key: 'submitted',
            label: 'Form submitted',
            at: submission.submittedAt
        },
        {
            key: 'reserved',
            label: 'Slot reserved',
            at: null
        },
        {
            key: 'confirmed',
            label: 'Booking confirmed',
            at: submission.status === 'booked' || submission.status === 'converted' ? submission.submittedAt : null
        },
        {
            key: 'call',
            label: 'Counselling call',
            at: null
        }
    ];

    return {
        publicId: submission.publicId,
        candidate: submission.candidate,
        formSlug: submission.formSlug,
        formName: submission.formName,
        status: submission.status as SubmissionDetail['status'],
        leadScore: submission.leadScore,
        leadTemperature: submission.leadTemperature as SubmissionDetail['leadTemperature'],
        source: null,
        utmCampaign: null,
        reminderCount: 0,
        createdAt: submission.createdAt ?? submission.submittedAt ?? '',
        submittedAt: submission.submittedAt,
        booking: null,
        candidateFirstSeenAt: submission.createdAt ?? submission.submittedAt ?? '',
        attribution: {
            source: null,
            medium: null,
            campaign: null,
            content: null,
            term: null,
            landingPage: null,
            referrerUrl: null
        },
        steps: submission.steps,
        scoredQuestionCount: submission.steps.reduce(
            (count, step) => count + step.answers.filter((answer) => answer.optionScore !== null).length,
            0
        ),
        timeline,
        bookingDetails: null,
        notifications: []
    };
}