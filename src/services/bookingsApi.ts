import { cancelMockBooking, getMockBookingsWeek, setMockSlotBlocked } from '@/mocks/bookingsData';
import { BookingsWeekResponse } from '@/types/booking';

const simulateLatency = (ms = 350) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * TODO(api): the backend is not ready, so these functions return dummy data from src/mocks.
 * When the endpoints are live, replace each body with the real call and delete src/mocks.
 */
export async function getBookingsWeekApi(weekStart: string): Promise<BookingsWeekResponse> {
    await simulateLatency();
    return getMockBookingsWeek(weekStart);
}

export async function cancelBookingApi(bookingId: string): Promise<void> {
    await simulateLatency(250);
    cancelMockBooking(bookingId);
}

export async function setSlotBlockedApi(payload: { slotStartAt: string; blocked: boolean }): Promise<void> {
    await simulateLatency(150);
    setMockSlotBlocked(payload.slotStartAt, payload.blocked);
}
