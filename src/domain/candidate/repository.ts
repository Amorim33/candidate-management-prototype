import { CandidateEntity } from '@/domain/candidate/entity';
import {
  CandidateCounts,
  CandidateListQuery,
  CandidateStatus,
} from '@/domain/candidate/schemas';

export interface CandidateRepository {
  list(query?: CandidateListQuery): CandidateEntity[];
  findById(id: string): CandidateEntity | null;
  save(candidate: CandidateEntity): void;
  nextId(): string;
  counts(): CandidateCounts;
  availableTags(status?: CandidateStatus): string[];
}
