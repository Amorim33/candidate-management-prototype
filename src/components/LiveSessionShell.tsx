'use client';

import Sidebar from '@/components/Sidebar';
import { useCandidates } from '@/providers/CandidatesProvider';

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

export default function LiveSessionShell({ children }: { children: React.ReactNode }) {
  const { counts } = useCandidates();

  return (
    <div style={shellStyle}>
      <Sidebar counts={counts} />
      <div style={mainStyle}>{children}</div>
    </div>
  );
}
