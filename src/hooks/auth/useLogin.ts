import { useMutation } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import { toast } from 'sonner';

import { loginApi } from '@/services/authApi';
import type {
    LoginCredentials,
    LoginResponseData,
} from '@/types/auth';
import type { ApiErrorResponse } from '@/types/response';

export function useLogin() {
    return useMutation<
        LoginResponseData,
        AxiosError<ApiErrorResponse>,
        LoginCredentials
    >({
        mutationFn: loginApi,

        onSuccess: (data) => {
            if (
                !data.requiresPasswordReset &&
                data.tokenType === 'access'
            ) {
                toast.success('Login successful.');
            }
        },

        onError: (error) => {
            toast.error(
                error.response?.data?.message ||
                    'Login failed. Please check your email and password.',
            );
        },
    });
}