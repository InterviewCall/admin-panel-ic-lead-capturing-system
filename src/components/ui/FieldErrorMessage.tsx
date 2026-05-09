import { FC } from 'react';

type FieldErrorMessageProps = {
  message?: string;
};

const FieldErrorMessage: FC<FieldErrorMessageProps> = ({ message }) => {
  if (!message) {
    return null;
  }

  return (
    <p className="mt-1.5 text-sm font-bold text-error">
      {message}
    </p>
  );
};

export default FieldErrorMessage;