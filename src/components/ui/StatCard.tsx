import { FC } from 'react';

import Card from '@/components/ui/Card';

type StatCardProps = {
  label: string;
  value: string;
  note: string;
};

const StatCard: FC<StatCardProps> = ({ label, value, note }) => {
  return (
    <Card className="px-5.5 py-5">
      <div className="text-[13px] font-bold text-(--builder-muted)">{label}</div>
      <div className="mt-1.5 text-[34px] font-black tracking-[-1px] text-[#020617]">
        {value}
      </div>
      <div className="mt-0.5 text-[13px] font-semibold text-(--builder-muted-light)">
        {note}
      </div>
    </Card>
  );
};

export default StatCard;
