import { applyDecision, toCandidateDTO } from '@/domain/candidate/entity';
import { notFoundError } from '@/domain/candidate/errors';
import { CandidateRepository } from '@/domain/candidate/repository';
import {
  assertDecisionTransitionAllowed,
  decisionToStatus,
  validateDecisionReason,
} from '@/domain/candidate/rules';
import { CandidateDTO, DecisionRequest } from '@/domain/candidate/schemas';

function today(): string {
  return new Date().toISOString().split('T')[0];
}

export function decideCandidateUseCase(
  repository: CandidateRepository,
  candidateId: string,
  input: DecisionRequest,
): CandidateDTO {
  const candidate = repository.findById(candidateId);

  if (!candidate) {
    throw notFoundError('Candidate not found');
  }

  assertDecisionTransitionAllowed(candidate.status, input.decision);
  const normalizedReason = validateDecisionReason(input.reason);

  const updatedCandidate = applyDecision(
    candidate,
    decisionToStatus(input.decision),
    normalizedReason,
    today(),
  );

  repository.save(updatedCandidate);

  return toCandidateDTO(updatedCandidate);
}
