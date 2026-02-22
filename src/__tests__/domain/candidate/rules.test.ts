import { describe, it, expect } from 'vitest';
import {
  validateDecisionReason,
  assertDecisionTransitionAllowed,
  decisionToStatus,
  MIN_DECISION_REASON_LENGTH,
} from '@/domain/candidate/rules';
import { DomainError } from '@/domain/candidate/errors';

describe('validateDecisionReason', () => {
  it('returns trimmed reason when valid', () => {
    const reason = '  Strong technical skills  ';

    const result = validateDecisionReason(reason);

    expect(result).toBe('Strong technical skills');
  });

  it('accepts reason with exactly MIN_DECISION_REASON_LENGTH characters', () => {
    const reason = 'A'.repeat(MIN_DECISION_REASON_LENGTH);

    const result = validateDecisionReason(reason);

    expect(result).toBe(reason);
  });

  it('throws VALIDATION error when trimmed reason is too short', () => {
    const reason = 'short';

    expect(() => validateDecisionReason(reason)).toThrow(DomainError);
    expect(() => validateDecisionReason(reason)).toThrow(
      'Reason must be at least 10 characters',
    );
  });

  it('throws VALIDATION error when reason is only whitespace', () => {
    const reason = '         ';

    expect(() => validateDecisionReason(reason)).toThrow(DomainError);
  });
});

describe('assertDecisionTransitionAllowed', () => {
  it('allows SHORTLIST for NEW candidate', () => {
    expect(() => assertDecisionTransitionAllowed('NEW', 'SHORTLIST')).not.toThrow();
  });

  it('allows REJECT for NEW candidate', () => {
    expect(() => assertDecisionTransitionAllowed('NEW', 'REJECT')).not.toThrow();
  });

  it('throws when shortlisting an already SHORTLISTED candidate', () => {
    expect(() => assertDecisionTransitionAllowed('SHORTLISTED', 'SHORTLIST')).toThrow(
      'Candidate is already SHORTLISTED',
    );
  });

  it('throws when rejecting an already REJECTED candidate', () => {
    expect(() => assertDecisionTransitionAllowed('REJECTED', 'REJECT')).toThrow(
      'Candidate is already REJECTED',
    );
  });

  it('throws when shortlisting a REJECTED candidate', () => {
    expect(() => assertDecisionTransitionAllowed('REJECTED', 'SHORTLIST')).toThrow(
      'Cannot SHORTLIST a REJECTED candidate',
    );
  });

  it('throws when rejecting a SHORTLISTED candidate', () => {
    expect(() => assertDecisionTransitionAllowed('SHORTLISTED', 'REJECT')).toThrow(
      'Cannot REJECT a SHORTLISTED candidate',
    );
  });
});

describe('decisionToStatus', () => {
  it('maps SHORTLIST to SHORTLISTED', () => {
    const result = decisionToStatus('SHORTLIST');

    expect(result).toBe('SHORTLISTED');
  });

  it('maps REJECT to REJECTED', () => {
    const result = decisionToStatus('REJECT');

    expect(result).toBe('REJECTED');
  });
});
