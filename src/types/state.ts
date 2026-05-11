import { FormQuestion } from './formBuilder';

export type FormBuilderState = {
    createdFormId: number | null;
    createdFormSlug: string | null;
    questions: FormQuestion[];
};