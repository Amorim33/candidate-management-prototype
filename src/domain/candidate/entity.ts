import { CandidateDTO, CandidateStatus } from '@/domain/candidate/schemas';

export interface CandidateEntity {
  id: string;
  name: string;
  status: CandidateStatus;
  role: string;
  location: string;
  linkedin: string;
  reason?: string;
  decisionDate?: string;
  tags?: string[];
}

interface CreateCandidateEntityInput {
  id: string;
  name: string;
  role: string;
  location: string;
  linkedin: string;
  status?: CandidateStatus;
  reason?: string;
  decisionDate?: string;
  tags?: string[];
}

export function createCandidateEntity(input: CreateCandidateEntityInput): CandidateEntity {
  return {
    id: input.id,
    name: input.name,
    status: input.status ?? 'NEW',
    role: input.role,
    location: input.location,
    linkedin: input.linkedin,
    reason: input.reason,
    decisionDate: input.decisionDate,
    tags: input.tags,
  };
}

export function applyDecision(
  candidate: CandidateEntity,
  status: CandidateStatus,
  reason: string,
  decisionDate: string,
): CandidateEntity {
  return {
    ...candidate,
    status,
    reason,
    decisionDate,
  };
}

export function toCandidateDTO(candidate: CandidateEntity): CandidateDTO {
  return {
    id: candidate.id,
    name: candidate.name,
    status: candidate.status,
    role: candidate.role,
    location: candidate.location,
    linkedin: candidate.linkedin,
    reason: candidate.reason,
    decisionDate: candidate.decisionDate,
    tags: candidate.tags,
  };
}
