export type CreateQualificationFormResponse = {
    success: boolean
    message: string
    data: {
        formId: number,
        slug: string
    };
    error?: Record<string, unknown>;
}

export type ApiErrorResponse = {
    success?: boolean;
    message?: string;
    error?: unknown;
    errors?: unknown;
};

export type AddQuestionToFormResponse = {
    success: boolean;
    message: string;
    data: {
        formId: number;
        questionId: number;
    };
    error?: Record<string, unknown>;
};

// Envelope every candidate-form-details-service endpoint returns on success.
export type ApiSuccessResponse<T> = {
    success: boolean;
    message: string;
    data: T;
    error: unknown;
};
