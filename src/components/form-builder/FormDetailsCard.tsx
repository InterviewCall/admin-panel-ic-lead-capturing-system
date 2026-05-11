'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { FC } from 'react';
import { useForm } from 'react-hook-form';

import ButtonLoader from '@/components/ui/ButtonLoader';
import CardLoadingOverlay from '@/components/ui/CardLoadingOverlay';
import FieldErrorMessage from '@/components/ui/FieldErrorMessage';
import SectionHeader from '@/components/ui/SectionHeader';
import { useCreateQualificationForm } from '@/hooks/form-builder/useCreateQualificationForm';
import { useAppDispatch } from '@/lib/hooks';
import { setCreatedForm } from '@/lib/slices/formBuilderSlice';
import {
  formDetailsSchema,
  FormDetailsValues,
} from '@/schemas/formBuilderSchema';

type FormDetailsCardProps = {
  defaultValues: FormDetailsValues;
  onSave: (values: FormDetailsValues) => void;
};

const FormDetailsCard: FC<FormDetailsCardProps> = ({
  defaultValues,
  onSave,
}) => {
  const dispatch = useAppDispatch();

  const { mutateAsync: createQualificationForm, isPending } =
    useCreateQualificationForm();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormDetailsValues>({
    resolver: zodResolver(formDetailsSchema),
    defaultValues,
  });

  const submitFormDetails = async (
    values: FormDetailsValues,
  ): Promise<void> => {
    try {
      const response = await createQualificationForm(values);

      dispatch(
        setCreatedForm({
          formId: response.data.formId,
          slug: response.data.slug,
        }),
      );

      onSave(values);
    } catch {}
  };

  return (
    <section className="relative overflow-hidden rounded-3xl border border-(--builder-border) bg-white p-6 shadow-(--builder-shadow)">
      {isPending && (
        <CardLoadingOverlay
          title="Saving form details..."
          description="Please wait while we create the qualification form."
        />
      )}

      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <SectionHeader
          eyebrow="Step 1"
          title="Create qualification form"
          description="Define the form identity. Questions will be attached to this form."
        />

        <div className="badge badge-primary badge-outline font-black">
          Form Setup
        </div>
      </div>

      <form onSubmit={handleSubmit(submitFormDetails)} className="grid gap-4">
        <div className="grid grid-cols-2 gap-4 max-md:grid-cols-1">
          <div>
            <label className="mb-2 block text-sm font-black text-[#334155]">
              Form Name *
            </label>

            <input
              {...register('name')}
              className="input input-bordered input-primary min-h-13 w-full rounded-[13px] bg-white text-base disabled:border-slate-200 disabled:bg-slate-50 disabled:text-slate-500"
              placeholder="AI-Proof Engineer Readiness Check"
              disabled={isPending}
            />

            <FieldErrorMessage message={errors.name?.message} />
          </div>

          <div>
            <label className="mb-2 block text-sm font-black text-[#334155]">
              Slug *
            </label>

            <input
              {...register('slug')}
              className="input input-bordered input-primary min-h-13 w-full rounded-[13px] bg-white text-base disabled:border-slate-200 disabled:bg-slate-50 disabled:text-slate-500"
              placeholder="ai-proof-engineer-readiness-check"
              disabled={isPending}
            />

            <FieldErrorMessage message={errors.slug?.message} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 max-md:grid-cols-1">
          <div>
            <label className="mb-2 block text-sm font-black text-[#334155]">
              Segment Key *
            </label>

            <input
              {...register('segmentKey')}
              className="input input-bordered input-primary min-h-13 w-full rounded-[13px] bg-white text-base disabled:border-slate-200 disabled:bg-slate-50 disabled:text-slate-500"
              placeholder="ai_fear"
              disabled={isPending}
            />

            <FieldErrorMessage message={errors.segmentKey?.message} />
          </div>

          <div>
            <label className="mb-2 block text-sm font-black text-[#334155]">
              Version *
            </label>

            <input
              {...register('version', { valueAsNumber: true })}
              type="number"
              className="input input-bordered input-primary min-h-13 w-full rounded-[13px] bg-white text-base disabled:border-slate-200 disabled:bg-slate-50 disabled:text-slate-500"
              placeholder="1"
              disabled={isPending}
            />

            <FieldErrorMessage message={errors.version?.message} />
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-black text-[#334155]">
            Description
          </label>

          <textarea
            {...register('description')}
            className="textarea textarea-bordered textarea-primary min-h-28 w-full rounded-[13px] bg-white text-base disabled:border-slate-200 disabled:bg-slate-50 disabled:text-slate-500"
            placeholder="Short internal description of this form..."
            disabled={isPending}
          />
        </div>

        <label className="flex cursor-pointer items-center gap-3">
          <input
            {...register('isActive')}
            type="checkbox"
            className="toggle toggle-primary"
            disabled={isPending}
          />

          <span className="text-sm font-black text-[#334155]">
            Keep this form active
          </span>
        </label>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isPending}
            className="btn btn-primary min-h-12 rounded-[13px] px-6 font-black text-white shadow-[0_14px_30px_rgba(37,99,235,0.22)] transition disabled:pointer-events-none disabled:opacity-90"
          >
            <ButtonLoader isLoading={isPending} loadingText="Creating Form...">
              Save Form Details
            </ButtonLoader>
          </button>
        </div>
      </form>
    </section>
  );
};

export default FormDetailsCard;
