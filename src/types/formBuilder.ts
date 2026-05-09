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
  stepNo: number;
  questionKey: string;
  questionText: string;
  helperText?: string;
  questionType: QuestionType;
  isRequired: boolean;
  sortOrder: number;
  options: FormQuestionOption[];
};

export type QualificationFormDraft = {
  name: string;
  slug: string;
  segmentKey: string;
  description?: string;
  version: number;
  isActive: boolean;
  questions: FormQuestion[];
};