import { describe, it, expect, vi } from 'vitest';
import { createCandidateUseCase } from '@/domain/candidate/use-cases/create-candidate';
import { CandidateRepository } from '@/domain/candidate/repository';

function createMockRepository(overrides: Partial<CandidateRepository> = {}): CandidateRepository {
  return {
    list: vi.fn(() => []),
    findById: vi.fn(() => null),
    save: vi.fn(),
    nextId: vi.fn(() => '42'),
    ...overrides,
  };
}

describe('createCandidateUseCase', () => {
  it('creates a candidate with NEW status and saves to repository', () => {
    const repo = createMockRepository();
    const input = { name: 'Alice', linkedin: 'https://linkedin.com/in/alice' };

    const result = createCandidateUseCase(repo, input);

    expect(result).toEqual({
      id: '42',
      name: 'Alice',
      status: 'NEW',
      role: 'New Candidate',
      location: '',
      linkedin: 'https://linkedin.com/in/alice',
      reason: undefined,
      decisionDate: undefined,
      tags: undefined,
    });
    expect(repo.save).toHaveBeenCalledOnce();
  });

  it('creates a candidate with tags', () => {
    const repo = createMockRepository();
    const input = { name: 'Alice', tags: ['frontend', 'senior'] };

    const result = createCandidateUseCase(repo, input);

    expect(result.tags).toEqual(['frontend', 'senior']);
  });

  it('uses empty string for linkedin when not provided', () => {
    const repo = createMockRepository();
    const input = { name: 'Bob' };

    const result = createCandidateUseCase(repo, input);

    expect(result.linkedin).toBe('');
  });

  it('uses the id from repository.nextId', () => {
    const repo = createMockRepository({ nextId: vi.fn(() => 'custom-id') });
    const input = { name: 'Charlie' };

    const result = createCandidateUseCase(repo, input);

    expect(result.id).toBe('custom-id');
    expect(repo.nextId).toHaveBeenCalledOnce();
  });
});
