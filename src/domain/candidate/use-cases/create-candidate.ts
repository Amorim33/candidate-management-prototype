import { createCandidateEntity, toCandidateDTO } from '@/domain/candidate/entity';
import { CandidateRepository } from '@/domain/candidate/repository';
import { CandidateDTO, CreateCandidateRequest } from '@/domain/candidate/schemas';

export function createCandidateUseCase(
  repository: CandidateRepository,
  input: CreateCandidateRequest,
): CandidateDTO {
  const candidate = createCandidateEntity({
    id: repository.nextId(),
    name: input.name,
    role: 'New Candidate',
    location: '',
    linkedin: input.linkedin ?? '',
    tags: input.tags,
  });

  repository.save(candidate);

  return toCandidateDTO(candidate);
}
