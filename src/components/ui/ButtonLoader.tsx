import { FC, ReactNode } from 'react';

type ButtonLoaderProps = {
  isLoading: boolean;
  loadingText?: string;
  children: ReactNode;
};

const ButtonLoader: FC<ButtonLoaderProps> = ({
  isLoading,
  loadingText = 'Processing...',
  children,
}) => {
  if (isLoading) {
    return (
      <span className="flex items-center gap-2">
        <span className="loading loading-spinner loading-sm" />
        {loadingText}
      </span>
    );
  }

  return <>{children}</>;
};

export default ButtonLoader;