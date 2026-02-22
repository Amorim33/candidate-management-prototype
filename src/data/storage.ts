import {
  CandidateEntity,
  createCandidateEntity,
} from '@/domain/candidate/entity';
import { CandidateRepository } from '@/domain/candidate/repository';

function cloneCandidate(candidate: CandidateEntity): CandidateEntity {
  return { ...candidate };
}

function parseCandidateId(id: string): number | null {
  const raw = id.split('_')[1];
  const parsed = Number.parseInt(raw, 10);
  return Number.isNaN(parsed) ? null : parsed;
}

class InMemoryCandidateRepository implements CandidateRepository {
  private store = new Map<string, CandidateEntity>();
  private nextIdNumber = 1;

  list(): CandidateEntity[] {
    return Array.from(this.store.values(), cloneCandidate);
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

  seed(candidate: CandidateEntity): void {
    this.save(candidate);
  }

  reset(): void {
    this.store.clear();
    this.nextIdNumber = 1;
  }
}

const repository = new InMemoryCandidateRepository();

function seedRepository() {
  // 4 NEW candidates
  repository.seed(
    createCandidateEntity({
      id: 'c_1',
      name: 'Maria Santos',
      role: 'Senior Frontend Engineer',
      location: 'Lisbon, Portugal',
      linkedin: 'linkedin.com/in/msantos',
      tags: ['senior', 'frontend'],
    }),
  );

  repository.seed(
    createCandidateEntity({
      id: 'c_2',
      name: 'João Pereira',
      role: 'Backend Developer',
      location: 'Porto, Portugal',
      linkedin: 'linkedin.com/in/jpereira',
      tags: ['backend', 'remote'],
    }),
  );

  repository.seed(
    createCandidateEntity({
      id: 'c_3',
      name: 'Ana Costa',
      role: 'Product Designer',
      location: 'São Paulo, Brazil',
      linkedin: 'linkedin.com/in/acosta',
      tags: ['design', 'senior'],
    }),
  );

  repository.seed(
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
  repository.seed(
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

  repository.seed(
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

  repository.seed(
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
  repository.seed(
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

  repository.seed(
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
