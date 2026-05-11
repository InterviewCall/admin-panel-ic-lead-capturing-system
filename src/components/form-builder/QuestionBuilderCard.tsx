'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { FC, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { toast } from 'sonner';

import OptionBuilder from '@/components/form-builder/OptionBuilder';
import ButtonLoader from '@/components/ui/ButtonLoader';
import CardLoadingOverlay from '@/components/ui/CardLoadingOverlay';
import FieldErrorMessage from '@/components/ui/FieldErrorMessage';
import SectionHeader from '@/components/ui/SectionHeader';
import {
  formSteps,
  questionTypeNeedsOptions,
  questionTypes,
} from '@/constants/formBuilder';
import { useAddQuestionToForm } from '@/hooks/form-builder/useAddQuestionToForm';
import { useAppDispatch } from '@/lib/hooks';
import { addQuestionToBuilder } from '@/lib/slices/formBuilderSlice';
import { questionSchema, QuestionValues } from '@/schemas/formBuilderSchema';
import {
  FormQuestion,
  FormQuestionOption,
  numberValidationQuestionTypes,
  textValidationQuestionTypes,
} from '@/types/formBuilder';
import { buildValidationRules } from '@/utils/helpers/buildValidationRules';

type QuestionBuilderCardProps = {
  formId: number | null;
  disabled: boolean;
  onAddQuestion: (question: FormQuestion) => void;
};

const QuestionBuilderCard: FC<QuestionBuilderCardProps> = ({
  formId,
  disabled,
  onAddQuestion,
}) => {
  const dispatch = useAppDispatch();

  const [options, setOptions] = useState<FormQuestionOption[]>([]);
  const [optionError, setOptionError] = useState<string>('');

  const { mutateAsync: addQuestionToForm, isPending } = useAddQuestionToForm();

  const isFormDisabled = disabled || isPending;

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<QuestionValues>({
    resolver: zodResolver(questionSchema),
    defaultValues: {
      stepNo: 2,
      stepTitle: '',
      stepHelperText: '',
      stepIsActive: true,

      questionKey: '',
      questionText: '',
      placeholder: '',
      questionType: 'text',
      isRequired: true,
      sortOrder: 1,
      questionIsActive: true,

      minLength: null,
      maxLength: null,
      pattern: '',
      minValue: null,
      maxValue: null,
    },
  });

  const selectedQuestionType = useWatch({
    control,
    name: 'questionType',
  });

  const needsOptions = questionTypeNeedsOptions.includes(selectedQuestionType);

  const showTextValidationRules =
    textValidationQuestionTypes.includes(selectedQuestionType);

  const showNumberValidationRules =
    numberValidationQuestionTypes.includes(selectedQuestionType);

  const submitQuestion = async (values: QuestionValues): Promise<void> => {
    if (disabled || !formId) {
      toast.error('Please save the qualification form first.');
      return;
    }

    if (needsOptions && options.length === 0) {
      setOptionError('Add at least one option before adding this question.');
      return;
    }

    setOptionError('');

    const questionOptions = needsOptions ? options : [];
    const validationRules = buildValidationRules(values);

    try {
      const response = await addQuestionToForm({
        formId,
        payload: {
          stepNo: values.stepNo,
          stepTitle: values.stepTitle,
          stepHelperText: values.stepHelperText,
          stepIsActive: values.stepIsActive,

          questionKey: values.questionKey,
          questionText: values.questionText,
          placeholder: values.placeholder || null,
          questionType: values.questionType,
          isRequired: values.isRequired,
          sortOrder: values.sortOrder,
          validationRules,
          questionIsActive: values.questionIsActive,

          options: questionOptions,
        },
      });

      const createdQuestion: FormQuestion = {
        id: String(response.data.questionId),

        stepNo: values.stepNo,
        stepTitle: values.stepTitle,
        stepHelperText: values.stepHelperText,
        stepIsActive: values.stepIsActive,

        questionKey: values.questionKey,
        questionText: values.questionText,
        placeholder: values.placeholder || null,
        questionType: values.questionType,
        isRequired: values.isRequired,
        sortOrder: values.sortOrder,
        questionIsActive: values.questionIsActive,

        options: questionOptions,
      };

      dispatch(addQuestionToBuilder(createdQuestion));
      onAddQuestion(createdQuestion);

      reset({
        stepNo: values.stepNo,
        stepTitle: values.stepTitle,
        stepHelperText: values.stepHelperText,
        stepIsActive: values.stepIsActive,

        questionKey: '',
        questionText: '',
        placeholder: '',
        questionType: 'text',
        isRequired: true,
        sortOrder: values.sortOrder + 1,
        questionIsActive: true,

        minLength: null,
        maxLength: null,
        pattern: '',
        minValue: null,
        maxValue: null,
      });

      setOptions([]);
    } catch {}
  };

  return (
    <section className="relative overflow-hidden rounded-3xl border border-(--builder-border) bg-white p-6 shadow-(--builder-shadow)">
      {isPending && (
        <CardLoadingOverlay
          title="Adding question..."
          description="Please wait while we attach this question to the saved form."
        />
      )}

      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <SectionHeader
          eyebrow="Step 2"
          title="Add form step & questions"
          description="Create the step heading first, then attach one or more answer fields inside that step."
        />

        <div className="badge badge-primary badge-outline font-black">
          Question Builder
        </div>
      </div>

      {disabled && (
        <div className="alert alert-info mb-5 rounded-2xl text-sm font-bold">
          Please save the qualification form first. Questions will be attached
          after a form ID is created.
        </div>
      )}

      {formId && (
        <div className="mb-5 inline-flex rounded-full bg-[#dcfce7] px-3.5 py-2 text-xs font-black text-[#166534]">
          Adding questions to Form ID #{formId}
        </div>
      )}

      <form onSubmit={handleSubmit(submitQuestion)} className="grid gap-6">
        <div className="rounded-3xl border border-(--builder-border) bg-[#f8fafc] p-5">
          <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
            <div>
              <h3 className="text-base font-black text-[#020617]">
                Step Details
              </h3>

              <p className="mt-1 text-sm font-semibold text-(--builder-muted)">
                This title and helper text will appear at the top of the
                candidate form step.
              </p>
            </div>

            <label className="flex cursor-pointer items-center gap-3 rounded-full bg-white px-4 py-2 shadow-sm">
              <input
                {...register('stepIsActive')}
                type="checkbox"
                disabled={isFormDisabled}
                className="toggle toggle-primary toggle-sm"
              />

              <span className="text-xs font-black text-[#334155]">
                Step Active
              </span>
            </label>
          </div>

          <div className="grid grid-cols-[180px_1fr] gap-4 max-lg:grid-cols-1">
            <div>
              <label className="mb-2 block text-sm font-black text-[#334155]">
                Step No *
              </label>

              <select
                {...register('stepNo', { valueAsNumber: true })}
                disabled={isFormDisabled}
                className="select select-bordered select-primary min-h-13 w-full rounded-[13px] bg-white text-base disabled:border-slate-200 disabled:bg-slate-50 disabled:text-slate-500"
              >
                {formSteps.map((step) => (
                  <option key={step} value={step}>
                    Step {step}
                  </option>
                ))}
              </select>

              <FieldErrorMessage message={errors.stepNo?.message} />
            </div>

            <div>
              <label className="mb-2 block text-sm font-black text-[#334155]">
                Step Title *
              </label>

              <input
                {...register('stepTitle')}
                disabled={isFormDisabled}
                className="input input-bordered input-primary min-h-13 w-full rounded-[13px] bg-white text-base disabled:border-slate-200 disabled:bg-slate-50 disabled:text-slate-500"
                placeholder="Where are you currently in your engineering career?"
              />

              <FieldErrorMessage message={errors.stepTitle?.message} />
            </div>
          </div>

          <div className="mt-4">
            <label className="mb-2 block text-sm font-black text-[#334155]">
              Step Helper Text *
            </label>

            <input
              {...register('stepHelperText')}
              disabled={isFormDisabled}
              className="input input-bordered input-primary min-h-13 w-full rounded-[13px] bg-white text-base disabled:border-slate-200 disabled:bg-slate-50 disabled:text-slate-500"
              placeholder="This helps us understand your current role and experience level."
            />

            <FieldErrorMessage message={errors.stepHelperText?.message} />
          </div>
        </div>

        <div className="rounded-3xl border border-(--builder-border) bg-white p-5">
          <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
            <div>
              <h3 className="text-base font-black text-[#020617]">
                Question Details
              </h3>

              <p className="mt-1 text-sm font-semibold text-(--builder-muted)">
                This is the actual answer field inside the selected step.
              </p>
            </div>

            <label className="flex cursor-pointer items-center gap-3 rounded-full bg-[#f8fafc] px-4 py-2">
              <input
                {...register('questionIsActive')}
                type="checkbox"
                disabled={isFormDisabled}
                className="toggle toggle-primary toggle-sm"
              />

              <span className="text-xs font-black text-[#334155]">
                Question Active
              </span>
            </label>
          </div>

          <div className="grid grid-cols-3 gap-4 max-lg:grid-cols-1">
            <div>
              <label className="mb-2 block text-sm font-black text-[#334155]">
                Question Type *
              </label>

              <select
                {...register('questionType')}
                disabled={isFormDisabled}
                className="select select-bordered select-primary min-h-13 w-full rounded-[13px] bg-white text-base disabled:border-slate-200 disabled:bg-slate-50 disabled:text-slate-500"
              >
                {questionTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>

              <FieldErrorMessage message={errors.questionType?.message} />
            </div>

            <div>
              <label className="mb-2 block text-sm font-black text-[#334155]">
                Sort Order *
              </label>

              <input
                {...register('sortOrder', { valueAsNumber: true })}
                type="number"
                disabled={isFormDisabled}
                className="input input-bordered input-primary min-h-13 w-full rounded-[13px] bg-white text-base disabled:border-slate-200 disabled:bg-slate-50 disabled:text-slate-500"
              />

              <FieldErrorMessage message={errors.sortOrder?.message} />
            </div>

            <div>
              <label className="mb-2 block text-sm font-black text-[#334155]">
                Required?
              </label>

              <label className="flex min-h-13 cursor-pointer items-center gap-3 rounded-[13px] border border-(--builder-border) px-4">
                <input
                  {...register('isRequired')}
                  type="checkbox"
                  disabled={isFormDisabled}
                  className="toggle toggle-primary"
                />

                <span className="text-sm font-black text-[#334155]">
                  Candidate must answer
                </span>
              </label>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-4 max-lg:grid-cols-1">
            <div>
              <label className="mb-2 block text-sm font-black text-[#334155]">
                Question Key *
              </label>

              <input
                {...register('questionKey')}
                disabled={isFormDisabled}
                className="input input-bordered input-primary min-h-13 w-full rounded-[13px] bg-white text-base disabled:border-slate-200 disabled:bg-slate-50 disabled:text-slate-500"
                placeholder="currentCompany"
              />

              <FieldErrorMessage message={errors.questionKey?.message} />
            </div>

            <div>
              <label className="mb-2 block text-sm font-black text-[#334155]">
                Placeholder
              </label>

              <input
                {...register('placeholder')}
                disabled={isFormDisabled}
                className="input input-bordered input-primary min-h-13 w-full rounded-[13px] bg-white text-base disabled:border-slate-200 disabled:bg-slate-50 disabled:text-slate-500"
                placeholder="Example: TCS, Accenture, Wipro"
              />

              <FieldErrorMessage message={errors.placeholder?.message} />
            </div>
          </div>

          <div className="mt-4">
            <label className="mb-2 block text-sm font-black text-[#334155]">
              Question Text / Field Label *
            </label>

            <input
              {...register('questionText')}
              disabled={isFormDisabled}
              className="input input-bordered input-primary min-h-13 w-full rounded-[13px] bg-white text-base disabled:border-slate-200 disabled:bg-slate-50 disabled:text-slate-500"
              placeholder="Current Company"
            />

            <FieldErrorMessage message={errors.questionText?.message} />
          </div>
        </div>

        {(showTextValidationRules || showNumberValidationRules) && (
          <div className="rounded-3xl border border-(--builder-border) bg-[#f8fafc] p-5">
            <div className="mb-4">
              <h3 className="text-base font-black text-[#020617]">
                Validation Rules
              </h3>

              <p className="mt-1 text-sm font-semibold text-(--builder-muted)">
                Optional rules for candidate input validation.
              </p>
            </div>

            {showTextValidationRules && (
              <div className="grid grid-cols-3 gap-4 max-lg:grid-cols-1">
                <div>
                  <label className="mb-2 block text-sm font-black text-[#334155]">
                    Minimum Characters
                  </label>

                  <input
                    {...register('minLength', { valueAsNumber: true })}
                    type="number"
                    disabled={isFormDisabled}
                    className="input input-bordered input-primary min-h-13 w-full rounded-[13px] bg-white text-base disabled:border-slate-200 disabled:bg-slate-50 disabled:text-slate-500"
                    placeholder="2"
                  />

                  <FieldErrorMessage message={errors.minLength?.message} />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-black text-[#334155]">
                    Maximum Characters
                  </label>

                  <input
                    {...register('maxLength', { valueAsNumber: true })}
                    type="number"
                    disabled={isFormDisabled}
                    className="input input-bordered input-primary min-h-13 w-full rounded-[13px] bg-white text-base disabled:border-slate-200 disabled:bg-slate-50 disabled:text-slate-500"
                    placeholder="100"
                  />

                  <FieldErrorMessage message={errors.maxLength?.message} />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-black text-[#334155]">
                    Regex Pattern
                  </label>

                  <input
                    {...register('pattern')}
                    disabled={isFormDisabled}
                    className="input input-bordered input-primary min-h-13 w-full rounded-[13px] bg-white text-base disabled:border-slate-200 disabled:bg-slate-50 disabled:text-slate-500"
                    placeholder="Optional advanced pattern"
                  />

                  <FieldErrorMessage message={errors.pattern?.message} />
                </div>
              </div>
            )}

            {showNumberValidationRules && (
              <div className="grid grid-cols-2 gap-4 max-lg:grid-cols-1">
                <div>
                  <label className="mb-2 block text-sm font-black text-[#334155]">
                    Minimum Value
                  </label>

                  <input
                    {...register('minValue', { valueAsNumber: true })}
                    type="number"
                    disabled={isFormDisabled}
                    className="input input-bordered input-primary min-h-13 w-full rounded-[13px] bg-white text-base disabled:border-slate-200 disabled:bg-slate-50 disabled:text-slate-500"
                    placeholder="0"
                  />

                  <FieldErrorMessage message={errors.minValue?.message} />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-black text-[#334155]">
                    Maximum Value
                  </label>

                  <input
                    {...register('maxValue', { valueAsNumber: true })}
                    type="number"
                    disabled={isFormDisabled}
                    className="input input-bordered input-primary min-h-13 w-full rounded-[13px] bg-white text-base disabled:border-slate-200 disabled:bg-slate-50 disabled:text-slate-500"
                    placeholder="30"
                  />

                  <FieldErrorMessage message={errors.maxValue?.message} />
                </div>
              </div>
            )}
          </div>
        )}

        {needsOptions && (
          <OptionBuilder
            options={options}
            onChange={(updatedOptions) => {
              setOptions(updatedOptions);

              if (updatedOptions.length > 0) {
                setOptionError('');
              }
            }}
          />
        )}

        {needsOptions && optionError && (
          <div className="alert alert-warning rounded-2xl text-sm font-bold">
            {optionError}
          </div>
        )}

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isFormDisabled}
            className="btn btn-primary min-h-12 rounded-[13px] px-6 font-black text-white shadow-[0_14px_30px_rgba(37,99,235,0.22)] disabled:pointer-events-none disabled:opacity-60"
          >
            <ButtonLoader
              isLoading={isPending}
              loadingText="Adding Question..."
            >
              Add Question
            </ButtonLoader>
          </button>
        </div>
      </form>
    </section>
  );
};

export default QuestionBuilderCard;
