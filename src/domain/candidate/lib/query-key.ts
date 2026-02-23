import {
  CandidateListSort,
  CandidateStatus,
} from '@/domain/candidate/schemas';

interface CandidateListQueryKeyInput {
  status?: CandidateStatus;
  search?: string;
  tags?: Iterable<string>;
  sort: CandidateListSort;
}

export function normalizeCandidateSearch(search?: string): string {
  if (!search) {
    return '';
  }

  return search.trim();
}

export function normalizeCandidateTags(tags?: Iterable<string>): string[] {
  if (!tags) {
    return [];
  }

  return Array.from(tags)
    .map(tag => tag.trim().toLowerCase())
    .filter(Boolean)
    .sort((a, b) => a.localeCompare(b));
}

export function buildCandidateListQueryKey({
  status,
  search,
  tags,
  sort,
}: CandidateListQueryKeyInput): string {
  const normalizedSearch = normalizeCandidateSearch(search);
  const normalizedTags = normalizeCandidateTags(tags).join(',');
  const normalizedStatus = status ?? '';

  return `${normalizedStatus}|${normalizedSearch}|${normalizedTags}|${sort}`;
}
