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

  title: z.string().trim().max(3000, 'title is too long'),
  subTitle: z.string().trim().max(3000, 'subTitle is too long'),
  description: z.string().optional(),
  version: z.number().min(1, 'Version must be at least 1.'),
  isActive: z.boolean(),
});

export const questionSchema = z
  .object({
    stepNo: z
      .number()
      .int('Step number must be an integer.')
      .min(2, 'Step number must be at least 2.')
      .max(8, 'Step number cannot be greater than 8.'),

    stepTitle: z
      .string()
      .trim()
      .min(5, 'Step title is required.')
      .max(1000, 'Step title is too long.'),

    stepHelperText: z
      .string()
      .trim()
      .min(3, 'Step helper text is required.')
      .max(1000, 'Step helper text is too long.'),

    stepIsActive: z.boolean(),

    questionKey: z
      .string()
      .trim()
      .min(2, 'Question key is required.')
      .max(100, 'Question key cannot exceed 100 characters.')
      .regex(
        /^[a-zA-Z][a-zA-Z0-9_]*$/,
        'Use camelCase or snake_case. It must start with a letter.',
      ),

    questionText: z
      .string()
      .trim()
      .min(2, 'Question text is required.')
      .max(1000, 'Question text is too long.'),

    placeholder: z
      .string()
      .trim()
      .max(1000, 'Placeholder is too long.')
      .optional()
      .nullable(),

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

    sortOrder: z
      .number()
      .int('Sort order must be an integer.')
      .min(1, 'Sort order must be at least 1.'),

    questionIsActive: z.boolean(),

    minLength: z
      .number()
      .int('Minimum characters must be an integer.')
      .min(0, 'Minimum characters cannot be negative.')
      .optional()
      .nullable(),

    maxLength: z
      .number()
      .int('Maximum characters must be an integer.')
      .min(1, 'Maximum characters must be at least 1.')
      .optional()
      .nullable(),

    pattern: z
      .string()
      .trim()
      .max(500, 'Regex pattern is too long.')
      .optional()
      .nullable(),

    minValue: z.number().optional().nullable(),

    maxValue: z.number().optional().nullable(),
  })
  .superRefine((data, ctx) => {
    if (
      data.minLength !== null &&
      data.minLength !== undefined &&
      data.maxLength !== null &&
      data.maxLength !== undefined &&
      data.minLength > data.maxLength
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['maxLength'],
        message:
          'Maximum characters must be greater than or equal to minimum characters.',
      });
    }

    if (
      data.minValue !== null &&
      data.minValue !== undefined &&
      data.maxValue !== null &&
      data.maxValue !== undefined &&
      data.minValue > data.maxValue
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['maxValue'],
        message:
          'Maximum value must be greater than or equal to minimum value.',
      });
    }
  });

export type FormDetailsValues = z.infer<typeof formDetailsSchema>;
export type QuestionValues = z.infer<typeof questionSchema>;
