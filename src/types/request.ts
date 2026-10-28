import { AddQuestionToFormPayload } from './formBuilder';
import { Role } from '@/constants/roles';

export type AddQuestionToFormRequest = {
    formId: number;
    payload: AddQuestionToFormPayload;
};

export type CreateUserRequest = {
    name: string;
    email: string;
    phoneNo: string;
    role: Role;
};