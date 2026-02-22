'use client';

import { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCandidates } from '@/providers/CandidatesProvider';
import MainHeader from '@/components/MainHeader';
import StatsRow from '@/components/StatsRow';
import FiltersBar, { SortOption } from '@/components/FiltersBar';
import CandidateRow from '@/components/CandidateRow';
import DecisionPanel from '@/components/DecisionPanel';
import AddCandidateModal from '@/components/AddCandidateModal';
import styles from './page.module.css';

const DEFAULT_DECISION_PANEL_WIDTH = 400;
const MIN_DECISION_PANEL_WIDTH = 320;
const KEYBOARD_RESIZE_STEP = 16;

const workspaceBaseStyle: React.CSSProperties = {
  display: 'grid',
  flex: 1,
  minWidth: 0,
};

const listPanelStyle: React.CSSProperties = {
  padding: 'var(--sp-5) var(--sp-8)',
  overflowY: 'auto',
  minWidth: 0,
};

const listItemsStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '6px',
};

function clampDecisionPanelWidth(nextWidth: number, viewportWidth: number) {
  const maxWidth = viewportWidth * 0.5;
  const minWidth = Math.min(MIN_DECISION_PANEL_WIDTH, maxWidth);
  return Math.min(maxWidth, Math.max(minWidth, nextWidth));
}

function NewCandidatesContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedId = searchParams.get('candidateId');
  const { candidates, error, refreshCandidates } = useCandidates();
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<SortOption>('name-az');
  const [activeTags, setActiveTags] = useState<Set<string>>(new Set());
  const [viewportWidth, setViewportWidth] = useState(() => (
    typeof window !== 'undefined' ? window.innerWidth : 1024
  ));
  const [decisionPanelWidth, setDecisionPanelWidth] = useState(DEFAULT_DECISION_PANEL_WIDTH);
  const [isResizingDecisionPanel, setIsResizingDecisionPanel] = useState(false);
  const resizeStartRef = useRef<{ startX: number; startWidth: number } | null>(null);

  const newCandidates = candidates.filter(c => c.status === 'NEW');

  const filteredCandidates = useMemo(() => {
    let result = newCandidates;

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(c =>
        c.name.toLowerCase().includes(q) ||
        c.role.toLowerCase().includes(q) ||
        c.location.toLowerCase().includes(q)
      );
    }

    if (activeTags.size > 0) {
      result = result.filter(c => c.tags?.some(t => activeTags.has(t)));
    }

    result = [...result].sort((a, b) => {
      switch (sort) {
        case 'newest':
          return (b.decisionDate ?? '').localeCompare(a.decisionDate ?? '');
        case 'oldest':
          return (a.decisionDate ?? '').localeCompare(b.decisionDate ?? '');
        case 'name-az':
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

    return result;
  }, [newCandidates, search, activeTags, sort]);

  const selectedCandidate = selectedId ? newCandidates.find(c => c.id === selectedId) ?? null : null;
  const maxDecisionPanelWidth = viewportWidth * 0.5;
  const minDecisionPanelWidth = Math.min(MIN_DECISION_PANEL_WIDTH, maxDecisionPanelWidth);

  const workspaceStyle: React.CSSProperties = {
    ...workspaceBaseStyle,
    gridTemplateColumns: `minmax(0, 1fr) ${decisionPanelWidth}px`,
  };

  useEffect(() => {
    const handleWindowResize = () => {
      const nextViewportWidth = window.innerWidth;
      setViewportWidth(nextViewportWidth);
      setDecisionPanelWidth(prevWidth => clampDecisionPanelWidth(prevWidth, nextViewportWidth));
    };

    handleWindowResize();
    window.addEventListener('resize', handleWindowResize);
    return () => window.removeEventListener('resize', handleWindowResize);
  }, []);

  useEffect(() => {
    if (!isResizingDecisionPanel) {
      return;
    }

    const previousCursor = document.body.style.cursor;
    const previousUserSelect = document.body.style.userSelect;

    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';

    return () => {
      document.body.style.cursor = previousCursor;
      document.body.style.userSelect = previousUserSelect;
    };
  }, [isResizingDecisionPanel]);

  const handleSelect = (id: string) => {
    router.push(`/live-session?candidateId=${id}`, { scroll: false });
  };

  const handleDecisionSubmitted = async () => {
    await refreshCandidates();
    router.push('/live-session', { scroll: false });
  };

  const stopDecisionPanelResize = () => {
    resizeStartRef.current = null;
    setIsResizingDecisionPanel(false);
  };

  const handleDecisionPanelResizeStart = (event: React.PointerEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    resizeStartRef.current = {
      startX: event.clientX,
      startWidth: decisionPanelWidth,
    };
    setIsResizingDecisionPanel(true);
  };

  const handleDecisionPanelResizeMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!resizeStartRef.current) {
      return;
    }

    const deltaX = resizeStartRef.current.startX - event.clientX;
    const nextWidth = resizeStartRef.current.startWidth + deltaX;
    setDecisionPanelWidth(clampDecisionPanelWidth(nextWidth, viewportWidth));
  };

  const handleDecisionPanelResizeEnd = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    stopDecisionPanelResize();
  };

  const handleDecisionPanelResizeCancel = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    stopDecisionPanelResize();
  };

  const handleDecisionPanelResizeKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') {
      return;
    }

    event.preventDefault();
    const delta = event.key === 'ArrowLeft' ? KEYBOARD_RESIZE_STEP : -KEYBOARD_RESIZE_STEP;
    setDecisionPanelWidth(prevWidth => clampDecisionPanelWidth(prevWidth + delta, viewportWidth));
  };

  return (
    <>
      <MainHeader
        title="New Candidates"
        countLabel={`${newCandidates.length} awaiting review`}
        countVariant="new"
        onAddCandidate={() => setShowModal(true)}
      />
      <StatsRow candidates={candidates} />
      <FiltersBar
        candidates={newCandidates}
        search={search}
        onSearchChange={setSearch}
        activeTags={activeTags}
        onTagChange={setActiveTags}
        sort={sort}
        onSortChange={setSort}
        searchPlaceholder="Search new candidates..."
      />
      <div style={workspaceStyle}>
        <section style={listPanelStyle}>
          {error ? (
            <div className={styles.listMessageError}>{error}</div>
          ) : filteredCandidates.length === 0 ? (
            <div className={styles.listMessage}>No new candidates to review right now.</div>
          ) : (
            <div style={listItemsStyle}>
              {filteredCandidates.map((candidate, i) => (
                <CandidateRow
                  key={candidate.id}
                  candidate={candidate}
                  variant="new"
                  selected={candidate.id === selectedId}
                  index={i}
                  onClick={() => handleSelect(candidate.id)}
                  onReview={() => handleSelect(candidate.id)}
                />
              ))}
            </div>
          )}
        </section>
        <div className={styles.decisionPanelShell}>
          <div
            className={`${styles.resizeHandle} ${isResizingDecisionPanel ? styles.resizeHandleActive : ''}`}
            role="separator"
            tabIndex={0}
            aria-label="Resize decision sidebar"
            aria-orientation="vertical"
            aria-valuemin={Math.round(minDecisionPanelWidth)}
            aria-valuemax={Math.round(maxDecisionPanelWidth)}
            aria-valuenow={Math.round(decisionPanelWidth)}
            onPointerDown={handleDecisionPanelResizeStart}
            onPointerMove={handleDecisionPanelResizeMove}
            onPointerUp={handleDecisionPanelResizeEnd}
            onPointerCancel={handleDecisionPanelResizeCancel}
            onLostPointerCapture={stopDecisionPanelResize}
            onKeyDown={handleDecisionPanelResizeKeyDown}
          />
          <DecisionPanel
            candidate={selectedCandidate}
            onDecisionSubmitted={handleDecisionSubmitted}
          />
        </div>
      </div>
      {showModal && (
        <AddCandidateModal
          onClose={() => setShowModal(false)}
          onCreated={refreshCandidates}
        />
      )}
    </>
  );
}

export default function NewCandidatesPage() {
  return (
    <Suspense fallback={<div style={{ padding: '2rem' }}>Loading...</div>}>
      <NewCandidatesContent />
    </Suspense>
  );
}
