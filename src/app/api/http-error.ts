import { NextResponse } from 'next/server';
import {
  DomainErrorCode,
  isDomainError,
} from '@/domain/candidate/errors';

function domainErrorStatus(code: DomainErrorCode): number {
  if (code === 'NOT_FOUND') {
    return 404;
  }

  if (code === 'INVALID_TRANSITION') {
    return 409;
  }

  return 400;
}

export function badRequest(message: string) {
  return NextResponse.json({ error: message }, { status: 400 });
}

export function internalServerError() {
  return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
}

export function mapDomainError(error: unknown) {
  if (isDomainError(error)) {
    return NextResponse.json(
      { error: error.message },
      { status: domainErrorStatus(error.code) },
    );
  }

  if (error instanceof SyntaxError) {
    return badRequest('Invalid JSON body');
  }

  return internalServerError();
}
