import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import { getBookingsWeekApi } from '@/services/bookingsApi';
import { BookingsWeekResponse } from '@/types/booking';
import { ApiErrorResponse } from '@/types/response';

export function useBookingsWeek(weekStart: string) {
    return useQuery<BookingsWeekResponse, AxiosError<ApiErrorResponse>>({
        queryKey: ['bookings-week', weekStart],
        queryFn: () => getBookingsWeekApi(weekStart),
        placeholderData: keepPreviousData,
    });
}
