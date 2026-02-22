import { CandidateEntity } from '@/domain/candidate/entity';

export interface CandidateRepository {
  list(): CandidateEntity[];
  findById(id: string): CandidateEntity | null;
  save(candidate: CandidateEntity): void;
  nextId(): string;
}
