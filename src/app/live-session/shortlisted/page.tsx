import CandidateListPage from '@/components/CandidateListPage';
import { buildCandidateListQueryKey } from '@/domain/candidate/lib/query-key';
import { getServerCandidateList } from '@/app/live-session/server-data';

const INITIAL_SHORTLISTED_QUERY = {
  status: 'SHORTLISTED',
  sort: 'newest',
} as const;

export default function ShortlistedPage() {
  const initialData = getServerCandidateList(INITIAL_SHORTLISTED_QUERY);
  const initialQueryKey = buildCandidateListQueryKey({
    status: INITIAL_SHORTLISTED_QUERY.status,
    sort: INITIAL_SHORTLISTED_QUERY.sort,
  });

  return (
    <CandidateListPage
      status="SHORTLISTED"
      title="Shortlisted Candidates"
      countVariant="shortlisted"
      countSuffix="shortlisted"
      searchPlaceholder="Search shortlisted..."
      emptyMessage="No shortlisted candidates found."
      initialData={initialData}
      initialQueryKey={initialQueryKey}
    />
  );
}
