'use client';

import {
  useState,
  useCallback,
  createContext,
  useContext,
  useMemo,
} from 'react';
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

const CandidatesContext = createContext<CandidatesContextValue | null>(null);

export function useCandidates() {
  const context = useContext(CandidatesContext);

  if (!context) {
    throw new Error('useCandidates must be used within CandidatesProvider');
  }

  return context;
}

interface CandidatesProviderProps {
  children: React.ReactNode;
  initialCounts?: CandidateCounts;
}

export default function CandidatesProvider({
  children,
  initialCounts = EMPTY_COUNTS,
}: CandidatesProviderProps) {
  const [counts, setCounts] = useState<CandidateCounts>(initialCounts);
  const [refreshToken, setRefreshToken] = useState(0);

  const requestRefresh = useCallback(() => {
    setRefreshToken(current => current + 1);
  }, []);

  const value = useMemo(
    () => ({ counts, refreshToken, setCounts, requestRefresh }),
    [counts, refreshToken, requestRefresh],
  );

  return (
    <CandidatesContext.Provider value={value}>
      {children}
    </CandidatesContext.Provider>
  );
}
