import { apiClient } from '@/lib/apiClient';
import { FormDetailsValues } from '@/schemas/formBuilderSchema';
import { AddQuestionToFormRequest } from '@/types/request';
import { AddQuestionToFormResponse, CreateQualificationFormResponse } from '@/types/response';

export async function createQualificationFormApi(payload: FormDetailsValues): Promise<CreateQualificationFormResponse> {
    const response = await apiClient.post<CreateQualificationFormResponse>(
        '/admin/forms', 
        payload
    );
    
    return response.data;
}

export async function addQuestionToFormApi(requestData: AddQuestionToFormRequest): Promise<AddQuestionToFormResponse> {
    const response = await apiClient.post<AddQuestionToFormResponse>(
        `/admin/forms/${requestData.formId}/questions`,
        requestData.payload
    );

    return response.data;
}