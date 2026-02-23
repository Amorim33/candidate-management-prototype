'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import {
  buildCandidateListQueryKey,
  normalizeCandidateTags,
} from '@/domain/candidate/lib/query-key';
import { useCandidates } from '@/providers/CandidatesProvider';
import {
  CandidateCounts,
  CandidateListResponse,
  CandidateListResponseSchema,
  CandidateListSort,
  CandidateStatus,
} from '@/domain/candidate/schemas';

interface UseCandidatesListQueryInput {
  status?: CandidateStatus;
  search: string;
  activeTags: Set<string>;
  sort: CandidateListSort;
  searchDebounceMs?: number;
  initialData?: CandidateListResponse;
  initialQueryKey?: string;
}

interface UseCandidatesListQueryResult extends CandidateListResponse {
  error: string | null;
  isLoading: boolean;
  hasLoadedOnce: boolean;
}

const EMPTY_COUNTS: CandidateCounts = {
  total: 0,
  new: 0,
  shortlisted: 0,
  rejected: 0,
};

const EMPTY_RESPONSE: CandidateListResponse = {
  items: [],
  filteredCount: 0,
  statusCount: 0,
  availableTags: [],
  counts: EMPTY_COUNTS,
};

function useDebouncedValue<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => window.clearTimeout(timeoutId);
  }, [value, delay]);

  return debouncedValue;
}

export function useCandidatesListQuery({
  status,
  search,
  activeTags,
  sort,
  searchDebounceMs = 250,
  initialData,
  initialQueryKey,
}: UseCandidatesListQueryInput): UseCandidatesListQueryResult {
  const { refreshToken, setCounts } = useCandidates();
  const [response, setResponse] = useState<CandidateListResponse>(initialData ?? EMPTY_RESPONSE);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(!initialData);
  const [hasLoadedOnce, setHasLoadedOnce] = useState(Boolean(initialData));
  const requestIdRef = useRef(0);
  const shouldSkipInitialFetchRef = useRef(Boolean(initialData) && Boolean(initialQueryKey));
  const hasSeededInitialCountsRef = useRef(false);

  const debouncedSearch = useDebouncedValue(search.trim(), searchDebounceMs);
  const normalizedTags = useMemo(
    () => normalizeCandidateTags(activeTags),
    [activeTags],
  );
  const tagsKey = normalizedTags.join(',');
  const queryKey = useMemo(
    () => buildCandidateListQueryKey({
      status,
      search: debouncedSearch,
      tags: normalizedTags,
      sort,
    }),
    [debouncedSearch, normalizedTags, sort, status],
  );

  useEffect(() => {
    if (!initialData || hasSeededInitialCountsRef.current) {
      return;
    }

    hasSeededInitialCountsRef.current = true;
    setCounts(initialData.counts);
  }, [initialData, setCounts]);

  useEffect(() => {
    const shouldSkipInitialFetch = (
      shouldSkipInitialFetchRef.current
      && refreshToken === 0
      && typeof initialQueryKey === 'string'
      && queryKey === initialQueryKey
    );

    if (shouldSkipInitialFetch) {
      shouldSkipInitialFetchRef.current = false;
      setIsLoading(false);
      setHasLoadedOnce(true);
      setError(null);
      return;
    }

    shouldSkipInitialFetchRef.current = false;

    const controller = new AbortController();
    const requestId = requestIdRef.current + 1;
    requestIdRef.current = requestId;

    const params = new URLSearchParams();
    if (status) {
      params.set('status', status);
    }
    if (debouncedSearch) {
      params.set('search', debouncedSearch);
    }
    if (tagsKey) {
      params.set('tags', tagsKey);
    }
    params.set('sort', sort);

    setIsLoading(true);
    setError(null);

    (async () => {
      try {
        const fetchResponse = await fetch(`/api/candidates?${params.toString()}`, {
          cache: 'no-store',
          signal: controller.signal,
        });
        let payload: unknown = null;
        try {
          payload = await fetchResponse.json();
        } catch {
          payload = null;
        }

        if (!fetchResponse.ok) {
          const errorMessage = (
            payload
            && typeof payload === 'object'
            && 'error' in payload
            && typeof payload.error === 'string'
          )
            ? payload.error
            : `Failed to load candidates (${fetchResponse.status})`;
          throw new Error(errorMessage);
        }

        const parsed = CandidateListResponseSchema.safeParse(payload);
        if (!parsed.success) {
          throw new Error('Invalid candidates response');
        }

        if (requestIdRef.current !== requestId) {
          return;
        }

        setResponse(parsed.data);
        setCounts(parsed.data.counts);
        setError(null);
      } catch (cause) {
        if (cause instanceof DOMException && cause.name === 'AbortError') {
          return;
        }

        if (requestIdRef.current !== requestId) {
          return;
        }

        const message = cause instanceof Error ? cause.message : 'Failed to load candidates';
        setError(message);
      } finally {
        if (requestIdRef.current === requestId) {
          setIsLoading(false);
          setHasLoadedOnce(true);
        }
      }
    })();

    return () => controller.abort();
  }, [debouncedSearch, initialQueryKey, queryKey, refreshToken, setCounts, sort, status, tagsKey]);

  return {
    ...response,
    error,
    isLoading,
    hasLoadedOnce,
  };
}
