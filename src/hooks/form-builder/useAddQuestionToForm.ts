import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { toast } from 'sonner';

import { addQuestionToFormApi } from '@/services/qualificationFormBuilderApi';
import { AddQuestionToFormRequest } from '@/types/request';
import { AddQuestionToFormResponse, ApiErrorResponse } from '@/types/response';

export function useAddQuestionToForm() {
    return useMutation<AddQuestionToFormResponse, AxiosError<ApiErrorResponse>, AddQuestionToFormRequest>({
        mutationFn: addQuestionToFormApi,

        onSuccess: (response) => {
            toast.success(response.message);
        },

        onError: (error) => {
            toast.error(error.response?.data?.message || 'Failed to save form details. Please try again.');
        }
    });
}