'use client';

import { FC } from 'react';

import SectionHeader from '@/components/ui/SectionHeader';
import { FormQuestion } from '@/types/formBuilder';

type QuestionListCardProps = {
  questions: FormQuestion[];
  onRemoveQuestion: (id: string) => void;
};

const QuestionListCard: FC<QuestionListCardProps> = ({
  questions,
  onRemoveQuestion,
}) => {
  const groupedQuestions = questions.reduce<Record<number, FormQuestion[]>>(
    (accumulator, question) => {
      accumulator[question.stepNo] = accumulator[question.stepNo] || [];
      accumulator[question.stepNo].push(question);
      return accumulator;
    },
    {},
  );

  return (
    <section className="rounded-3xl border border-(--builder-border) bg-white p-6 shadow-(--builder-shadow)">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <SectionHeader
          eyebrow="Preview"
          title="Questions added"
          description="Review the questions before connecting this builder to your backend."
        />

        <div className="stats rounded-2xl border border-(--builder-border) bg-[#f8fafc] shadow-none">
          <div className="stat px-4 py-2">
            <div className="stat-title text-xs font-bold">Questions</div>
            <div className="stat-value text-2xl text-(--builder-blue)">
              {questions.length}
            </div>
          </div>
        </div>
      </div>

      {questions.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-(--builder-border) bg-[#f8fafc] p-8 text-center">
          <h3 className="text-lg font-black text-[#020617]">
            No questions added yet
          </h3>
          <p className="mt-1 text-sm font-semibold text-(--builder-muted)">
            Add your first question from the builder panel.
          </p>
        </div>
      ) : (
        <div className="grid gap-5">
          {Object.entries(groupedQuestions)
            .sort(([firstStep], [secondStep]) => Number(firstStep) - Number(secondStep))
            .map(([stepNo, stepQuestions]) => (
              <div key={stepNo}>
                <div className="mb-3 inline-flex rounded-full bg-[#eff6ff] px-3 py-1.5 text-xs font-black text-(--builder-blue-dark)">
                  Step {stepNo}
                </div>

                <div className="grid gap-3">
                  {stepQuestions
                    .sort((first, second) => first.sortOrder - second.sortOrder)
                    .map((question) => (
                      <div
                        key={question.id}
                        className="rounded-2xl border border-(--builder-border) bg-[#f8fafc] p-4"
                      >
                        <div className="flex flex-wrap items-start justify-between gap-4">
                          <div>
                            <div className="mb-1 flex flex-wrap items-center gap-2">
                              <span className="badge badge-primary badge-outline font-black">
                                {question.questionType}
                              </span>

                              {question.isRequired && (
                                <span className="badge badge-error badge-outline font-black">
                                  Required
                                </span>
                              )}

                              <span className="badge badge-ghost font-black">
                                Order {question.sortOrder}
                              </span>
                            </div>

                            <h3 className="text-base font-black text-[#020617]">
                              {question.questionText}
                            </h3>

                            <p className="mt-1 text-xs font-bold text-(--builder-muted-light)">
                              Key: {question.questionKey}
                            </p>

                            {question.helperText && (
                              <p className="mt-2 text-sm font-semibold text-(--builder-muted)">
                                {question.helperText}
                              </p>
                            )}
                          </div>

                          <button
                            type="button"
                            onClick={() => onRemoveQuestion(question.id)}
                            className="btn btn-sm btn-error rounded-full text-white"
                          >
                            Remove
                          </button>
                        </div>

                        {question.options.length > 0 && (
                          <div className="mt-3 flex flex-wrap gap-2">
                            {question.options.map((option) => (
                              <span
                                key={option.id}
                                className="rounded-full bg-white px-3 py-1 text-xs font-black text-[#334155]"
                              >
                                {option.optionLabel}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                </div>
              </div>
            ))}
        </div>
      )}
    </section>
  );
};

export default QuestionListCard;