import {
  CandidateEntity,
  createCandidateEntity,
} from '@/domain/candidate/entity';
import { CandidateRepository } from '@/domain/candidate/repository';
import {
  CandidateCounts,
  CandidateListQuery,
  CandidateStatus,
} from '@/domain/candidate/schemas';

function cloneCandidate(candidate: CandidateEntity): CandidateEntity {
  return {
    ...candidate,
    tags: candidate.tags ? [...candidate.tags] : undefined,
  };
}

function parseCandidateId(id: string): number | null {
  const raw = id.split('_')[1];
  const parsed = Number.parseInt(raw, 10);
  return Number.isNaN(parsed) ? null : parsed;
}

function candidateIdValue(candidate: CandidateEntity): number {
  return parseCandidateId(candidate.id) ?? 0;
}

function candidateDecisionDateValue(candidate: CandidateEntity): number {
  if (!candidate.decisionDate) {
    return 0;
  }

  const parsed = Date.parse(`${candidate.decisionDate}T00:00:00Z`);
  return Number.isNaN(parsed) ? 0 : parsed;
}

function applyStatusFilter(
  candidates: CandidateEntity[],
  status?: CandidateStatus,
): CandidateEntity[] {
  if (!status) {
    return candidates;
  }

  return candidates.filter(candidate => candidate.status === status);
}

function applySearchFilter(
  candidates: CandidateEntity[],
  search?: string,
): CandidateEntity[] {
  if (!search) {
    return candidates;
  }

  const normalizedSearch = search.toLowerCase();
  return candidates.filter(candidate => (
    candidate.name.toLowerCase().includes(normalizedSearch)
    || candidate.role.toLowerCase().includes(normalizedSearch)
    || candidate.location.toLowerCase().includes(normalizedSearch)
  ));
}

function applyTagsFilter(
  candidates: CandidateEntity[],
  tags?: string[],
): CandidateEntity[] {
  if (!tags || tags.length === 0) {
    return candidates;
  }

  const activeTags = new Set(tags);
  return candidates.filter(candidate => candidate.tags?.some(tag => activeTags.has(tag)));
}

function sortCandidates(
  candidates: CandidateEntity[],
  query: CandidateListQuery,
): CandidateEntity[] {
  const next = [...candidates];

  if (query.sort === 'name-az') {
    next.sort((a, b) => a.name.localeCompare(b.name));
    return next;
  }

  const sortByDecisionDate = query.status === 'SHORTLISTED' || query.status === 'REJECTED';

  if (query.sort === 'newest') {
    next.sort((a, b) => {
      if (sortByDecisionDate) {
        const dateDiff = candidateDecisionDateValue(b) - candidateDecisionDateValue(a);
        if (dateDiff !== 0) {
          return dateDiff;
        }
      }

      return candidateIdValue(b) - candidateIdValue(a);
    });
    return next;
  }

  next.sort((a, b) => {
    if (sortByDecisionDate) {
      const dateDiff = candidateDecisionDateValue(a) - candidateDecisionDateValue(b);
      if (dateDiff !== 0) {
        return dateDiff;
      }
    }

    return candidateIdValue(a) - candidateIdValue(b);
  });

  return next;
}

class InMemoryCandidateRepository implements CandidateRepository {
  private store = new Map<string, CandidateEntity>();
  private nextIdNumber = 1;

  list(query?: CandidateListQuery): CandidateEntity[] {
    const normalizedQuery: CandidateListQuery = query ?? { sort: 'newest' };
    const candidates = Array.from(this.store.values(), cloneCandidate);
    const statusFiltered = applyStatusFilter(candidates, normalizedQuery.status);
    const searchFiltered = applySearchFilter(statusFiltered, normalizedQuery.search);
    const tagsFiltered = applyTagsFilter(searchFiltered, normalizedQuery.tags);
    return sortCandidates(tagsFiltered, normalizedQuery);
  }

  findById(id: string): CandidateEntity | null {
    const candidate = this.store.get(id);
    return candidate ? cloneCandidate(candidate) : null;
  }

  save(candidate: CandidateEntity): void {
    const parsedId = parseCandidateId(candidate.id);
    if (parsedId !== null && parsedId >= this.nextIdNumber) {
      this.nextIdNumber = parsedId + 1;
    }

    this.store.set(candidate.id, cloneCandidate(candidate));
  }

  nextId(): string {
    const id = `c_${this.nextIdNumber}`;
    this.nextIdNumber += 1;
    return id;
  }

  counts(): CandidateCounts {
    const counts: CandidateCounts = {
      total: 0,
      new: 0,
      shortlisted: 0,
      rejected: 0,
    };

    for (const candidate of this.store.values()) {
      counts.total += 1;

      if (candidate.status === 'NEW') {
        counts.new += 1;
      } else if (candidate.status === 'SHORTLISTED') {
        counts.shortlisted += 1;
      } else {
        counts.rejected += 1;
      }
    }

    return counts;
  }

  availableTags(status?: CandidateStatus): string[] {
    const tagSet = new Set<string>();

    for (const candidate of this.store.values()) {
      if (status && candidate.status !== status) {
        continue;
      }

      for (const tag of candidate.tags ?? []) {
        tagSet.add(tag);
      }
    }

    return Array.from(tagSet).sort((a, b) => a.localeCompare(b));
  }

  reset(): void {
    this.store.clear();
    this.nextIdNumber = 1;
  }
}

// Demo-only in-memory singleton. Production deployments should use persistent storage.
const repository = new InMemoryCandidateRepository();

function seedRepository() {
  // 4 NEW candidates
  repository.save(
    createCandidateEntity({
      id: 'c_1',
      name: 'Maria Santos',
      role: 'Senior Frontend Engineer',
      location: 'Lisbon, Portugal',
      linkedin: 'linkedin.com/in/msantos',
      tags: ['senior', 'frontend'],
    }),
  );

  repository.save(
    createCandidateEntity({
      id: 'c_2',
      name: 'João Pereira',
      role: 'Backend Developer',
      location: 'Porto, Portugal',
      linkedin: 'linkedin.com/in/jpereira',
      tags: ['backend', 'remote'],
    }),
  );

  repository.save(
    createCandidateEntity({
      id: 'c_3',
      name: 'Ana Costa',
      role: 'Product Designer',
      location: 'São Paulo, Brazil',
      linkedin: 'linkedin.com/in/acosta',
      tags: ['design', 'senior'],
    }),
  );

  repository.save(
    createCandidateEntity({
      id: 'c_4',
      name: 'Carlos Fernandez',
      role: 'Full Stack Engineer',
      location: 'Barcelona, Spain',
      linkedin: 'linkedin.com/in/cfernandez',
      tags: ['frontend', 'backend'],
    }),
  );

  // 3 SHORTLISTED candidates
  repository.save(
    createCandidateEntity({
      id: 'c_5',
      name: 'Lucas Ferreira',
      role: 'DevOps Engineer',
      location: 'Rio de Janeiro, Brazil',
      linkedin: 'linkedin.com/in/lferreira',
      status: 'SHORTLISTED',
      reason: 'Strong infrastructure background, great culture fit and technical depth.',
      decisionDate: '2026-02-18',
      tags: ['devops', 'infrastructure'],
    }),
  );

  repository.save(
    createCandidateEntity({
      id: 'c_6',
      name: 'Isabella Silva',
      role: 'UX Researcher',
      location: 'Curitiba, Brazil',
      linkedin: 'linkedin.com/in/isilva',
      status: 'SHORTLISTED',
      reason:
        'Outstanding user research methodology. Proven ability to drive product decisions with data.',
      decisionDate: '2026-02-15',
      tags: ['design', 'research'],
    }),
  );

  repository.save(
    createCandidateEntity({
      id: 'c_7',
      name: 'Diego Morales',
      role: 'Senior Backend Engineer',
      location: 'Buenos Aires, Argentina',
      linkedin: 'linkedin.com/in/dmorales',
      status: 'SHORTLISTED',
      reason:
        'Impressive distributed systems experience. Strong leadership and mentoring track record.',
      decisionDate: '2026-02-12',
      tags: ['senior', 'backend'],
    }),
  );

  // 2 REJECTED candidates
  repository.save(
    createCandidateEntity({
      id: 'c_8',
      name: 'Ricardo Torres',
      role: 'QA Engineer',
      location: 'Madrid, Spain',
      linkedin: 'linkedin.com/in/rtorres',
      status: 'REJECTED',
      reason: 'Insufficient experience with automated testing frameworks.',
      decisionDate: '2026-02-16',
      tags: ['qa', 'junior'],
    }),
  );

  repository.save(
    createCandidateEntity({
      id: 'c_9',
      name: 'Patricia Mendes',
      role: 'Junior Developer',
      location: 'Braga, Portugal',
      linkedin: 'linkedin.com/in/pmendes',
      status: 'REJECTED',
      reason:
        'Role requires 3+ years experience. Candidate has less than 1 year of professional experience.',
      decisionDate: '2026-02-10',
      tags: ['junior', 'frontend'],
    }),
  );
}

seedRepository();

export function resetStorage() {
  repository.reset();
  seedRepository();
}

export const candidateRepository: CandidateRepository = repository;
