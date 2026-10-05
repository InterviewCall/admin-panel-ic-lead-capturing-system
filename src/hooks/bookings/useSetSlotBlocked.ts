import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { setSlotBlockedApi } from '@/services/bookingsApi';

export function useSetSlotBlocked() {
    const queryClient = useQueryClient();

    return useMutation<void, Error, { slotStartAt: string; blocked: boolean }>({
        mutationFn: setSlotBlockedApi,

        onSuccess: (_, variables) => {
            toast.success(variables.blocked ? 'Slot blocked' : 'Slot opened');
            queryClient.invalidateQueries({ queryKey: ['bookings-week'] });
        },

        onError: () => {
            toast.error('Could not update the slot. Please try again.');
        },
    });
}
