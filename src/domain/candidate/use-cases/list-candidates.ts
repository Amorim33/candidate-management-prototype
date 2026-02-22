import { toCandidateDTO } from '@/domain/candidate/entity';
import { CandidateRepository } from '@/domain/candidate/repository';
import {
  CandidateListQuery,
  CandidateListQuerySchema,
  CandidateListResponse,
} from '@/domain/candidate/schemas';

export function listCandidatesUseCase(
  repository: CandidateRepository,
  query?: CandidateListQuery,
): CandidateListResponse {
  const normalizedQuery = CandidateListQuerySchema.parse(query ?? {});
  const candidates = repository.list(normalizedQuery);
  const items = candidates.map(toCandidateDTO);
  const counts = repository.counts();

  const statusCount = normalizedQuery.status
    ? normalizedQuery.status === 'NEW'
      ? counts.new
      : normalizedQuery.status === 'SHORTLISTED'
        ? counts.shortlisted
        : counts.rejected
    : counts.total;

  return {
    items,
    filteredCount: items.length,
    statusCount,
    availableTags: repository.availableTags(normalizedQuery.status),
    counts,
  };
}
