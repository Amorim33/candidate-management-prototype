import { NextRequest, NextResponse } from 'next/server';
import { candidateRepository } from '@/data/storage';
import { CreateCandidateRequestSchema } from '@/domain/candidate/schemas';
import { listCandidatesUseCase } from '@/domain/candidate/use-cases/list-candidates';
import { createCandidateUseCase } from '@/domain/candidate/use-cases/create-candidate';
import { badRequest, mapDomainError } from '@/app/api/http-error';

export async function GET() {
  try {
    const candidates = listCandidatesUseCase(candidateRepository);
    return NextResponse.json(candidates);
  } catch (error) {
    return mapDomainError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = CreateCandidateRequestSchema.safeParse(body);

    if (!parsed.success) {
      const message = parsed.error.issues.map(issue => issue.message).join('; ');
      return badRequest(message);
    }

    const candidate = createCandidateUseCase(candidateRepository, parsed.data);
    return NextResponse.json(candidate, { status: 201 });
  } catch (error) {
    return mapDomainError(error);
  }
}
