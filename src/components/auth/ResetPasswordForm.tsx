'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { resetPasswordSchema, type ResetPasswordFormValues } from '@/schemas/resetPasswordSchema';
import { useResetPassword } from '@/hooks/auth/useResetPassword';

export default function ResetPasswordForm() {
    const router = useRouter();
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const { mutateAsync, isPending } = useResetPassword();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ResetPasswordFormValues>({
        resolver: zodResolver(resetPasswordSchema),
    });

    const onSubmit = async (data: ResetPasswordFormValues) => {
        try {
            await mutateAsync(data);
            router.replace('/');
        } catch {
            // Error toast is handled by useResetPassword.
        }
    };
 
    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-violet-50 via-white to-purple-100 p-4">
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="w-full max-w-md rounded-2xl border border-purple-100 bg-white p-8 shadow-xl shadow-purple-100/60"
            >
                <div className="mb-7 text-center">
                    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-100 text-purple-700">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="28"
                            height="28"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <rect x="3" y="11" width="18" height="11" rx="2" />
                            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                        </svg>
                    </div>

                    <h1 className="text-2xl font-bold text-gray-900">
                        Reset Password
                    </h1>
                    <p className="mt-2 text-sm text-gray-500">
                        Create a new password to activate your account.
                    </p>
                </div>


                <div className="space-y-5">
                    <label className="form-control w-full">
                        <span className="mb-2 text-sm font-medium text-gray-700">
                            New Password
                        </span>

                        <div className="relative">
                            <input
                                type={showNewPassword ? 'text' : 'password'}
                                {...register('newPassword')}
                                className="input input-bordered w-full border-gray-300 bg-white pr-12 text-gray-900 focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
                                placeholder="Enter new password"
                            />

                            <button
                                type="button"
                                onClick={() => setShowNewPassword((prev) => !prev)}
                                aria-label={showNewPassword ? 'Hide password' : 'Show password'}
                                className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-purple-700"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="20"
                                    height="20"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.8"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7-10-7-10-7Z" />
                                    <circle cx="12" cy="12" r="3" />
                                </svg>
                            </button>
                        </div>

                        {errors.newPassword && (
                            <span className="mt-1 text-sm text-error">
                                {errors.newPassword.message}
                            </span>
                        )}
                    </label>
                    
                    <label className="form-control w-full">
                        <span className="mb-2 text-sm font-medium text-gray-700">
                            Confirm Password
                        </span>

                        <div className="relative">
                            <input
                                type={showConfirmPassword ? 'text' : 'password'}
                                {...register('confirmPassword')}
                                className="input input-bordered w-full border-gray-300 bg-white pr-12 text-gray-900 focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
                                placeholder="Confirm new password"
                            />

                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword((prev) => !prev)}
                                aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                                className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-purple-700"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="20"
                                    height="20"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.8"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7-10-7-10-7Z" />
                                    <circle cx="12" cy="12" r="3" />
                                </svg>
                            </button>
                        </div>

                        {errors.confirmPassword && (
                            <span className="mt-1 text-sm text-error">
                                {errors.confirmPassword.message}
                            </span>
                        )}
                    </label>

                    <button
                        type="submit"
                        disabled={isPending}
                        className="btn w-full border-0 bg-purple-700 text-white hover:bg-purple-800 disabled:opacity-60"
                    >
                        {isPending ? 'Resetting...' : 'Reset Password'}
                    </button>
                </div>
            </form>
        </div>
    );

}