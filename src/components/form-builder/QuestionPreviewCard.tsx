'use client';

import { FC } from 'react';

import { QualificationFormDraft } from '@/types/formBuilder';

type QuestionPreviewCardProps = {
  draft: QualificationFormDraft;
};

const QuestionPreviewCard: FC<QuestionPreviewCardProps> = ({ draft }) => {
  return (
    <section className="overflow-hidden rounded-3xl border border-[#1e293b] bg-[#0f172a] text-white shadow-[0_28px_80px_rgba(15,23,42,0.22)]">
      <div className="border-b border-white/10 p-6">
        <div className="mb-2 inline-flex rounded-full bg-white/10 px-3 py-1.5 text-xs font-black text-[#dbeafe]">
          Live Draft Preview
        </div>

        <h2 className="text-2xl font-black tracking-[-0.5px] text-white">
          Payload Preview
        </h2>

        <p className="mt-1.5 text-sm font-semibold text-[#cbd5e1]">
          This object will later be submitted to the backend API.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 border-b border-white/10 p-5">
        <PreviewStat label="Form" value={draft.name ? 'Ready' : 'Missing'} />
        <PreviewStat label="Questions" value={String(draft.questions.length)} />
      </div>

      <div className="p-4">
        <pre className="max-h-155 overflow-auto rounded-2xl bg-[#020617] p-4 text-xs leading-6 text-[#dbeafe]">
          {JSON.stringify(draft, null, 2)}
        </pre>
      </div>
    </section>
  );
};

export default QuestionPreviewCard;

type PreviewStatProps = {
  label: string;
  value: string;
};

const PreviewStat: FC<PreviewStatProps> = ({ label, value }) => {
  return (
    <div className="rounded-2xl bg-white/5 p-4">
      <div className="text-xs font-black uppercase tracking-[0.12em] text-[#93c5fd]">
        {label}
      </div>

      <div className="mt-1 text-lg font-black text-white">
        {value}
      </div>
    </div>
  );
};