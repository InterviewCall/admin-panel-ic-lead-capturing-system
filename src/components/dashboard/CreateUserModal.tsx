
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import ButtonLoader from '@/components/ui/ButtonLoader';
import FieldErrorMessage from '@/components/ui/FieldErrorMessage';
import { ROLE, ROLE_OPTIONS } from '@/constants/roles';
import { useCreateUser } from '@/hooks/auth/useCreateUser';
import {
    createUserSchema,
    CreateUserFormValues,
} from '@/schemas/createUserSchema';

type Props = {
    isOpen: boolean;
    onClose: () => void;
};

const fields = [
    { name: 'fullName', label: 'Name', type: 'text', placeholder: 'Full name' },
    { name: 'email', label: 'Email', type: 'email', placeholder: 'Email address' },
    { name: 'phoneNo', label: 'Phone Number', type: 'tel', placeholder: 'Phone number (include country code if needed)' },
] as const;

const inputClass =
    'input input-bordered w-full border-slate-200 bg-white text-slate-900';

export default function CreateUserModal({ isOpen, onClose }: Props) {
    const { mutateAsync: createUser, isPending } = useCreateUser();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<CreateUserFormValues>({
        resolver: zodResolver(createUserSchema),
        defaultValues: {
            fullName: '',
            email: '',
            phoneNo: '',
            role: ROLE.MANAGER,
        },
    });

    // Create the user and reset the form after success.
    const submitCreateUser = async (values: CreateUserFormValues) => {
        try {
            await createUser(values);
            reset();
            onClose();
        } catch {
            // The mutation hook displays the error toast.
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-slate-950/50 p-4">
            <section
                role="dialog"
                aria-modal="true"
                aria-labelledby="create-user-title"
                className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl"
            >
                <header className="mb-6 flex items-center justify-between">
                    <div>
                        <h2 id="create-user-title" className="text-2xl font-black text-slate-900">
                            Create User
                        </h2>
                        <p className="mt-1 text-sm text-slate-500">
                            Add an Admin or Manager.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isPending}
                        aria-label="Close modal"
                        className="text-2xl text-slate-500"
                    >
                        &times;
                    </button>
                </header>

                <form onSubmit={handleSubmit(submitCreateUser)} noValidate className="grid gap-4">
                    {fields.map((field) => (
                        <div key={field.name}>
                            <label htmlFor={field.name} className="mb-1.5 block text-sm font-bold text-slate-800">
                                {field.label}
                            </label>
                            <input
                                {...register(field.name)}
                                id={field.name}
                                type={field.type}
                                placeholder={field.placeholder}
                                disabled={isPending}
                                className={inputClass}
                                aria-invalid={Boolean(errors[field.name])}
                            />
                            <FieldErrorMessage message={errors[field.name]?.message} />
                        </div>
                    ))}

                    <div>
                        <label htmlFor="role" className="mb-1.5 block text-sm font-bold text-slate-800">
                            Role
                        </label>
                        <select
                            {...register('role')}
                            id="role"
                            disabled={isPending}
                            className={inputClass}
                        >
                            {ROLE_OPTIONS.map((role) => (
                                <option key={role} value={role}>
                                    {role === ROLE.ADMIN ? 'Admin' : 'Manager'}
                                </option>
                            ))}
                        </select>
                        <FieldErrorMessage message={errors.role?.message} />
                    </div>

                    <footer className="mt-3 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isPending}
                            className="btn border-slate-200 bg-white text-slate-700"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isPending}
                            className="btn border-0 bg-indigo-600 text-white hover:bg-indigo-700"
                        >
                            <ButtonLoader isLoading={isPending} loadingText="Creating...">
                                Create User
                            </ButtonLoader>
                        </button>
                    </footer>
                </form>
            </section>
        </div>
    );
}
