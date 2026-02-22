export type DomainErrorCode = 'VALIDATION' | 'INVALID_TRANSITION' | 'NOT_FOUND';

export class DomainError extends Error {
  constructor(
    public readonly code: DomainErrorCode,
    message: string,
  ) {
    super(message);
    this.name = 'DomainError';
  }
}

export function validationError(message: string): DomainError {
  return new DomainError('VALIDATION', message);
}

export function invalidTransitionError(message: string): DomainError {
  return new DomainError('INVALID_TRANSITION', message);
}

export function notFoundError(message: string): DomainError {
  return new DomainError('NOT_FOUND', message);
}

export function isDomainError(error: unknown): error is DomainError {
  return error instanceof DomainError;
}
