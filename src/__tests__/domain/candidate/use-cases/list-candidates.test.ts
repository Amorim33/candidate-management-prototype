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
    counts: vi.fn(() => ({
      total: 0,
      new: 0,
      shortlisted: 0,
      rejected: 0,
    })),
    availableTags: vi.fn(() => []),
    ...overrides,
  };
}

describe('listCandidatesUseCase', () => {
  it('returns response envelope with default newest sort', () => {
    const repo = createMockRepository({ list: vi.fn(() => []) });

    const result = listCandidatesUseCase(repo);

    expect(repo.list).toHaveBeenCalledWith(expect.objectContaining({ sort: 'newest' }));
    expect(result).toEqual({
      items: [],
      filteredCount: 0,
      statusCount: 0,
      availableTags: [],
      counts: {
        total: 0,
        new: 0,
        shortlisted: 0,
        rejected: 0,
      },
    });
  });

  it('returns DTOs and metadata for filtered queries', () => {
    const candidates: CandidateEntity[] = [
      {
        id: 'c_7',
        name: 'Diego',
        status: 'SHORTLISTED',
        role: 'Backend Engineer',
        location: 'Buenos Aires',
        linkedin: 'https://linkedin.com/in/diego',
        reason: 'Strong systems background',
        decisionDate: '2026-02-12',
        tags: ['backend'],
      },
    ];

    const repo = createMockRepository({
      list: vi.fn(() => candidates),
      counts: vi.fn(() => ({ total: 9, new: 4, shortlisted: 3, rejected: 2 })),
      availableTags: vi.fn(() => ['backend', 'design', 'devops']),
    });

    const result = listCandidatesUseCase(repo, {
      status: 'SHORTLISTED',
      search: 'engineer',
      tags: ['backend', 'devops'],
      sort: 'name-az',
    });

    expect(repo.list).toHaveBeenCalledWith({
      status: 'SHORTLISTED',
      search: 'engineer',
      tags: ['backend', 'devops'],
      sort: 'name-az',
    });
    expect(repo.availableTags).toHaveBeenCalledWith('SHORTLISTED');

    expect(result.items).toHaveLength(1);
    expect(result.items[0]).toMatchObject({
      id: 'c_7',
      name: 'Diego',
      status: 'SHORTLISTED',
    });
    expect(result.filteredCount).toBe(1);
    expect(result.statusCount).toBe(3);
    expect(result.availableTags).toEqual(['backend', 'design', 'devops']);
    expect(result.counts).toEqual({ total: 9, new: 4, shortlisted: 3, rejected: 2 });
  });

  it('uses total as statusCount when status filter is omitted', () => {
    const repo = createMockRepository({
      counts: vi.fn(() => ({ total: 9, new: 4, shortlisted: 3, rejected: 2 })),
    });

    const result = listCandidatesUseCase(repo, {
      sort: 'oldest',
    });

    expect(result.statusCount).toBe(9);
  });
});
