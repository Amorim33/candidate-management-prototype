import { describe, it, expect, vi } from 'vitest';
import { listCandidatesUseCase } from '@/domain/candidate/use-cases/list-candidates';
import { CandidateRepository } from '@/domain/candidate/repository';
import { CandidateEntity } from '@/domain/candidate/entity';

function createMockRepository(overrides: Partial<CandidateRepository> = {}): CandidateRepository {
  return {
    list: vi.fn(() => []),
    findById: vi.fn(() => null),
    save: vi.fn(),
    nextId: vi.fn(() => '1'),
    ...overrides,
  };
}

describe('listCandidatesUseCase', () => {
  it('returns empty array when no candidates exist', () => {
    const repo = createMockRepository({ list: vi.fn(() => []) });

    const result = listCandidatesUseCase(repo);

    expect(result).toEqual([]);
  });

  it('returns DTOs for all candidates in repository', () => {
    const candidates: CandidateEntity[] = [
      {
        id: '1',
        name: 'Alice',
        status: 'NEW',
        role: 'Engineer',
        location: 'Berlin',
        linkedin: 'https://linkedin.com/in/alice',
      },
      {
        id: '2',
        name: 'Bob',
        status: 'SHORTLISTED',
        role: 'Designer',
        location: 'London',
        linkedin: 'https://linkedin.com/in/bob',
        reason: 'Great portfolio',
        decisionDate: '2025-01-01',
      },
    ];
    const repo = createMockRepository({ list: vi.fn(() => candidates) });

    const result = listCandidatesUseCase(repo);

    expect(result).toHaveLength(2);
    expect(result[0].id).toBe('1');
    expect(result[1].id).toBe('2');
    expect(result[1].status).toBe('SHORTLISTED');
  });
});
