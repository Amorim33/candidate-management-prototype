import NewCandidatesPageClient from '@/components/NewCandidatesPage';
import { buildCandidateListQueryKey } from '@/domain/candidate/lib/query-key';
import { getServerCandidateList } from '@/app/live-session/server-data';

const INITIAL_NEW_QUERY = {
  status: 'NEW',
  sort: 'name-az',
} as const;

export default function NewCandidatesPage() {
  const initialData = getServerCandidateList(INITIAL_NEW_QUERY);
  const initialQueryKey = buildCandidateListQueryKey({
    status: INITIAL_NEW_QUERY.status,
    sort: INITIAL_NEW_QUERY.sort,
  });

  return (
    <NewCandidatesPageClient
      initialData={initialData}
      initialQueryKey={initialQueryKey}
    />
  );
}
