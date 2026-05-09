'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { FC, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';

import OptionBuilder from '@/components/form-builder/OptionBuilder';
import FieldErrorMessage from '@/components/ui/FieldErrorMessage';
import SectionHeader from '@/components/ui/SectionHeader';
import {
  formSteps,
  questionTypeNeedsOptions,
  questionTypes,
} from '@/constants/formBuilder';
import {
  questionSchema,
  QuestionValues,
} from '@/schemas/formBuilderSchema';
import {
  FormQuestion,
  FormQuestionOption,
} from '@/types/formBuilder';

type QuestionBuilderCardProps = {
  onAddQuestion: (question: FormQuestion) => void;
};

const QuestionBuilderCard: FC<QuestionBuilderCardProps> = ({
  onAddQuestion,
}) => {
  const [options, setOptions] = useState<FormQuestionOption[]>([]);
  const [optionError, setOptionError] = useState<string>('');

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
      questionKey: '',
      questionText: '',
      helperText: '',
      questionType: 'text',
      isRequired: true,
      sortOrder: 1,
    },
  });

  const selectedQuestionType = useWatch({
    control,
    name: 'questionType',
  });

  const needsOptions = questionTypeNeedsOptions.includes(selectedQuestionType);

  const submitQuestion = (values: QuestionValues): void => {
    if (needsOptions && options.length === 0) {
      setOptionError('Add at least one option before adding this question.');
      return;
    }

    setOptionError('');

    onAddQuestion({
      id: crypto.randomUUID(),
      ...values,
      options: needsOptions ? options : [],
    });

    reset({
      stepNo: values.stepNo,
      questionKey: '',
      questionText: '',
      helperText: '',
      questionType: 'text',
      isRequired: true,
      sortOrder: values.sortOrder + 1,
    });

    setOptions([]);
  };

  return (
    <section className="rounded-3xl border border-(--builder-border) bg-white p-6 shadow-(--builder-shadow)">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <SectionHeader
          eyebrow="Step 2"
          title="Add form questions"
          description="Create questions step-wise. Option-based questions can have choices and scores."
        />

        <div className="badge badge-primary badge-outline font-black">
          Question Builder
        </div>
      </div>

      <form onSubmit={handleSubmit(submitQuestion)} className="grid gap-4">
        <div className="grid grid-cols-3 gap-4 max-lg:grid-cols-1">
          <div>
            <label className="mb-2 block text-sm font-black text-[#334155]">
              Step No *
            </label>

            <select
              {...register('stepNo', { valueAsNumber: true })}
              className="select select-bordered select-primary min-h-13 w-full rounded-[13px] bg-white text-base"
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
              Question Type *
            </label>

            <select
              {...register('questionType')}
              className="select select-bordered select-primary min-h-13 w-full rounded-[13px] bg-white text-base"
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
              className="input input-bordered input-primary min-h-13 w-full rounded-[13px] bg-white text-base"
            />

            <FieldErrorMessage message={errors.sortOrder?.message} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 max-lg:grid-cols-1">
          <div>
            <label className="mb-2 block text-sm font-black text-[#334155]">
              Question Key *
            </label>

            <input
              {...register('questionKey')}
              className="input input-bordered input-primary min-h-13 w-full rounded-[13px] bg-white text-base"
              placeholder="aiConcern"
            />

            <FieldErrorMessage message={errors.questionKey?.message} />
          </div>

          <div>
            <label className="mb-2 block text-sm font-black text-[#334155]">
              Required?
            </label>

            <label className="flex min-h-13 cursor-pointer items-center gap-3 rounded-[13px] border border-(--builder-border) px-4">
              <input
                {...register('isRequired')}
                type="checkbox"
                className="toggle toggle-primary"
              />

              <span className="text-sm font-black text-[#334155]">
                Candidate must answer this question
              </span>
            </label>
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-black text-[#334155]">
            Question Text *
          </label>

          <textarea
            {...register('questionText')}
            className="textarea textarea-bordered textarea-primary min-h-24 w-full rounded-[13px] bg-white text-base"
            placeholder="How worried are you about AI affecting your software engineering role?"
          />

          <FieldErrorMessage message={errors.questionText?.message} />
        </div>

        <div>
          <label className="mb-2 block text-sm font-black text-[#334155]">
            Helper Text
          </label>

          <input
            {...register('helperText')}
            className="input input-bordered input-primary min-h-13 w-full rounded-[13px] bg-white text-base"
            placeholder="Choose the option that best describes your current concern."
          />
        </div>

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
            className="btn btn-primary min-h-12 rounded-[13px] px-6 font-black text-white"
          >
            Add Question
          </button>
        </div>
      </form>
    </section>
  );
};

export default QuestionBuilderCard;