import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { toast } from 'sonner';

import { FormDetailsValues } from '@/schemas/formBuilderSchema';
import { createQualificationFormApi } from '@/services/qualificationFormBuilderApi';
import { ApiErrorResponse, CreateQualificationFormResponse } from '@/types/response';

export function useCreateQualificationForm() {
    return useMutation<CreateQualificationFormResponse, AxiosError<ApiErrorResponse>, FormDetailsValues>({
        mutationFn: createQualificationFormApi,

        onSuccess: (response) => {
            toast.success(response.message);
        },

        onError: (error) => {
            toast.error(error.response?.data?.message || 'Failed to save form details. Please try again.');
        }
    });
}