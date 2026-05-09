import { z } from 'zod';

export const formDetailsSchema = z.object({
  name: z.string().min(3, 'Form name is required.'),
  slug: z
    .string()
    .min(3, 'Slug is required.')
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      'Slug should use lowercase letters, numbers, and hyphens only.',
    ),
  segmentKey: z
    .string()
    .min(2, 'Segment key is required.')
    .regex(
      /^[a-z0-9_]+$/,
      'Segment key should use lowercase letters, numbers, and underscores only.',
    ),
  description: z.string().optional(),
  version: z.number().min(1, 'Version must be at least 1.'),
  isActive: z.boolean(),
});

export const questionSchema = z.object({
  stepNo: z.number().min(2).max(8),
  questionKey: z
    .string()
    .min(2, 'Question key is required.')
    .regex(
      /^[a-zA-Z][a-zA-Z0-9_]*$/,
      'Use camelCase or snake_case. It must start with a letter.',
    ),
  questionText: z.string().min(5, 'Question text is required.'),
  helperText: z.string().optional(),
  questionType: z.enum([
    'text',
    'email',
    'phone',
    'number',
    'select',
    'radio',
    'checkbox',
    'textarea',
  ]),
  isRequired: z.boolean(),
  sortOrder: z.number().min(1, 'Sort order must be at least 1.'),
});

export type FormDetailsValues = z.infer<typeof formDetailsSchema>;
export type QuestionValues = z.infer<typeof questionSchema>;