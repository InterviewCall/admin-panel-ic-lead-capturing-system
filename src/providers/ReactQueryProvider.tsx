'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { FC, ReactNode, useState } from 'react';

type ReactQueryProviderProps = {
  children: ReactNode;
};

const ReactQueryProvider: FC<ReactQueryProviderProps> = ({ children }) => {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
            retry: 1,
          },
          mutations: {
            retry: false,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

export default ReactQueryProvider;