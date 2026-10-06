import { FC, Suspense } from 'react';

import AdminShell from '@/components/layout/AdminShell';
import SubmissionsView from '@/components/submissions/SubmissionsView';
import { LoadingBlock } from '@/components/ui/PageState';

const SubmissionsPage: FC = () => {
  return (
    <AdminShell>
      {/* useSearchParams (the filters in the URL) needs a Suspense boundary */}
      <Suspense fallback={<LoadingBlock label="Loading submissions..." />}>
        <SubmissionsView />
      </Suspense>
    </AdminShell>
  );
};

export default SubmissionsPage;
