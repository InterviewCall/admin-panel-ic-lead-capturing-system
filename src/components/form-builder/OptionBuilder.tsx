'use client';

import { FC, useState } from 'react';

import { FormQuestionOption } from '@/types/formBuilder';

type OptionBuilderProps = {
  options: FormQuestionOption[];
  onChange: (options: FormQuestionOption[]) => void;
};

const OptionBuilder: FC<OptionBuilderProps> = ({ options, onChange }) => {
  const [optionLabel, setOptionLabel] = useState<string>('');
  const [optionValue, setOptionValue] = useState<string>('');
  const [score, setScore] = useState<string>('');

  const addOption = (): void => {
    if (!optionLabel.trim() || !optionValue.trim()) {
      return;
    }

    onChange([
      ...options,
      {
        id: crypto.randomUUID(),
        optionLabel: optionLabel.trim(),
        optionValue: optionValue.trim(),
        score: score ? Number(score) : undefined,
      },
    ]);

    setOptionLabel('');
    setOptionValue('');
    setScore('');
  };

  const removeOption = (id: string): void => {
    onChange(options.filter((option) => option.id !== id));
  };

  return (
    <div className="rounded-2xl border border-dashed border-(--builder-border) bg-[#f8fafc] p-4">
      <div className="mb-4">
        <h3 className="text-base font-black text-[#020617]">
          Question Options
        </h3>
        <p className="text-sm font-semibold text-(--builder-muted)">
          Add options for radio, select, or checkbox questions.
        </p>
      </div>

      <div className="grid grid-cols-[1fr_1fr_120px_auto] gap-3 max-lg:grid-cols-1">
        <input
          value={optionLabel}
          onChange={(event) => setOptionLabel(event.target.value)}
          className="input input-bordered input-primary min-h-12 rounded-[13px] bg-white"
          placeholder="Option label"
        />

        <input
          value={optionValue}
          onChange={(event) => setOptionValue(event.target.value)}
          className="input input-bordered input-primary min-h-12 rounded-[13px] bg-white"
          placeholder="option_value"
        />

        <input
          value={score}
          onChange={(event) => setScore(event.target.value)}
          type="number"
          className="input input-bordered input-primary min-h-12 rounded-[13px] bg-white"
          placeholder="Score"
        />

        <button
          type="button"
          onClick={addOption}
          className="btn btn-primary min-h-12 rounded-[13px] font-black text-white"
        >
          Add
        </button>
      </div>

      {options.length > 0 && (
        <div className="mt-4 grid gap-2">
          {options.map((option) => (
            <div
              key={option.id}
              className="flex items-center justify-between gap-3 rounded-2xl border border-(--builder-border) bg-white p-3"
            >
              <div>
                <div className="font-black text-[#020617]">
                  {option.optionLabel}
                </div>
                <div className="text-xs font-bold text-(--builder-muted-light)">
                  {option.optionValue}
                  {typeof option.score === 'number' && (
                    <span> · Score: {option.score}</span>
                  )}
                </div>
              </div>

              <button
                type="button"
                onClick={() => removeOption(option.id)}
                className="btn btn-sm btn-error rounded-full text-white"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OptionBuilder;