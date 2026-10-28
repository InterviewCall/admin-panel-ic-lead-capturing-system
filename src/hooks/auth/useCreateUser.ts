import { useMutation } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import { toast } from 'sonner';

import { createUserApi } from '@/services/userApi';
import type { CreateUserFormValues } from '@/schemas/createUserSchema';
import type { ApiErrorResponse } from '@/types/response';
import type { CreateUserResponseData } from '@/types/user';

export function useCreateUser() {
    return useMutation<
        CreateUserResponseData,
        AxiosError<ApiErrorResponse>,
        CreateUserFormValues
    >({
        mutationFn: createUserApi,

        onSuccess: () => {
            toast.success('User created successfully.');
        },

        onError: (error) => {
            toast.error(
                error.response?.data?.message ||
                    'Failed to create user. Please try again.',
            );
        },
    });
}