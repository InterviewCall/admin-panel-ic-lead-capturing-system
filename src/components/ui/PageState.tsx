import { FC, ReactNode } from 'react';

type LoadingBlockProps = {
  label?: string;
};

export const LoadingBlock: FC<LoadingBlockProps> = ({ label = 'Loading...' }) => {
  return (
    <div
      role="status"
      className="flex items-center justify-center gap-3 px-5 py-16 text-sm font-bold text-(--builder-muted)"
    >
      <span className="loading loading-spinner loading-md" />
      {label}
    </div>
  );
};

type MessageBlockProps = {
  title: string;
  description?: string;
  action?: ReactNode;
};

export const MessageBlock: FC<MessageBlockProps> = ({ title, description, action }) => {
  return (
    <div className="px-5 py-14 text-center">
      <div className="text-base font-black text-[#020617]">{title}</div>
      {description && (
        <p className="mx-auto mt-1.5 max-w-md text-sm font-semibold text-(--builder-muted)">
          {description}
        </p>
      )}
      {action && <div className="mt-4 flex justify-center">{action}</div>}
    </div>
  );
};
