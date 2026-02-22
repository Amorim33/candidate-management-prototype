import { describe, it, expect, vi } from 'vitest';
import { decideCandidateUseCase } from '@/domain/candidate/use-cases/decide-candidate';
import { CandidateRepository } from '@/domain/candidate/repository';
import { CandidateEntity } from '@/domain/candidate/entity';
import { DomainError } from '@/domain/candidate/errors';

function createMockRepository(overrides: Partial<CandidateRepository> = {}): CandidateRepository {
  return {
    list: vi.fn(() => []),
    findById: vi.fn(() => null),
    save: vi.fn(),
    nextId: vi.fn(() => '1'),
    counts: vi.fn(() => ({ total: 0, new: 0, shortlisted: 0, rejected: 0 })),
    availableTags: vi.fn(() => []),
    ...overrides,
  };
}

function newCandidate(overrides: Partial<CandidateEntity> = {}): CandidateEntity {
  return {
    id: '1',
    name: 'Alice',
    status: 'NEW',
    role: 'Engineer',
    location: 'Berlin',
    linkedin: 'https://linkedin.com/in/alice',
    ...overrides,
  };
}

describe('decideCandidateUseCase', () => {
  it('shortlists a NEW candidate', () => {
    const candidate = newCandidate();
    const repo = createMockRepository({ findById: vi.fn(() => candidate) });
    const input = { decision: 'SHORTLIST' as const, reason: 'Excellent technical skills' };

    const result = decideCandidateUseCase(repo, '1', input);

    expect(result.status).toBe('SHORTLISTED');
    expect(result.reason).toBe('Excellent technical skills');
    expect(result.decisionDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(result.tags).toBeUndefined();
    expect(repo.save).toHaveBeenCalledOnce();
  });

  it('preserves existing tags when applying a decision', () => {
    const candidate = newCandidate({ tags: ['technical', 'culture-fit'] });
    const repo = createMockRepository({ findById: vi.fn(() => candidate) });
    const input = {
      decision: 'SHORTLIST' as const,
      reason: 'Excellent technical skills',
    };

    const result = decideCandidateUseCase(repo, '1', input);

    expect(result.status).toBe('SHORTLISTED');
    expect(result.tags).toEqual(['technical', 'culture-fit']);
  });

  it('rejects a NEW candidate', () => {
    const candidate = newCandidate();
    const repo = createMockRepository({ findById: vi.fn(() => candidate) });
    const input = { decision: 'REJECT' as const, reason: 'Not a good fit for the role' };

    const result = decideCandidateUseCase(repo, '1', input);

    expect(result.status).toBe('REJECTED');
    expect(result.reason).toBe('Not a good fit for the role');
  });

  it('throws NOT_FOUND when candidate does not exist', () => {
    const repo = createMockRepository({ findById: vi.fn(() => null) });
    const input = { decision: 'SHORTLIST' as const, reason: 'Excellent technical skills' };

    expect(() => decideCandidateUseCase(repo, 'non-existent', input)).toThrow(DomainError);
    expect(() => decideCandidateUseCase(repo, 'non-existent', input)).toThrow(
      'Candidate not found',
    );
  });

  it('throws INVALID_TRANSITION when shortlisting an already SHORTLISTED candidate', () => {
    const candidate = newCandidate({ status: 'SHORTLISTED' });
    const repo = createMockRepository({ findById: vi.fn(() => candidate) });
    const input = { decision: 'SHORTLIST' as const, reason: 'Want to shortlist again' };

    expect(() => decideCandidateUseCase(repo, '1', input)).toThrow(
      'Candidate is already SHORTLISTED',
    );
  });

  it('throws VALIDATION when reason is too short', () => {
    const candidate = newCandidate();
    const repo = createMockRepository({ findById: vi.fn(() => candidate) });
    const input = { decision: 'SHORTLIST' as const, reason: 'short' };

    expect(() => decideCandidateUseCase(repo, '1', input)).toThrow(
      'Reason must be at least 10 characters',
    );
  });

  it('trims the reason before saving', () => {
    const candidate = newCandidate();
    const repo = createMockRepository({ findById: vi.fn(() => candidate) });
    const input = { decision: 'REJECT' as const, reason: '   Not a good fit for the role   ' };

    const result = decideCandidateUseCase(repo, '1', input);

    expect(result.reason).toBe('Not a good fit for the role');
  });
});
