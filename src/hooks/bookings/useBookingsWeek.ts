import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { getBookingsWeekApi } from '@/services/bookingsApi';

export function useBookingsWeek(weekStart: string) {
    return useQuery({
        queryKey: ['bookings-week', weekStart],
        queryFn: () => getBookingsWeekApi(weekStart),
        placeholderData: keepPreviousData,
    });
}
