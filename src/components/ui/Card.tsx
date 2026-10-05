import clsx from 'clsx';
import { FC, ReactNode } from 'react';

type CardProps = {
  className?: string;
  children: ReactNode;
  ariaLabel?: string;
};

const Card: FC<CardProps> = ({ className, children, ariaLabel }) => {
  return (
    <section
      aria-label={ariaLabel}
      className={clsx(
        'rounded-3xl border border-(--builder-border) bg-white shadow-(--builder-shadow)',
        className,
      )}
    >
      {children}
    </section>
  );
};

export default Card;
