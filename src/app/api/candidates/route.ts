import { NextRequest, NextResponse } from 'next/server';
import { candidateRepository } from '@/data/storage';
import {
  CandidateListQuery,
  CandidateListQuerySchema,
  CreateCandidateRequestSchema,
} from '@/domain/candidate/schemas';
import { listCandidatesUseCase } from '@/domain/candidate/use-cases/list-candidates';
import { createCandidateUseCase } from '@/domain/candidate/use-cases/create-candidate';
import { badRequest, mapDomainError } from '@/app/api/http-error';

function parseTags(rawTags: string | null): string[] | undefined {
  if (!rawTags) {
    return undefined;
  }

  const tags = rawTags
    .split(',')
    .map(tag => tag.trim().toLowerCase())
    .filter(Boolean);

  if (tags.length === 0) {
    return undefined;
  }

  return Array.from(new Set(tags));
}

function parseListQuery(
  request: NextRequest,
): { query: CandidateListQuery | null; errorMessage?: string } {
  const searchParams = request.nextUrl.searchParams;
  const search = searchParams.get('search')?.trim();

  const parsed = CandidateListQuerySchema.safeParse({
    status: searchParams.get('status') ?? undefined,
    search: search && search.length > 0 ? search : undefined,
    tags: parseTags(searchParams.get('tags')),
    sort: searchParams.get('sort') ?? undefined,
  });

  if (!parsed.success) {
    const message = parsed.error.issues.map(issue => issue.message).join('; ');
    return {
      query: null,
      errorMessage: message,
    };
  }

  return { query: parsed.data };
}

function normalizeCreateRequestBody(body: unknown): unknown {
  if (!body || typeof body !== 'object') {
    return body;
  }

  const record = body as Record<string, unknown>;
  if (typeof record.linkedin === 'string' && record.linkedin.trim() === '') {
    return {
      ...record,
      linkedin: undefined,
    };
  }

  return body;
}

export async function GET(request: NextRequest) {
  try {
    const { query, errorMessage } = parseListQuery(request);

    if (!query) {
      return badRequest(errorMessage || 'Invalid query parameters');
    }

    const candidates = listCandidatesUseCase(candidateRepository, query);
    return NextResponse.json(candidates);
  } catch (error) {
    return mapDomainError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    let body: unknown;
    try {
      body = await request.json();
    } catch (error) {
      if (error instanceof SyntaxError) {
        return badRequest('Invalid JSON body');
      }

      throw error;
    }

    const parsed = CreateCandidateRequestSchema.safeParse(normalizeCreateRequestBody(body));

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
