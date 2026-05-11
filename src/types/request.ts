import { AddQuestionToFormPayload } from './formBuilder';

export type AddQuestionToFormRequest = {
    formId: number;
    payload: AddQuestionToFormPayload;
};