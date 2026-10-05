import AdminShell from '@/components/layout/AdminShell';
import SubmissionDetailView from '@/components/submissions/SubmissionDetailView';

type SubmissionDetailPageProps = {
  params: Promise<{ submissionId: string }>;
};

const SubmissionDetailPage = async ({ params }: SubmissionDetailPageProps) => {
  const { submissionId } = await params;

  return (
    <AdminShell>
      <SubmissionDetailView submissionId={submissionId} />
    </AdminShell>
  );
};

export default SubmissionDetailPage;
