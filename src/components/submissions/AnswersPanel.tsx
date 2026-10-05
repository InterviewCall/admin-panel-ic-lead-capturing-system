'use client';

import clsx from 'clsx';
import { FC, useState } from 'react';

import Card from '@/components/ui/Card';
import Pill from '@/components/ui/Pill';
import { SubmissionStep } from '@/types/submission';

type AnswersPanelProps = {
  steps: SubmissionStep[];
  leadScore: number | null;
};

const AnswersPanel: FC<AnswersPanelProps> = ({ steps, leadScore }) => {
  const [scoredOnly, setScoredOnly] = useState(false);

  const allAnswers = steps.flatMap((step) => step.answers);
  const answeredCount = allAnswers.filter((answer) => answer.answerText).length;

  const visibleSteps = steps
    .map((step) => ({
      ...step,
      answers: scoredOnly ? step.answers.filter((answer) => answer.optionScore !== null) : step.answers,
    }))
    .filter((step) => step.answers.length > 0);

  return (
    <Card className="min-w-0 flex-[999_1_560px] overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-(--builder-border) px-6 py-5">
        <div>
          <h2 className="text-xl font-black tracking-[-0.4px]">Answers</h2>
          <div className="text-[13px] font-semibold text-(--builder-muted)">
            {steps.length === 0
              ? 'No answers saved'
              : `${answeredCount} of ${allAnswers.length} questions answered · grouped by form step`}
          </div>
        </div>

        {steps.length > 0 && (
          <div role="group" aria-label="Answer filter" className="flex gap-1.5">
            {[
              { label: 'All', value: false },
              { label: 'Scored only', value: true },
            ].map((option) => (
              <button
                key={option.label}
                type="button"
                aria-pressed={scoredOnly === option.value}
                onClick={() => setScoredOnly(option.value)}
                className={clsx(
                  'min-h-11 cursor-pointer rounded-xl border px-4 text-sm font-bold transition',
                  scoredOnly === option.value
                    ? 'border-[#0f172a] bg-[#0f172a] text-white'
                    : 'border-slate-300 bg-white text-slate-700 hover:border-slate-400',
                )}
              >
                {option.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {steps.length === 0 && (
        <div className="px-6 py-14 text-center">
          <div className="font-black text-[#020617]">No answers yet</div>
          <p className="mx-auto mt-1.5 max-w-md text-sm font-semibold text-(--builder-muted)">
            The candidate started the form but left before submitting, so no answers were saved.
          </p>
        </div>
      )}

      {visibleSteps.map((step) => {
        const subtotal = step.answers.reduce((sum, answer) => sum + (answer.optionScore ?? 0), 0);

        return (
          <div key={step.stepNo}>
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-(--builder-border) bg-slate-50 px-6 py-3">
              <div className="font-black tracking-[-0.2px]">
                Step {step.stepNo} · {step.title}
              </div>
              <div className="text-[13px] font-black text-(--builder-muted)">{subtotal} pts</div>
            </div>

            {step.answers.map((answer) => (
              <div
                key={answer.questionKey}
                className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-6 py-4"
              >
                <div className="min-w-0 flex-[1_1_320px]">
                  <div className="text-[13px] font-bold text-(--builder-muted-light)">{answer.questionText}</div>
                  <div className="mt-0.5 text-[17px] font-black tracking-[-0.2px]">
                    {answer.answerText ?? <span className="font-bold text-slate-400">No answer</span>}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-(--builder-muted-light)">{answer.questionKey}</span>
                  {answer.optionScore !== null ? (
                    <Pill className="bg-[#eff6ff] text-(--builder-blue-dark)">+{answer.optionScore} pts</Pill>
                  ) : (
                    <Pill className="bg-slate-100 text-slate-500">Not scored</Pill>
                  )}
                </div>
              </div>
            ))}
          </div>
        );
      })}

      {steps.length > 0 && (
        <div className="flex items-center justify-between gap-3 bg-slate-50 px-6 py-4">
          <div className="font-black text-(--builder-muted)">Total lead score</div>
          <div className="text-xl font-black">{leadScore ?? 0} / 100</div>
        </div>
      )}
    </Card>
  );
};

export default AnswersPanel;
