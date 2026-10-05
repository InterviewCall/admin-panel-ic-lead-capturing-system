import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { cancelBookingApi } from '@/services/bookingsApi';

export function useCancelBooking() {
    const queryClient = useQueryClient();

    return useMutation<void, Error, string>({
        mutationFn: cancelBookingApi,

        onSuccess: () => {
            toast.success('Booking cancelled');
            queryClient.invalidateQueries({ queryKey: ['bookings-week'] });
            queryClient.invalidateQueries({ queryKey: ['submissions'] });
        },

        onError: () => {
            toast.error('Could not cancel the booking. Please try again.');
        },
    });
}
