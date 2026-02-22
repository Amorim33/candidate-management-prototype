import { toCandidateDTO } from '@/domain/candidate/entity';
import { CandidateRepository } from '@/domain/candidate/repository';
import { CandidateDTO } from '@/domain/candidate/schemas';

export function listCandidatesUseCase(
  repository: CandidateRepository,
): CandidateDTO[] {
  const candidates = repository.list();
  return candidates.map(toCandidateDTO);
}
