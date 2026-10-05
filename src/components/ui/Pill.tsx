import clsx from 'clsx';
import { FC, ReactNode } from 'react';

type PillProps = {
  className: string;
  children: ReactNode;
  size?: 'sm' | 'md';
};

const Pill: FC<PillProps> = ({ className, children, size = 'sm' }) => {
  return (
    <span
      className={clsx(
        'inline-flex items-center whitespace-nowrap rounded-full font-black',
        size === 'sm' ? 'px-2.5 py-0.5 text-xs' : 'px-3 py-1 text-[13px]',
        className,
      )}
    >
      {children}
    </span>
  );
};

export default Pill;
