'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { FC } from 'react';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';

import ButtonLoader from '@/components/ui/ButtonLoader';
import FieldErrorMessage from '@/components/ui/FieldErrorMessage';
import { useLogin } from '@/hooks/auth/useLogin';
import { LoginFormValues, loginSchema } from '@/schemas/authSchema';

const LoginForm: FC = () => {
    const router = useRouter();

    const { mutateAsync: login, isPending } = useLogin();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: '',
            password: '',
        },
    });

    // Authenticate the user, save the JWT, and redirect to the dashboard.
   const submitLogin = async (values: LoginFormValues): Promise<void> => {
    try {
        const result = await login(values);

        if (result.requiresPasswordReset) {
            router.replace('/reset-password');
            return;
        }

        sessionStorage.setItem('user-role', result.user.role);
        
        router.replace('/dashboard');
    } catch {
        // The useLogin hook displays the error toast.
    }
};

    return (
        <main className="grid min-h-screen grid-cols-1 bg-white lg:grid-cols-2">
            {/* Left branding panel */}
            <section className="relative flex min-h-[300px] flex-col overflow-hidden bg-[linear-gradient(145deg,#10172f_0%,#191d42_55%,#30256b_100%)] px-8 py-8 text-white sm:px-12 sm:py-10 lg:min-h-screen lg:px-16 lg:py-12">
                <div className="absolute -right-24 top-24 h-72 w-72 rounded-full bg-indigo-500/10 blur-3xl" />
                <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl" />

                <div className="relative z-10 text-xl font-black tracking-tight">
                    Interview<span className="text-indigo-300">Call</span>
                </div>

                <div className="relative z-10 my-12 max-w-xl lg:my-auto lg:py-20">
                    <p className="mb-5 text-[10px] font-bold uppercase tracking-[0.22em] text-indigo-200 sm:text-xs">
                        Internal lead management workspace
                    </p>

                    <h1 className="text-3xl font-black leading-tight tracking-tight sm:text-4xl xl:text-5xl">
                        One workspace for managing candidate forms, submissions, and bookings.
                    </h1>

                    <p className="mt-5 max-w-lg text-sm leading-7 text-slate-300 sm:text-base">
                        Keep your team's candidate workflow organized,
                        accessible, and ready for review.
                    </p>

                    <div className="mt-9 space-y-5">
                        {[
                            'Manage qualification forms and questions.',
                            'Review candidate submissions and lead details.',
                            'Track bookings and counselling call activity.',
                        ].map((feature) => (
                            <div
                                key={feature}
                                className="flex items-start gap-3"
                            >
                                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border border-white/15 bg-white/10 text-xs text-indigo-200">
                                    ✓
                                </span>

                                <p className="text-sm leading-6 text-slate-300">
                                    {feature}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                <p className="relative z-10 mt-auto text-xs text-slate-400">
                    © InterviewCall · Internal workspace
                </p>
            </section>

            {/* Right sign-in panel */}
            <section className="flex min-h-[560px] items-center justify-center px-6 py-14 sm:px-12 lg:min-h-screen lg:px-16">
                <div className="w-full max-w-md">
                    <div className="mb-9">
                        <div className="mb-5 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-700">
                            <svg
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.8"
                                className="h-6 w-6"
                                aria-hidden="true"
                            >
                                <rect
                                    x="4"
                                    y="10"
                                    width="16"
                                    height="11"
                                    rx="2"
                                />
                                <path d="M8 10V7a4 4 0 0 1 8 0v3" />
                                <path d="M12 14v3" />
                            </svg>
                        </div>

                        <h2 className="text-3xl font-black tracking-tight text-slate-900">
                            Sign in
                        </h2>

                        <p className="mt-3 text-sm leading-6 text-slate-500">
                            Access is provided by your administrator. Public
                            sign-up is disabled.
                        </p>
                    </div>

                    <form
                        onSubmit={handleSubmit(submitLogin)}
                        className="grid gap-5"
                    >
                        <div>
                            <label
                                htmlFor="email"
                                className="mb-2 block text-sm font-bold text-black "
                            >
                                Email
                            </label>

                            <input
                                {...register('email')}
                                id="email"
                                type="email"
                                autoComplete="username"
                                disabled={isPending}
                                placeholder="you@company.com"
                                className="input input-bordered w-full rounded-lg border-slate-200 bg-white text-sm text-black outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100 disabled:bg-slate-50"
                            />

                            <FieldErrorMessage
                                message={errors.email?.message}
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="password"
                                className="mb-2 block text-sm font-bold text-black"
                            >
                                Password
                            </label>

                            <input
                                {...register('password')}
                                id="password"
                                type="password"
                                autoComplete="current-password"
                                disabled={isPending}
                                placeholder="Enter your password"
                                className="input input-bordered w-full rounded-lg border-slate-200 bg-white text-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100 disabled:bg-slate-50 text-black"
                            />

                            <FieldErrorMessage
                                message={errors.password?.message}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isPending}
                            className="btn mt-1 min-h-12 w-full rounded-lg border-0 bg-indigo-600 text-sm font-bold text-white shadow-[0_8px_20px_rgba(79,70,229,0.18)] transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            <ButtonLoader
                                isLoading={isPending}
                                loadingText="Signing in..."
                            >
                                Sign In
                            </ButtonLoader>
                        </button>
                    </form>

                    <div className="mt-8 border-t border-slate-100 pt-5 text-center">
                        <p className="text-xs leading-6 text-slate-400">
                            Forgot your password or don’t have an account yet?
                            <br />
                            Contact your workspace administrator for assistance.
                        </p>
                    </div>
                </div>
            </section>
        </main>
    );
};

export default LoginForm;