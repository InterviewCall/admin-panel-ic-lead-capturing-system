import { useMutation } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import { toast } from 'sonner';

import { resetPasswordApi } from '@/services/authApi';
import type {
    ResetPasswordCredentials,
    ResetPasswordResponseData,
} from '@/types/auth';
import type { ApiErrorResponse } from '@/types/response';

export function useResetPassword() {
    return useMutation<
        ResetPasswordResponseData,
        AxiosError<ApiErrorResponse>,
        ResetPasswordCredentials
    >({
        mutationFn: resetPasswordApi,

        onSuccess: (data) => {
            toast.success(
                data.message || 'Password reset successfully. Please sign in again.',
            );
        },

        onError: (error) => {
            toast.error(
                error.response?.data?.message ||
                    'Could not reset your password. Please sign in again and retry.',
            );
        },
    });
}