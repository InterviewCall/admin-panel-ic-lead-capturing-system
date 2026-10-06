import { apiClient, slotBookingApiClient } from '@/lib/apiClient';
import { cancelMockBooking, setMockSlotBlocked } from '@/mocks/bookingsData';
import type {
    BookingListItem,
    BookingsWeekResponse,
    SlotStatus,
    WeekDay,
    WeekSlot,
} from '@/types/booking';
import { addDaysToYmd, toYmd } from '@/utils/helpers/dateFormat';

type BookingApiItem = {
    bookingId: string;
    dateTimeSlotId: number;
    candidateId: number;
    submissionId: string;
    bookingStatus: 'confirmed' | 'initiated' | 'cancelled';
    slotStartAt: string;
    slotStatus: 'available' | 'booked' | 'reserved' | 'blocked';
    candidate: {
        fullName: string;
        email: string;
        phone: string;
    } | null;
    formName: string | null;
    leadScore: number | null;
    leadTemperature: string | null;
};

type BookingApiResponse = {
    success: boolean;
    message: string;
    data: BookingApiItem[];
    error: Record<string, unknown>;
};

type SubmissionAnswer = {
    questionKey: string;
    answerText: string | null;
};

type SubmissionStep = {
    answers: SubmissionAnswer[];
};

type SubmissionDetailsApiResponse = {
    success: boolean;
    message: string;
    data: {
        formName: string | null;
        steps: SubmissionStep[];
    };
    error: Record<string, unknown>;
};

const istTimeFormatter = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Kolkata',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
});

const getTimeKey = (iso: string): string => istTimeFormatter.format(new Date(iso));

const createSlotStartAt = (date: string, time: string): string =>
    new Date(`${date}T${time}:00+05:30`).toISOString();

const getSyntheticSlotId = (slotStartAt: string): number =>
    -Math.floor(new Date(slotStartAt).getTime() / 60000);

const getSlotStatus = (items: BookingApiItem[]): SlotStatus => {
    if (items.some((item) => item.bookingStatus === 'confirmed')) return 'booked';
    if (items.some((item) => item.bookingStatus === 'initiated')) return 'reserved';
    if (items.some((item) => item.slotStatus === 'blocked')) return 'blocked';
    if (items.some((item) => item.slotStatus === 'booked')) return 'booked';
    if (items.some((item) => item.slotStatus === 'reserved')) return 'reserved';

    return 'available';
};

const fetchSubmissionDetails = async (
    submissionId: string,
): Promise<SubmissionDetailsApiResponse['data'] | null> => {
    try {
        const response = await apiClient.get<SubmissionDetailsApiResponse>(
            `/submissions/${submissionId}`,
        );

        return response.data.data;
    } catch {
        return null;
    }
};

const getSubmissionAnswer = (
    submission: SubmissionDetailsApiResponse['data'] | null,
    questionKey: string,
): string | null => {
    if (!submission) return null;

    const answer = submission.steps
        .flatMap((step) => step.answers)
        .find((item) => item.questionKey === questionKey);

    return answer?.answerText ?? null;
};

export async function getBookingsWeekApi(
    weekStart: string,
): Promise<BookingsWeekResponse> {
    const response = await slotBookingApiClient.get<BookingApiResponse>('/bookings');
    const weekEnd = addDaysToYmd(weekStart, 7);

    const weekBookings = (response.data.data ?? [])
        .filter((booking) => {
            const bookingDate = toYmd(booking.slotStartAt);
            return bookingDate >= weekStart && bookingDate < weekEnd;
        })
        .sort((a, b) => a.slotStartAt.localeCompare(b.slotStartAt));

    const submissionIds = [
        ...new Set(weekBookings.map((booking) => booking.submissionId)),
    ];

    const submissionEntries = await Promise.all(
        submissionIds.map(async (submissionId) => {
            const details = await fetchSubmissionDetails(submissionId);
            return [submissionId, details] as const;
        }),
    );

    const submissionDetailsMap = new Map(submissionEntries);

    const bookings: BookingListItem[] = weekBookings.map((booking) => {
        const submission = submissionDetailsMap.get(booking.submissionId) ?? null;

        return {
            bookingId: booking.bookingId,
            slotStartAt: booking.slotStartAt,
            status: booking.bookingStatus,
            submissionId: booking.submissionId,

            formName: submission?.formName ?? booking.formName ?? '—',

            candidate: {
                fullName: booking.candidate?.fullName ?? '—',
                email: booking.candidate?.email ?? '—',
                phone: booking.candidate?.phone ?? '—',
            },

            leadScore: booking.leadScore,

            leadTemperature:
                booking.leadTemperature as BookingListItem['leadTemperature'],

            notifications: [],

            callPrep: {
                experience: getSubmissionAnswer(submission, 'yoe'),
                currentCtc: getSubmissionAnswer(submission, 'currentCtc'),
                mainGap: getSubmissionAnswer(submission, 'mainGap'),
                urgency: getSubmissionAnswer(submission, 'urgency'),
            },
        };
    });

    const bookingsBySlot = new Map<string, BookingApiItem[]>();

    weekBookings.forEach((booking) => {
        const key = `${toYmd(booking.slotStartAt)}|${getTimeKey(booking.slotStartAt)}`;
        const existing = bookingsBySlot.get(key) ?? [];

        existing.push(booking);
        bookingsBySlot.set(key, existing);
    });

    const slotTimes = [
        ...new Set(weekBookings.map((booking) => getTimeKey(booking.slotStartAt))),
    ].sort();

    const days: WeekDay[] = Array.from({ length: 7 }, (_, dayIndex) => {
        const date = addDaysToYmd(weekStart, dayIndex);

        const slots: WeekSlot[] = slotTimes.map((time) => {
            const key = `${date}|${time}`;
            const slotBookings = bookingsBySlot.get(key) ?? [];
            const slotStartAt = createSlotStartAt(date, time);

            return {
                slotId:
                    slotBookings[0]?.dateTimeSlotId ??
                    getSyntheticSlotId(slotStartAt),
                slotStartAt: slotBookings[0]?.slotStartAt ?? slotStartAt,
                status: getSlotStatus(slotBookings),
            };
        });

        return { date, slots };
    });

    const confirmed = weekBookings.filter(
        (booking) => booking.bookingStatus === 'confirmed',
    );

    const held = weekBookings.filter(
        (booking) => booking.bookingStatus === 'initiated',
    );

    const cancelled = weekBookings.filter(
        (booking) => booking.bookingStatus === 'cancelled',
    );

    const now = Date.now();

    const upcoming = confirmed
        .filter((booking) => new Date(booking.slotStartAt).getTime() > now)
        .sort((a, b) => a.slotStartAt.localeCompare(b.slotStartAt));

    const upcomingSlots = days
        .flatMap((day) => day.slots)
        .filter((slot) => new Date(slot.slotStartAt).getTime() > now);

    const usedSlots = upcomingSlots.filter(
        (slot) => slot.status === 'booked' || slot.status === 'reserved',
    ).length;

    const usableSlots = upcomingSlots.filter(
        (slot) => slot.status !== 'blocked',
    ).length;

    return {
        weekStart,
        bookings,
        days,
        summary: {
            callsToday: confirmed.filter(
                (booking) => toYmd(booking.slotStartAt) === toYmd(Date.now()),
            ).length,

            confirmedThisWeek: confirmed.length,
            heldThisWeek: held.length,
            cancelledThisWeek: cancelled.length,

            capacityUsedPercent:
                usableSlots === 0
                    ? 0
                    : Math.round((usedSlots / usableSlots) * 100),

            failedMessages: 0,
            nextCallAt: upcoming[0]?.slotStartAt ?? null,
        },
    };
}

export async function cancelBookingApi(bookingId: string): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 250));
    cancelMockBooking(bookingId);
}

export async function setSlotBlockedApi(payload: {
    slotStartAt: string;
    blocked: boolean;
}): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 150));
    setMockSlotBlocked(payload.slotStartAt, payload.blocked);
}