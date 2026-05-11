import { QuestionValues } from '@/schemas/formBuilderSchema';

export type QuestionType =
  | 'text'
  | 'email'
  | 'phone'
  | 'number'
  | 'select'
  | 'radio'
  | 'checkbox'
  | 'textarea';

export type FormQuestionOption = {
  id: string;
  optionLabel: string;
  optionValue: string;
  score?: number;
};

export type FormQuestion = {
  id: string;

  // Step-level fields
  stepNo: number;
  stepTitle: string;
  stepHelperText: string;
  stepIsActive: boolean;

  // Question-level fields
  questionKey: string;
  questionText: string;
  placeholder?: string | null;
  questionType: QuestionType;
  isRequired: boolean;
  sortOrder: number;
  questionIsActive: boolean;

  options: FormQuestionOption[];
};

export type ValidationRules = {
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  min?: number;
  max?: number;
};

export const textValidationQuestionTypes: QuestionType[] = [
  'text',
  'email',
  'phone',
  'textarea',
];

export const numberValidationQuestionTypes: QuestionType[] = ['number'];

export type QualificationFormDraft = {
  name: string;
  slug: string;
  segmentKey: string;
  description?: string;
  version: number;
  isActive: boolean;
  questions: FormQuestion[];
};

export interface AddQuestionToFormPayload extends QuestionValues {
  options?: FormQuestionOption[],
  validationRules?: ValidationRules | null
}