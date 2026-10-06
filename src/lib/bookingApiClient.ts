import axios from 'axios';

// The slot-booking-service: bookings, slots and the week view. (apiClient talks to the candidate form service.)
export const bookingApiClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_SLOT_BOOKING_SERVICE_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    }
});
