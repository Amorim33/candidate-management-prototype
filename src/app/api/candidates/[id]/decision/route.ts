import { NextRequest, NextResponse } from 'next/server';
import { candidateRepository } from '@/data/storage';
import { DecisionRequestSchema } from '@/domain/candidate/schemas';
import { decideCandidateUseCase } from '@/domain/candidate/use-cases/decide-candidate';
import { badRequest, mapDomainError } from '@/app/api/http-error';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const body = await request.json();
    const parsed = DecisionRequestSchema.safeParse(body);

    if (!parsed.success) {
      const message = parsed.error.issues.map(issue => issue.message).join('; ');
      return badRequest(message);
    }

    const candidate = decideCandidateUseCase(candidateRepository, params.id, parsed.data);
    return NextResponse.json(candidate, { status: 200 });
  } catch (error) {
    return mapDomainError(error);
  }
}
