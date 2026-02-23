import CandidateListPage from '@/components/CandidateListPage';
import { buildCandidateListQueryKey } from '@/domain/candidate/lib/query-key';
import { getServerCandidateList } from '@/app/live-session/server-data';

const INITIAL_REJECTED_QUERY = {
  status: 'REJECTED',
  sort: 'newest',
} as const;

export default function RejectedPage() {
  const initialData = getServerCandidateList(INITIAL_REJECTED_QUERY);
  const initialQueryKey = buildCandidateListQueryKey({
    status: INITIAL_REJECTED_QUERY.status,
    sort: INITIAL_REJECTED_QUERY.sort,
  });

  return (
    <CandidateListPage
      status="REJECTED"
      title="Rejected Candidates"
      countVariant="rejected"
      countSuffix="rejected"
      searchPlaceholder="Search rejected..."
      emptyMessage="No rejected candidates found."
      initialData={initialData}
      initialQueryKey={initialQueryKey}
    />
  );
}
