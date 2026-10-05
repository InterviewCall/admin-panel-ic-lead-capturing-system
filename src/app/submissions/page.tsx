import { FC } from 'react';

import AdminShell from '@/components/layout/AdminShell';
import SubmissionsView from '@/components/submissions/SubmissionsView';

const SubmissionsPage: FC = () => {
  return (
    <AdminShell>
      <SubmissionsView />
    </AdminShell>
  );
};

export default SubmissionsPage;
