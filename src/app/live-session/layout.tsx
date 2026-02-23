import LiveSessionShell from '@/components/LiveSessionShell';
import CandidatesProvider from '@/providers/CandidatesProvider';
import { getServerCandidateCounts } from '@/app/live-session/server-data';

export const dynamic = 'force-dynamic';

export default function LiveSessionLayout({ children }: { children: React.ReactNode }) {
  const initialCounts = getServerCandidateCounts();

  return (
    <CandidatesProvider initialCounts={initialCounts}>
      <LiveSessionShell>{children}</LiveSessionShell>
    </CandidatesProvider>
  );
}
