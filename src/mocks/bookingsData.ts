import {
    bookingIdFor,
    getMockAnswerByKey,
    getMockNotifications,
    getMockSeeds,
} from '@/mocks/submissionsData';
import type { BookingListItem, BookingsWeekResponse, SlotStatus, WeekDay, WeekSlot } from '@/types/booking';
import { addDaysToYmd, toYmd } from '@/utils/helpers/dateFormat';

// Dummy data for the Bookings screen. Delete this folder once the real APIs are connected.

export const SLOT_HOURS = [10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];

// Changes made from the UI while the APIs are not connected. They live until the page is reloaded.
const cancelledBookingIds = new Set<string>();
const forcedBlockedSlots = new Set<string>();
const forcedOpenSlots = new Set<string>();

export function cancelMockBooking(bookingId: string): void {
    cancelledBookingIds.add(bookingId);
}

export function setMockSlotBlocked(slotStartAt: string, blocked: boolean): void {
    if (blocked) {
        forcedOpenSlots.delete(slotStartAt);
        forcedBlockedSlots.add(slotStartAt);
    } else {
        forcedBlockedSlots.delete(slotStartAt);
        forcedOpenSlots.add(slotStartAt);
    }
}

function isDefaultBlocked(ymd: string, hour: number): boolean {
    const dayOfWeek = new Date(`${ymd}T12:00:00+05:30`).getUTCDay(); // 0 = Sunday

    if (dayOfWeek === 0) return true;
    if (dayOfWeek === 6 && hour < 12) return true;
    if (dayOfWeek === 4 && (hour === 17 || hour === 18)) return true;
    return false;
}

function getAllMockBookings(): BookingListItem[] {
    return getMockSeeds()
        .filter(({ item }) => item.booking !== null)
        .map(({ n, item }) => {
            const bookingId = bookingIdFor(n);
            const booking = item.booking!;

            return {
                bookingId,
                slotStartAt: booking.slotStartAt,
                status: cancelledBookingIds.has(bookingId) ? 'cancelled' : booking.status,
                completedAt: booking.status === 'completed' ? booking.slotStartAt : null,
                submissionId: item.publicId,
                formName: item.formName,
                candidate: item.candidate,
                leadScore: item.leadScore,
                leadTemperature: item.leadTemperature,
                notifications: getMockNotifications(n).filter((entry) => entry.notificationType === 'BOOKING_CONFIRMED'),
                callPrep: {
                    experience: getMockAnswerByKey(item.publicId, 'yoe'),
                    currentCtc: getMockAnswerByKey(item.publicId, 'currentCtc'),
                    mainGap: getMockAnswerByKey(item.publicId, 'mainGap'),
                    urgency: getMockAnswerByKey(item.publicId, 'urgency'),
                },
            } satisfies BookingListItem;
        })
        .sort((a, b) => a.slotStartAt.localeCompare(b.slotStartAt));
}

export function getMockBookingsWeek(weekStart: string): BookingsWeekResponse {
    const weekEnd = addDaysToYmd(weekStart, 7);
    const weekBookings = getAllMockBookings().filter((booking) => {
        const day = toYmd(booking.slotStartAt);
        return day >= weekStart && day < weekEnd;
    });

    const bookingBySlot = new Map(weekBookings.map((booking) => [new Date(booking.slotStartAt).getTime(), booking]));
    const now = Date.now();

    const days: WeekDay[] = Array.from({ length: 7 }, (_, dayIndex) => {
        const date = addDaysToYmd(weekStart, dayIndex);

        const slots: WeekSlot[] = SLOT_HOURS.map((hour, hourIndex) => {
            const slotStartAt = new Date(`${date}T${String(hour).padStart(2, '0')}:00:00+05:30`).toISOString();
            const booking = bookingBySlot.get(new Date(slotStartAt).getTime());

            let status: SlotStatus = 'available';
            if (booking && (booking.status === 'confirmed' || booking.status === 'completed')) status = 'booked';
            else if (booking && booking.status === 'initiated') status = 'reserved';
            else if (forcedBlockedSlots.has(slotStartAt)) status = 'blocked';
            else if (isDefaultBlocked(date, hour) && !forcedOpenSlots.has(slotStartAt)) status = 'blocked';

            return { slotId: dayIndex * SLOT_HOURS.length + hourIndex + 1, slotStartAt, status };
        });

        return { date, slots };
    });

    const upcomingSlots = days.flatMap((day) => day.slots).filter((slot) => new Date(slot.slotStartAt).getTime() > now);
    const used = upcomingSlots.filter((slot) => slot.status === 'booked' || slot.status === 'reserved').length;
    const usable = used + upcomingSlots.filter((slot) => slot.status === 'available').length;
    const today = toYmd(now);

    const completed = weekBookings.filter((booking) => booking.status === 'completed');
    const confirmed = weekBookings.filter((booking) => booking.status === 'confirmed' || booking.status === 'completed');
    const nextCall = confirmed.find((booking) => new Date(booking.slotStartAt).getTime() > now);

    return {
        weekStart,
        bookings: weekBookings,
        days,
        summary: {
            callsToday: confirmed.filter((booking) => toYmd(booking.slotStartAt) === today).length,
            confirmedThisWeek: confirmed.length,
            completedThisWeek: completed.length,
            callsToMark: weekBookings.filter((booking) => booking.status === 'confirmed' && new Date(booking.slotStartAt).getTime() <= now).length,
            heldThisWeek: weekBookings.filter((booking) => booking.status === 'initiated').length,
            cancelledThisWeek: weekBookings.filter((booking) => booking.status === 'cancelled').length,
            capacityUsedPercent: usable === 0 ? 0 : Math.round((used / usable) * 100),
            failedMessages: weekBookings.filter(
                (booking) =>
                    booking.status !== 'cancelled' && booking.notifications.some((entry) => entry.sendStatus === 'FAILED'),
            ).length,
            nextCallAt: nextCall ? nextCall.slotStartAt : null,
        },
    };
}
