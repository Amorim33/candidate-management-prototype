'use client';

import CandidatesProvider, { useCandidates } from '@/providers/CandidatesProvider';
import Sidebar from '@/components/Sidebar';

const shellStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '240px 1fr',
  minHeight: '100vh',
};

const mainStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  minHeight: '100vh',
};

function LayoutInner({ children }: { children: React.ReactNode }) {
  const { candidates } = useCandidates();

  return (
    <div style={shellStyle}>
      <Sidebar candidates={candidates} />
      <div style={mainStyle}>{children}</div>
    </div>
  );
}

export default function LiveSessionLayout({ children }: { children: React.ReactNode }) {
  return (
    <CandidatesProvider>
      <LayoutInner>{children}</LayoutInner>
    </CandidatesProvider>
  );
}
