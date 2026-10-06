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

export async function getSubmissionsApi(filters: SubmissionFilters): Promise<SubmissionsListResponse> {
    const response = await apiClient.get<GetSubmissionsResponse>('/submissions');

   

const now = new Date();

const submissions = response.data.data.filter((submission) => {
    if (filters.formSlug !== 'all' && submission.formSlug !== filters.formSlug) {
        return false;
    }

    if (
        filters.temperature !== 'all' &&
        submission.leadTemperature !== filters.temperature
    ) {
        return false;
    }

    if (filters.search.trim()) {
        const search = filters.search.trim().toLowerCase();

        const matchesSearch =
            submission.candidate.fullName.toLowerCase().includes(search) ||
            submission.candidate.email.toLowerCase().includes(search) ||
            submission.candidate.phone.toLowerCase().includes(search);

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

            return submittedAt >= startOfToday;
        }

        if (filters.range === '7d') {
            const startDate = new Date(now);
            startDate.setDate(startDate.getDate() - 6);
            startDate.setHours(0, 0, 0, 0);

            return submittedAt >= startDate;
        }

        if (filters.range === '30d') {
            const startDate = new Date(now);
            startDate.setDate(startDate.getDate() - 29);
            startDate.setHours(0, 0, 0, 0);

            return submittedAt >= startDate;
        }
    }

    return true;
});

    const items = submissions.map((submission) => ({
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

    return {
        items,
        page: 1,
        pageSize: items.length,
        totalItems: items.length,
        summary: {
            total: items.length,
            hot: items.filter((item) => item.leadTemperature === 'hot').length,
            completedForms: items.filter((item) => item.status !== 'submission_pending').length,
            bookedOrConverted: items.filter(
                (item) => item.status === 'booked' || item.status === 'converted'
            ).length,
            hotNotBooked: items.filter(
                (item) => item.leadTemperature === 'hot' && item.status === 'booking_pending'
            ).length,
            statusCounts: {
                all: items.length,
                submission_pending: items.filter((item) => item.status === 'submission_pending').length,
                booking_pending: items.filter((item) => item.status === 'booking_pending').length,
                booked: items.filter((item) => item.status === 'booked').length,
                converted: items.filter((item) => item.status === 'converted').length,
                cancelled: items.filter((item) => item.status === 'cancelled').length
            }
        },
        availableSources: []
    };
}

type GetSubmissionDetailResponse = {
    success: boolean;
    message: string;
    data: {
        publicId: string;
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

export async function getSubmissionDetailApi(
    submissionId: string
): Promise<SubmissionDetail> {
    const response = await apiClient.get<GetSubmissionDetailResponse>(
        `/submissions/${submissionId}`
    );

    const submission = response.data.data;

    return {
        publicId: submission.publicId,

        candidate: submission.candidate,

        formSlug: submission.formSlug,
        formName: submission.formName,

        status: submission.status as SubmissionDetail['status'],

        leadScore: submission.leadScore,
        leadTemperature:
            submission.leadTemperature as SubmissionDetail['leadTemperature'],

        source: null,
        utmCampaign: null,
        reminderCount: 0,

        createdAt: submission.submittedAt ?? '',
        submittedAt: submission.submittedAt,

        booking: null,

        candidateFirstSeenAt: submission.submittedAt ?? '',

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
            (count, step) =>
                count +
                step.answers.filter(
                    (answer) => answer.optionScore !== null
                ).length,
            0
        ),

        timeline: [],

        bookingDetails: null,

        notifications: []
    };
}