import { z } from 'zod';

export const resetPasswordSchema = z
    .object({
        newPassword: z
            .string()
            .min(8, 'Password must be at least 8 characters.')
            .max(32, 'Password must not exceed 32 characters.')
            .regex(
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*#?&^_-])[A-Za-z\d@$!%*#?&^_-]+$/,
                'Password must contain an uppercase letter, a lowercase letter, a number, and a supported special character.',
            ),

        confirmPassword: z
            .string()
            .min(1, 'Please confirm your new password.'),
    })
    .refine(
        (data) => data.newPassword === data.confirmPassword,
        {
            path: ['confirmPassword'],
            message: 'Passwords do not match.',
        },
    );

export type ResetPasswordFormValues = z.infer<
    typeof resetPasswordSchema
>;