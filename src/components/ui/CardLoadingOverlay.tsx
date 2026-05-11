import { FC } from 'react';

type CardLoadingOverlayProps = {
  title?: string;
  description?: string;
};

const CardLoadingOverlay: FC<CardLoadingOverlayProps> = ({
  title = 'Processing...',
  description = 'Please wait while we complete this action.',
}) => {
  return (
    <div className="absolute inset-0 z-20 flex items-center justify-center bg-white/75 backdrop-blur-[2px]">
      <div className="flex flex-col items-center rounded-3xl border border-(--builder-border) bg-white px-8 py-6 shadow-[0_24px_70px_rgba(15,23,42,0.14)]">
        <span className="loading loading-spinner loading-lg text-primary" />

        <p className="mt-4 text-sm font-black text-[#020617]">
          {title}
        </p>

        <p className="mt-1 max-w-64 text-center text-xs font-semibold text-(--builder-muted)">
          {description}
        </p>
      </div>
    </div>
  );
};

export default CardLoadingOverlay;