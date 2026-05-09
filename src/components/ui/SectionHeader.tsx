import { FC } from 'react';

type SectionHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: string;
};

const SectionHeader: FC<SectionHeaderProps> = ({
  eyebrow,
  title,
  description,
}) => {
  return (
    <div>
      {eyebrow && (
        <div className="mb-2 inline-flex rounded-full bg-[#eff6ff] px-3 py-1.5 text-xs font-black text-(--builder-blue-dark)">
          {eyebrow}
        </div>
      )}

      <h2 className="text-2xl font-black tracking-[-0.5px] text-[#020617]">
        {title}
      </h2>

      {description && (
        <p className="mt-1.5 text-sm font-semibold text-(--builder-muted)">
          {description}
        </p>
      )}
    </div>
  );
};

export default SectionHeader;