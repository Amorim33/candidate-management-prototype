import { describe, it, expect } from 'vitest';
import {
  createCandidateEntity,
  applyDecision,
  toCandidateDTO,
} from '@/domain/candidate/entity';

describe('createCandidateEntity', () => {
  it('creates entity with default NEW status when none provided', () => {
    const input = {
      id: '1',
      name: 'Alice',
      role: 'Engineer',
      location: 'Berlin',
      linkedin: 'https://linkedin.com/in/alice',
    };

    const entity = createCandidateEntity(input);

    expect(entity).toEqual({
      id: '1',
      name: 'Alice',
      status: 'NEW',
      role: 'Engineer',
      location: 'Berlin',
      linkedin: 'https://linkedin.com/in/alice',
      reason: undefined,
      decisionDate: undefined,
      tags: undefined,
    });
  });

  it('creates entity with provided status', () => {
    const input = {
      id: '2',
      name: 'Bob',
      role: 'Designer',
      location: 'London',
      linkedin: 'https://linkedin.com/in/bob',
      status: 'SHORTLISTED' as const,
      reason: 'Great portfolio',
      decisionDate: '2025-01-01',
    };

    const entity = createCandidateEntity(input);

    expect(entity.status).toBe('SHORTLISTED');
    expect(entity.reason).toBe('Great portfolio');
    expect(entity.decisionDate).toBe('2025-01-01');
  });
});

describe('applyDecision', () => {
  it('returns a new entity with updated status, reason, and decisionDate', () => {
    const candidate = createCandidateEntity({
      id: '1',
      name: 'Alice',
      role: 'Engineer',
      location: 'Berlin',
      linkedin: 'https://linkedin.com/in/alice',
      tags: ['technical'],
    });

    const updated = applyDecision(candidate, 'SHORTLISTED', 'Strong skills', '2025-06-15');

    expect(updated).toEqual({
      id: '1',
      name: 'Alice',
      status: 'SHORTLISTED',
      role: 'Engineer',
      location: 'Berlin',
      linkedin: 'https://linkedin.com/in/alice',
      reason: 'Strong skills',
      decisionDate: '2025-06-15',
      tags: ['technical'],
    });
  });

  it('does not mutate the original entity', () => {
    const candidate = createCandidateEntity({
      id: '1',
      name: 'Alice',
      role: 'Engineer',
      location: 'Berlin',
      linkedin: '',
    });

    applyDecision(candidate, 'REJECTED', 'Not a fit at this time', '2025-06-15');

    expect(candidate.status).toBe('NEW');
    expect(candidate.reason).toBeUndefined();
  });
});

describe('toCandidateDTO', () => {
  it('maps entity fields to DTO', () => {
    const entity = createCandidateEntity({
      id: '1',
      name: 'Alice',
      role: 'Engineer',
      location: 'Berlin',
      linkedin: 'https://linkedin.com/in/alice',
      status: 'REJECTED',
      reason: 'No match',
      decisionDate: '2025-03-01',
    });

    const dto = toCandidateDTO(entity);

    expect(dto).toEqual({
      id: '1',
      name: 'Alice',
      status: 'REJECTED',
      role: 'Engineer',
      location: 'Berlin',
      linkedin: 'https://linkedin.com/in/alice',
      reason: 'No match',
      decisionDate: '2025-03-01',
      tags: undefined,
    });
  });
});
