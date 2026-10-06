import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { toast } from 'sonner';

import { completeBookingApi, undoCompleteBookingApi } from '@/services/bookingsApi';
import { BookingCompletionResponse } from '@/types/booking';
import { ApiErrorResponse } from '@/types/response';

// Marking (or un-marking) a call changes the Bookings page, the submissions list and the submission detail timeline.
function useRefreshAfterCompletion() {
    const queryClient = useQueryClient();

    return () => {
        queryClient.invalidateQueries({ queryKey: ['bookings-week'] });
        queryClient.invalidateQueries({ queryKey: ['submissions'] });
        queryClient.invalidateQueries({ queryKey: ['submission'] });
    };
}

// The booking service explains refusals itself (e.g. "This call has not started yet..."), so show its message.
function errorMessage(error: AxiosError<ApiErrorResponse>, fallback: string): string {
    return error.response?.data?.message || fallback;
}

export function useCompleteBooking() {
    const refresh = useRefreshAfterCompletion();

    return useMutation<BookingCompletionResponse, AxiosError<ApiErrorResponse>, string>({
        mutationFn: completeBookingApi,

        onSuccess: () => {
            toast.success('Call marked as done');
            refresh();
        },

        onError: (error) => {
            toast.error(errorMessage(error, 'Could not mark the call as done. Please try again.'));
            // A 409 means the booking changed under us (cancelled, already reopened...): show the real state.
            refresh();
        },
    });
}

export function useUndoCompleteBooking() {
    const refresh = useRefreshAfterCompletion();

    return useMutation<BookingCompletionResponse, AxiosError<ApiErrorResponse>, string>({
        mutationFn: undoCompleteBookingApi,

        onSuccess: () => {
            toast.success('Call reopened');
            refresh();
        },

        onError: (error) => {
            toast.error(errorMessage(error, 'Could not reopen the call. Please try again.'));
            refresh();
        },
    });
}
