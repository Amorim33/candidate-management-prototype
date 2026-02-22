import {
  invalidTransitionError,
  validationError,
} from '@/domain/candidate/errors';
import {
  CandidateStatus,
  DecisionAction,
} from '@/domain/candidate/schemas';

export const MIN_DECISION_REASON_LENGTH = 10;

export function validateDecisionReason(reason: string): string {
  const normalized = reason.trim();

  if (normalized.length < MIN_DECISION_REASON_LENGTH) {
    throw validationError('Reason must be at least 10 characters');
  }

  return normalized;
}

export function assertDecisionTransitionAllowed(
  currentStatus: CandidateStatus,
  decision: DecisionAction,
): void {
  if (currentStatus === 'NEW') {
    return;
  }

  if (currentStatus === 'SHORTLISTED' && decision === 'SHORTLIST') {
    throw invalidTransitionError('Candidate is already SHORTLISTED');
  }

  if (currentStatus === 'REJECTED' && decision === 'REJECT') {
    throw invalidTransitionError('Candidate is already REJECTED');
  }

  if (currentStatus === 'REJECTED' && decision === 'SHORTLIST') {
    throw invalidTransitionError('Cannot SHORTLIST a REJECTED candidate');
  }

  if (currentStatus === 'SHORTLISTED' && decision === 'REJECT') {
    throw invalidTransitionError('Cannot REJECT a SHORTLISTED candidate');
  }

  throw invalidTransitionError(
    `Cannot change decision for a ${currentStatus.toLowerCase()} candidate`,
  );
}

export function decisionToStatus(decision: DecisionAction): CandidateStatus {
  return decision === 'SHORTLIST' ? 'SHORTLISTED' : 'REJECTED';
}
