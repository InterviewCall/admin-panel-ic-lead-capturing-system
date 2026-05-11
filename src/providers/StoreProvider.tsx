'use client';

import { useState } from 'react';
import { Provider } from 'react-redux';

import type { AppStore } from '@/lib/store';
import { makeStore } from '@/lib/store';

export default function StoreProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [store] = useState<AppStore>(() => makeStore());

  return <Provider store={store}>{children}</Provider>;
}