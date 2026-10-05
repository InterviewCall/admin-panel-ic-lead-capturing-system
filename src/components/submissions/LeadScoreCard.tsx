import { FC } from 'react';

import Card from '@/components/ui/Card';
import Pill from '@/components/ui/Pill';
import { HOT_SCORE_THRESHOLD, TEMPERATURE_META, WARM_SCORE_THRESHOLD } from '@/constants/adminStatus';
import { LeadTemperature } from '@/types/submission';

type LeadScoreCardProps = {
  score: number | null;
  temperature: LeadTemperature | null;
  scoredQuestionCount: number;
};

const LeadScoreCard: FC<LeadScoreCardProps> = ({ score, temperature, scoredQuestionCount }) => {
  const meta = temperature ? TEMPERATURE_META[temperature] : null;

  return (
    <Card className="p-5.5">
      <div className="flex items-center justify-between">
        <h2 className="text-[13px] font-black uppercase tracking-[0.4px] text-(--builder-muted)">Lead score</h2>
        {meta && (
          <Pill size="md" className={meta.pillClassName}>
            {meta.label}
          </Pill>
        )}
      </div>

      {score === null || !meta ? (
        <p className="mt-3 text-sm font-semibold text-(--builder-muted)">
          Not scored yet. The candidate left the form before submitting.
        </p>
      ) : (
        <>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-[56px] font-black leading-none tracking-[-2px]">{score}</span>
            <span className="text-lg font-bold text-(--builder-muted-light)">/ 100</span>
          </div>

          <div className="relative mt-4.5 h-2.5 rounded-full bg-slate-200">
            <div className={`absolute left-0 top-0 h-2.5 rounded-full ${meta.barClassName}`} style={{ width: `${score}%` }} />
            <div className="absolute -top-1 h-4.5 w-0.5 bg-slate-400" style={{ left: `${WARM_SCORE_THRESHOLD}%` }} />
            <div className="absolute -top-1 h-4.5 w-0.5 bg-slate-400" style={{ left: `${HOT_SCORE_THRESHOLD}%` }} />
          </div>

          <div className="relative mt-1.5 h-4.5 text-xs font-bold text-(--builder-muted-light)">
            <span className="absolute left-0">Cold</span>
            <span className="absolute -translate-x-1/2" style={{ left: `${WARM_SCORE_THRESHOLD}%` }}>
              Warm {WARM_SCORE_THRESHOLD}
            </span>
            <span className="absolute -translate-x-1/2" style={{ left: `${HOT_SCORE_THRESHOLD}%` }}>
              Hot {HOT_SCORE_THRESHOLD}
            </span>
          </div>

          <p className="mt-3 text-[13px] font-medium text-(--builder-muted)">
            Sum of option scores from {scoredQuestionCount} scored questions. Unscored questions are marked in the answers.
          </p>
        </>
      )}
    </Card>
  );
};

export default LeadScoreCard;
