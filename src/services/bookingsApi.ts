import { bookingApiClient } from '@/lib/bookingApiClient';
import { cancelMockBooking, setMockSlotBlocked } from '@/mocks/bookingsData';
import { BookingCompletionResponse, BookingsWeekResponse } from '@/types/booking';
import { ApiSuccessResponse } from '@/types/response';

const simulateLatency = (ms = 350) => new Promise((resolve) => setTimeout(resolve, ms));

// GET /admin/bookings/week (B1): bookings, the 7-day slot grid and the summary cards for one week (Monday, IST).
export async function getBookingsWeekApi(weekStart: string): Promise<BookingsWeekResponse> {
    const response = await bookingApiClient.get<ApiSuccessResponse<BookingsWeekResponse>>('/admin/bookings/week', {
        params: { weekStart },
    });

    return response.data.data;
}

// POST /admin/bookings/:bookingId/complete: the admin marks the counselling call as done (only once the call has started).
export async function completeBookingApi(bookingId: string): Promise<BookingCompletionResponse> {
    const response = await bookingApiClient.post<ApiSuccessResponse<BookingCompletionResponse>>(
        `/admin/bookings/${bookingId}/complete`,
    );

    return response.data.data;
}

// DELETE /admin/bookings/:bookingId/complete: takes that back (mis-click), the booking is confirmed again.
export async function undoCompleteBookingApi(bookingId: string): Promise<BookingCompletionResponse> {
    const response = await bookingApiClient.delete<ApiSuccessResponse<BookingCompletionResponse>>(
        `/admin/bookings/${bookingId}/complete`,
    );

    return response.data.data;
}

/**
 * TODO(api): cancel (B2) and block/open slot (B3) are not built yet, so these two still use the dummy data in src/mocks.
 * Nothing in the panel calls them yet. When the endpoints are live, replace each body with the real call and delete src/mocks.
 */
export async function cancelBookingApi(bookingId: string): Promise<void> {
    await simulateLatency(250);
    cancelMockBooking(bookingId);
}

export async function setSlotBlockedApi(payload: { slotStartAt: string; blocked: boolean }): Promise<void> {
    await simulateLatency(150);
    setMockSlotBlocked(payload.slotStartAt, payload.blocked);
}
