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