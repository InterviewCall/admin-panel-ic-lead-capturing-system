import { QuestionType } from '@/types/formBuilder';

export const questionTypes: {
  label: string;
  value: QuestionType;
}[] = [
  { label: 'Text', value: 'text' },
  { label: 'Email', value: 'email' },
  { label: 'Phone', value: 'phone' },
  { label: 'Number', value: 'number' },
  { label: 'Select', value: 'select' },
  { label: 'Radio', value: 'radio' },
  { label: 'Checkbox', value: 'checkbox' },
  { label: 'Textarea', value: 'textarea' },
];

export const questionTypeNeedsOptions: QuestionType[] = [
  'select',
  'radio',
  'checkbox',
];

export const formSteps = [2, 3, 4, 5, 6, 7, 8];