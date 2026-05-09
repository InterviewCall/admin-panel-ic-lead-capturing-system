'use client';

import { FC, useMemo, useState } from 'react';

import FormDetailsCard from '@/components/form-builder/FormDetailsCard';
import QuestionBuilderCard from '@/components/form-builder/QuestionBuilderCard';
import QuestionListCard from '@/components/form-builder/QuestionListCard';
import QuestionPreviewCard from '@/components/form-builder/QuestionPreviewCard';
import { FormDetailsValues } from '@/schemas/formBuilderSchema';
import { FormQuestion, QualificationFormDraft } from '@/types/formBuilder';

const initialFormDetails: FormDetailsValues = {
  name: 'AI-Proof Engineer Readiness Check',
  slug: 'ai-proof-engineer-readiness-check',
  segmentKey: 'ai_fear',
  description:
    'Lead qualification form for engineers worried about AI and career growth.',
  version: 1,
  isActive: true,
};

const FormBuilder: FC = () => {
  const [formDetails, setFormDetails] =
    useState<FormDetailsValues>(initialFormDetails);

  const [questions, setQuestions] = useState<FormQuestion[]>([]);

  const draft: QualificationFormDraft = useMemo(
    () => ({
      ...formDetails,
      questions,
    }),
    [formDetails, questions],
  );

  const totalOptionCount = useMemo(() => {
    return questions.reduce(
      (total, question) => total + question.options.length,
      0,
    );
  }, [questions]);

  const totalStepsUsed = useMemo(() => {
    return new Set(questions.map((question) => question.stepNo)).size;
  }, [questions]);

  const addQuestion = (question: FormQuestion): void => {
    setQuestions((previousQuestions) => [...previousQuestions, question]);
  };

  const removeQuestion = (id: string): void => {
    setQuestions((previousQuestions) =>
      previousQuestions.filter((question) => question.id !== id),
    );
  };

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_12%_8%,rgba(37,99,235,0.12),transparent_30%),linear-gradient(180deg,#ffffff_0%,#f8fafc_46%,#f1f5f9_100%)] px-4 py-7 text-(--builder-text) max-sm:px-3">
      <div className="mx-auto w-[min(1320px,94%)]">
        <header className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="text-[22px] font-black tracking-[-0.5px] text-[#020617]">
              Interview
              <span className="text-(--builder-blue)">Call</span>
            </div>

            <p className="mt-1 text-sm font-bold text-(--builder-muted)">
              Internal admin workspace / Form Builder
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="rounded-full bg-[#eff6ff] px-4 py-2 text-sm font-black text-(--builder-blue-dark)">
              Draft Mode
            </div>

            <button
              type="button"
              className="btn btn-primary min-h-11 rounded-full px-5 font-black text-white"
            >
              Save Draft
            </button>
          </div>
        </header>

        <section className="mb-6 overflow-hidden rounded-[28px] border border-white/40 bg-[linear-gradient(135deg,#2563eb_0%,#1d4ed8_38%,#0f172a_100%)] p-7 text-white shadow-[0_28px_80px_rgba(37,99,235,0.22)] max-sm:p-5">
          <div className="grid grid-cols-[1.2fr_0.8fr] items-end gap-6 max-lg:grid-cols-1">
            <div>
              <div className="mb-3 inline-flex rounded-full bg-white/15 px-3.5 py-2 text-xs font-black text-[#dbeafe]">
                Dynamic Qualification Form Builder
              </div>

              <h1 className="max-w-4xl text-[clamp(30px,4.8vw,54px)] font-black leading-[1.04] tracking-[-1.4px]">
                Build lead forms that adapt to every candidate segment.
              </h1>

              <p className="mt-4 max-w-3xl text-base font-semibold leading-7 text-[#dbeafe]">
                Create form identity, add step-wise questions, attach answer
                options, and preview the final payload before connecting APIs.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3 max-sm:grid-cols-1">
              <StatCard label="Questions" value={questions.length} />
              <StatCard label="Steps Used" value={totalStepsUsed} />
              <StatCard label="Options" value={totalOptionCount} />
            </div>
          </div>
        </section>

        <section className="mb-6 grid grid-cols-4 gap-4 max-lg:grid-cols-2 max-sm:grid-cols-1">
          <ProcessCard
            step="01"
            title="Form Identity"
            description="Name, slug, segment key, and active version."
            active
          />

          <ProcessCard
            step="02"
            title="Questions"
            description="Create input, radio, select, checkbox, and text areas."
            active
          />

          <ProcessCard
            step="03"
            title="Preview"
            description="Review grouped questions and JSON payload."
            active={questions.length > 0}
          />

          <ProcessCard
            step="04"
            title="API Connect"
            description="Connect create/update APIs after backend is ready."
          />
        </section>

        <div className="grid grid-cols-[minmax(0,1fr)_420px] gap-6 max-xl:grid-cols-1">
          <div className="grid gap-6">
            <FormDetailsCard
              defaultValues={formDetails}
              onSave={setFormDetails}
            />

            <QuestionBuilderCard onAddQuestion={addQuestion} />

            <QuestionListCard
              questions={questions}
              onRemoveQuestion={removeQuestion}
            />
          </div>

          <aside className="xl:sticky xl:top-6 xl:self-start">
            <QuestionPreviewCard draft={draft} />
          </aside>
        </div>
      </div>
    </main>
  );
};

export default FormBuilder;

type StatCardProps = {
  label: string;
  value: number;
};

const StatCard: FC<StatCardProps> = ({ label, value }) => {
  return (
    <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur">
      <div className="text-3xl font-black tracking-[-0.8px] text-white">
        {value}
      </div>

      <div className="mt-1 text-xs font-black uppercase tracking-[0.12em] text-[#bfdbfe]">
        {label}
      </div>
    </div>
  );
};

type ProcessCardProps = {
  step: string;
  title: string;
  description: string;
  active?: boolean;
};

const ProcessCard: FC<ProcessCardProps> = ({
  step,
  title,
  description,
  active = false,
}) => {
  return (
    <div className="rounded-3xl border border-(--builder-border) bg-white p-5 shadow-(--builder-shadow)">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-2xl bg-[#eff6ff] text-sm font-black text-(--builder-blue)">
          {step}
        </div>

        <div
          className={
            active
              ? 'rounded-full bg-[#dcfce7] px-3 py-1 text-xs font-black text-[#166534]'
              : 'rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-(--builder-muted-light)'
          }
        >
          {active ? 'Active' : 'Pending'}
        </div>
      </div>

      <h3 className="text-base font-black tracking-[-0.2px] text-[#020617]">
        {title}
      </h3>

      <p className="mt-1.5 text-sm font-semibold leading-6 text-(--builder-muted)">
        {description}
      </p>
    </div>
  );
};