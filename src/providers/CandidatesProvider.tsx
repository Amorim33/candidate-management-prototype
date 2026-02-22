'use client';

import { useState, useEffect, useCallback, createContext, useContext } from 'react';
import { CandidateDTO } from '@/domain/candidate/schemas';

async function getAllCandidates(): Promise<CandidateDTO[]> {
  const response = await fetch('/api/candidates');
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Failed to fetch candidates');
  }

  return data;
}

interface CandidatesContextValue {
  candidates: CandidateDTO[];
  error: string | null;
  refreshCandidates: () => Promise<void>;
}

const CandidatesContext = createContext<CandidatesContextValue>({
  candidates: [],
  error: null,
  refreshCandidates: async () => {},
});

export function useCandidates() {
  return useContext(CandidatesContext);
}

export default function CandidatesProvider({ children }: { children: React.ReactNode }) {
  const [candidates, setCandidates] = useState<CandidateDTO[]>([]);
  const [error, setError] = useState<string | null>(null);

  const refreshCandidates = useCallback(async () => {
    try {
      const data = await getAllCandidates();
      setCandidates(data);
      setError(null);
    } catch {
      setError('Failed to load candidates');
    }
  }, []);

  useEffect(() => {
    refreshCandidates();
  }, [refreshCandidates]);

  return (
    <CandidatesContext.Provider value={{ candidates, error, refreshCandidates }}>
      {children}
    </CandidatesContext.Provider>
  );
}
