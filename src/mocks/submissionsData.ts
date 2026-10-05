import { FORM_OPTIONS, HOT_SCORE_THRESHOLD, WARM_SCORE_THRESHOLD } from '@/constants/adminStatus';
import { FORM_STEP_TEMPLATES, QUESTION_BANK } from '@/mocks/formTemplates';
import type { BookingStatus, NotificationItem } from '@/types/booking';
import type {
    LeadTemperature,
    SubmissionAnswer,
    SubmissionDetail,
    SubmissionListItem,
    SubmissionStatus,
    SubmissionStep,
    TimelineEvent,
} from '@/types/submission';
import { istToIso, minutesAgoIso } from '@/utils/helpers/dateFormat';

// Dummy data for the admin screens. Delete this folder once the real APIs are connected.

type Seed = {
    n: number;
    name: string;
    email: string;
    phone: string;
    formSlug: string;
    score: number | null;
    status: SubmissionStatus;
    submittedAt: string | null;
    startedAt: string;
    slot: { dayOffset: number; hour: number; status: BookingStatus } | null;
    source: string;
    medium: string;
    campaign: string;
    reminderCount: number;
    whatsappFailed?: boolean;
};

const FORM_NAME_BY_SLUG: Record<string, string> = Object.fromEntries(FORM_OPTIONS.map((form) => [form.slug, form.name]));

const SEEDS: Seed[] = [
    { n: 1002, name: 'Sneha Iyer', email: 'sneha.iyer@example.com', phone: '+91 90000 10002', formSlug: 'salary-stagnation', score: 88, status: 'booked', startedAt: minutesAgoIso(66), submittedAt: minutesAgoIso(60), slot: { dayOffset: 0, hour: 16, status: 'confirmed' }, source: 'email', medium: 'email', campaign: 'oct-email-1', reminderCount: 0 },
    { n: 1011, name: 'Divya Menon', email: 'divya.menon@example.com', phone: '+91 90000 10011', formSlug: 'ai-fear', score: 83, status: 'booking_pending', startedAt: minutesAgoIso(45), submittedAt: minutesAgoIso(38), slot: null, source: 'whatsapp', medium: 'whatsapp', campaign: 'oct-wa-1', reminderCount: 1 },
    { n: 1003, name: 'Aditya Verma', email: 'aditya.verma@example.com', phone: '+91 90000 10003', formSlug: 'job-switch', score: 64, status: 'booked', startedAt: minutesAgoIso(128), submittedAt: minutesAgoIso(120), slot: { dayOffset: 0, hour: 18, status: 'confirmed' }, source: 'email', medium: 'email', campaign: 'oct-email-1', reminderCount: 0, whatsappFailed: true },
    { n: 1007, name: 'Priya Nair', email: 'priya.nair@example.com', phone: '+91 90000 10007', formSlug: 'ai-fear', score: 58, status: 'booking_pending', startedAt: minutesAgoIso(20), submittedAt: minutesAgoIso(12), slot: { dayOffset: 0, hour: 19, status: 'initiated' }, source: 'email', medium: 'email', campaign: 'oct-email-2', reminderCount: 0 },
    { n: 1013, name: 'Isha Gupta', email: 'isha.gupta@example.com', phone: '+91 90000 10013', formSlug: 'job-switch', score: null, status: 'submission_pending', startedAt: minutesAgoIso(5), submittedAt: null, slot: null, source: 'youtube', medium: 'video', campaign: 'yt-description', reminderCount: 0 },
    { n: 1004, name: 'Karthik Reddy', email: 'karthik.reddy@example.com', phone: '+91 90000 10004', formSlug: 'job-switch', score: 79, status: 'booked', startedAt: minutesAgoIso(250), submittedAt: minutesAgoIso(240), slot: { dayOffset: 1, hour: 11, status: 'confirmed' }, source: 'email', medium: 'email', campaign: 'oct-email-1', reminderCount: 0 },
    { n: 1010, name: 'Neha Kulkarni', email: 'neha.kulkarni@example.com', phone: '+91 90000 10010', formSlug: 'salary-stagnation', score: 69, status: 'booking_pending', startedAt: minutesAgoIso(312), submittedAt: minutesAgoIso(300), slot: null, source: 'whatsapp', medium: 'whatsapp', campaign: 'oct-wa-1', reminderCount: 1 },
    { n: 1005, name: 'Ananya Das', email: 'ananya.das@example.com', phone: '+91 90000 10005', formSlug: 'salary-stagnation', score: 31, status: 'booked', startedAt: minutesAgoIso(340), submittedAt: minutesAgoIso(330), slot: { dayOffset: 1, hour: 13, status: 'confirmed' }, source: 'email', medium: 'email', campaign: 'oct-email-2', reminderCount: 0 },
    { n: 1006, name: 'Vikram Singh', email: 'vikram.singh@example.com', phone: '+91 90000 10006', formSlug: 'job-switch', score: 71, status: 'booked', startedAt: istToIso(-1, 20, 58), submittedAt: istToIso(-1, 21, 5), slot: { dayOffset: 1, hour: 17, status: 'confirmed' }, source: 'youtube', medium: 'video', campaign: 'yt-description', reminderCount: 0 },
    { n: 1009, name: 'Rahul Chatterjee', email: 'rahul.c@example.com', phone: '+91 90000 10009', formSlug: 'job-switch', score: 47, status: 'booking_pending', startedAt: istToIso(-1, 18, 22), submittedAt: istToIso(-1, 18, 30), slot: null, source: 'email', medium: 'email', campaign: 'oct-email-1', reminderCount: 2 },
    { n: 1008, name: 'Meera Joshi', email: 'meera.joshi@example.com', phone: '+91 90000 10008', formSlug: 'ai-fear', score: 91, status: 'booked', startedAt: istToIso(-1, 16, 5), submittedAt: istToIso(-1, 16, 12), slot: { dayOffset: 2, hour: 12, status: 'confirmed' }, source: 'whatsapp', medium: 'whatsapp', campaign: 'oct-wa-1', reminderCount: 0 },
    { n: 1012, name: 'Sandeep Yadav', email: 'sandeep.yadav@example.com', phone: '+91 90000 10012', formSlug: 'salary-stagnation', score: null, status: 'submission_pending', startedAt: istToIso(-2, 11, 40), submittedAt: null, slot: null, source: 'email', medium: 'email', campaign: 'oct-email-1', reminderCount: 0 },
    { n: 1014, name: 'Arjun Banerjee', email: 'arjun.b@example.com', phone: '+91 90000 10014', formSlug: 'salary-stagnation', score: 55, status: 'cancelled', startedAt: istToIso(-2, 20, 2), submittedAt: istToIso(-2, 20, 10), slot: { dayOffset: 2, hour: 15, status: 'cancelled' }, source: 'email', medium: 'email', campaign: 'oct-email-1', reminderCount: 0 },
    { n: 1001, name: 'Rohan Mehta', email: 'rohan.mehta@example.com', phone: '+91 90000 10001', formSlug: 'job-switch', score: 82, status: 'converted', startedAt: istToIso(-3, 18, 50), submittedAt: istToIso(-3, 19, 0), slot: { dayOffset: -1, hour: 17, status: 'confirmed' }, source: 'email', medium: 'email', campaign: 'sept-email-3', reminderCount: 0 },
];

const publicIdFor = (n: number): string => `00000000-0000-4000-8000-${String(n).padStart(12, '0')}`;

export const bookingIdFor = (n: number): string => String(n + 20);

export function getTemperature(score: number | null): LeadTemperature | null {
    if (score === null) return null;
    if (score >= HOT_SCORE_THRESHOLD) return 'hot';
    if (score >= WARM_SCORE_THRESHOLD) return 'warm';
    return 'cold';
}

function buildNotifications(seed: Seed): NotificationItem[] {
    const items: NotificationItem[] = [];
    const hasConfirmedBooking = seed.slot !== null && seed.slot.status !== 'initiated';

    if (hasConfirmedBooking) {
        items.push({ id: `${seed.n}-c-e`, notificationType: 'BOOKING_CONFIRMED', reminderNumber: 0, channel: 'EMAIL', sendStatus: 'SENT', failedReason: null });
        items.push({
            id: `${seed.n}-c-w`,
            notificationType: 'BOOKING_CONFIRMED',
            reminderNumber: 0,
            channel: 'WHATSAPP',
            sendStatus: seed.whatsappFailed ? 'FAILED' : 'SENT',
            failedReason: seed.whatsappFailed ? 'Number is not reachable on WhatsApp' : null,
        });
    }

    for (let reminder = 1; reminder <= seed.reminderCount; reminder += 1) {
        items.push({ id: `${seed.n}-r${reminder}-e`, notificationType: 'BOOKING_REMINDER', reminderNumber: reminder, channel: 'EMAIL', sendStatus: 'SENT', failedReason: null });
        items.push({ id: `${seed.n}-r${reminder}-w`, notificationType: 'BOOKING_REMINDER', reminderNumber: reminder, channel: 'WHATSAPP', sendStatus: 'SENT', failedReason: null });
    }

    return items;
}

function buildSteps(seed: Seed): { steps: SubmissionStep[]; scoredQuestionCount: number } {
    if (seed.score === null) {
        return { steps: [], scoredQuestionCount: 0 };
    }

    const templates = FORM_STEP_TEMPLATES[seed.formSlug];
    const scoredKeys = templates.flatMap((step) => step.keys).filter((key) => key !== 'notes');
    const base = Math.floor(seed.score / scoredKeys.length);
    const extra = seed.score - base * scoredKeys.length;
    const pointsByKey = new Map(scoredKeys.map((key, index) => [key, base + (index < extra ? 1 : 0)]));

    const steps = templates.map<SubmissionStep>((step) => ({
        stepNo: step.stepNo,
        title: step.title,
        answers: step.keys.map<SubmissionAnswer>((key) => {
            const question = QUESTION_BANK[key];
            const points = pointsByKey.get(key);

            if (points === undefined) {
                return { questionKey: key, questionText: question.text, answerText: null, optionScore: null };
            }

            const ratio = points / 15;
            const tier = ratio >= 0.7 ? 2 : ratio >= 0.4 ? 1 : 0;

            return { questionKey: key, questionText: question.text, answerText: question.options[tier], optionScore: points };
        }),
    }));

    return { steps, scoredQuestionCount: scoredKeys.length };
}

function toListItem(seed: Seed): SubmissionListItem {
    return {
        publicId: publicIdFor(seed.n),
        candidate: { fullName: seed.name, email: seed.email, phone: seed.phone },
        formSlug: seed.formSlug,
        formName: FORM_NAME_BY_SLUG[seed.formSlug],
        status: seed.status,
        leadScore: seed.score,
        leadTemperature: getTemperature(seed.score),
        source: seed.source,
        utmCampaign: seed.campaign,
        reminderCount: seed.reminderCount,
        createdAt: seed.startedAt,
        submittedAt: seed.submittedAt,
        booking: seed.slot
            ? { slotStartAt: istToIso(seed.slot.dayOffset, seed.slot.hour), status: seed.slot.status }
            : null,
    };
}

export function getMockSubmissionList(): SubmissionListItem[] {
    return SEEDS.map(toListItem);
}

function addMinutes(iso: string, minutes: number): string {
    return new Date(new Date(iso).getTime() + minutes * 60000).toISOString();
}

function buildTimeline(seed: Seed, item: SubmissionListItem): TimelineEvent[] {
    const submittedAt = item.submittedAt;
    const hasBooking = item.booking !== null;
    const isConfirmed = hasBooking && item.booking?.status !== 'initiated';

    const events: TimelineEvent[] = [
        { key: 'started', label: 'Form started', at: item.createdAt },
        { key: 'submitted', label: 'Form submitted', at: submittedAt },
        { key: 'reserved', label: 'Slot reserved', at: submittedAt && hasBooking ? addMinutes(submittedAt, 1) : null },
        { key: 'confirmed', label: 'Booking confirmed', at: submittedAt && isConfirmed ? addMinutes(submittedAt, 2) : null },
    ];

    if (item.booking?.status === 'cancelled') {
        events.push({ key: 'cancelled', label: 'Booking cancelled', at: addMinutes(item.booking.slotStartAt, -24 * 60) });
    } else {
        events.push({ key: 'call', label: 'Counselling call', at: item.booking && isConfirmed ? item.booking.slotStartAt : null });
    }

    return events.map((event) => (seed.status === 'submission_pending' && event.key !== 'started' ? { ...event, at: null } : event));
}

export function getMockSubmissionDetail(publicId: string): SubmissionDetail | null {
    const seed = SEEDS.find((entry) => publicIdFor(entry.n) === publicId);
    if (!seed) return null;

    const item = toListItem(seed);
    const { steps, scoredQuestionCount } = buildSteps(seed);

    return {
        ...item,
        candidateFirstSeenAt: item.createdAt,
        attribution: {
            source: seed.source,
            medium: seed.medium,
            campaign: seed.campaign,
            content: 'cta-top',
            term: null,
            landingPage: `/${seed.formSlug}`,
            referrerUrl: seed.source === 'youtube' ? 'https://www.youtube.com/' : null,
        },
        steps,
        scoredQuestionCount,
        timeline: buildTimeline(seed, item),
        bookingDetails: item.booking
            ? { bookingId: bookingIdFor(seed.n), slotStartAt: item.booking.slotStartAt, status: item.booking.status }
            : null,
        notifications: buildNotifications(seed),
    };
}

export function getMockNotifications(n: number): NotificationItem[] {
    const seed = SEEDS.find((entry) => entry.n === n);
    return seed ? buildNotifications(seed) : [];
}

export function getMockSeeds(): { n: number; item: SubmissionListItem }[] {
    return SEEDS.map((seed) => ({ n: seed.n, item: toListItem(seed) }));
}

export function getMockAnswerByKey(publicId: string, key: string): string | null {
    const detail = getMockSubmissionDetail(publicId);
    const answers = detail?.steps.flatMap((step) => step.answers) ?? [];
    return answers.find((answer) => answer.questionKey === key)?.answerText ?? null;
}
