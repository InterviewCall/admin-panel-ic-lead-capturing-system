import { z } from 'zod';

import { ROLE_OPTIONS } from '@/constants/roles';

export const createUserSchema = z.object({
    fullName: z
        .string()
        .trim()
        .min(2, 'Name must contain at least 2 characters.')
        .max(100, 'Name cannot exceed 100 characters.'),

    email: z
        .string()
        .trim()
        .email('Enter a valid email address.'),

    phoneNo: z
        .string()
        .trim()
        .regex(
            /^\+?[1-9]\d{7,14}$/,
            'Enter a valid phone number, including country code if required.',
        ),

    role: z.enum(ROLE_OPTIONS),
});

export type CreateUserFormValues = z.infer<typeof createUserSchema>;