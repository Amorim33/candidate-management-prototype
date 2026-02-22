'use client';

import { useState, useCallback, createContext, useContext } from 'react';
import { CandidateCounts } from '@/domain/candidate/schemas';

const EMPTY_COUNTS: CandidateCounts = {
  total: 0,
  new: 0,
  shortlisted: 0,
  rejected: 0,
};

interface CandidatesContextValue {
  counts: CandidateCounts;
  refreshToken: number;
  setCounts: (counts: CandidateCounts) => void;
  requestRefresh: () => void;
}

const CandidatesContext = createContext<CandidatesContextValue>({
  counts: EMPTY_COUNTS,
  refreshToken: 0,
  setCounts: () => {},
  requestRefresh: () => {},
});

export function useCandidates() {
  return useContext(CandidatesContext);
}

export default function CandidatesProvider({ children }: { children: React.ReactNode }) {
  const [counts, setCounts] = useState<CandidateCounts>(EMPTY_COUNTS);
  const [refreshToken, setRefreshToken] = useState(0);

  const requestRefresh = useCallback(() => {
    setRefreshToken(current => current + 1);
  }, []);

  return (
    <CandidatesContext.Provider value={{ counts, refreshToken, setCounts, requestRefresh }}>
      {children}
    </CandidatesContext.Provider>
  );
}
