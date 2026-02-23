import 'server-only';

import { candidateRepository } from '@/data/storage';
import {
  CandidateCounts,
  CandidateListQuery,
  CandidateListResponse,
} from '@/domain/candidate/schemas';
import { listCandidatesUseCase } from '@/domain/candidate/use-cases/list-candidates';

const EMPTY_COUNTS: CandidateCounts = {
  total: 0,
  new: 0,
  shortlisted: 0,
  rejected: 0,
};

function statusCountForQuery(
  counts: CandidateCounts,
  status?: CandidateListQuery['status'],
): number {
  switch (status) {
    case undefined:
      return counts.total;
    case 'NEW':
      return counts.new;
    case 'SHORTLISTED':
      return counts.shortlisted;
    case 'REJECTED':
      return counts.rejected;
    default: {
      const exhaustiveCheck: never = status;
      throw new Error(`Unexpected status in statusCountForQuery: ${exhaustiveCheck}`);
    }
  }
}

function emptyListResponse(query: CandidateListQuery): CandidateListResponse {
  const counts = EMPTY_COUNTS;

  return {
    items: [],
    filteredCount: 0,
    statusCount: statusCountForQuery(counts, query.status),
    availableTags: [],
    counts,
  };
}

export function getServerCandidateCounts(): CandidateCounts {
  try {
    return candidateRepository.counts();
  } catch (cause) {
    console.error('Failed to read candidate counts on server render', cause);
    return EMPTY_COUNTS;
  }
}

export function getServerCandidateList(query: CandidateListQuery): CandidateListResponse {
  try {
    return listCandidatesUseCase(candidateRepository, query);
  } catch (cause) {
    console.error('Failed to read candidate list on server render', cause);
    return emptyListResponse(query);
  }
}
