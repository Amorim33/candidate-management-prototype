import { describe, it, expect } from 'vitest';
import {
  DomainError,
  validationError,
  invalidTransitionError,
  notFoundError,
  isDomainError,
} from '@/domain/candidate/errors';

describe('validationError', () => {
  it('creates a DomainError with VALIDATION code', () => {
    const error = validationError('Field is required');

    expect(error).toBeInstanceOf(DomainError);
    expect(error.code).toBe('VALIDATION');
    expect(error.message).toBe('Field is required');
    expect(error.name).toBe('DomainError');
  });
});

describe('invalidTransitionError', () => {
  it('creates a DomainError with INVALID_TRANSITION code', () => {
    const error = invalidTransitionError('Cannot shortlist rejected candidate');

    expect(error).toBeInstanceOf(DomainError);
    expect(error.code).toBe('INVALID_TRANSITION');
    expect(error.message).toBe('Cannot shortlist rejected candidate');
  });
});

describe('notFoundError', () => {
  it('creates a DomainError with NOT_FOUND code', () => {
    const error = notFoundError('Candidate not found');

    expect(error).toBeInstanceOf(DomainError);
    expect(error.code).toBe('NOT_FOUND');
    expect(error.message).toBe('Candidate not found');
  });
});

describe('isDomainError', () => {
  it('returns true for DomainError instances', () => {
    const error = validationError('test');

    const result = isDomainError(error);

    expect(result).toBe(true);
  });

  it('returns false for plain Error instances', () => {
    const error = new Error('test');

    const result = isDomainError(error);

    expect(result).toBe(false);
  });

  it('returns false for non-error values', () => {
    expect(isDomainError('string')).toBe(false);
    expect(isDomainError(null)).toBe(false);
    expect(isDomainError(undefined)).toBe(false);
    expect(isDomainError(42)).toBe(false);
  });
});
