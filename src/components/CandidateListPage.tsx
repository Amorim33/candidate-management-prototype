'use client';

import { useState } from 'react';
import { CandidateListResponse, CandidateStatus } from '@/domain/candidate/schemas';
import { useCandidatesListQuery } from '@/providers/useCandidatesListQuery';
import MainHeader from '@/components/MainHeader';
import FiltersBar, { SortOption } from '@/components/FiltersBar';
import CandidateRow from '@/components/CandidateRow';
import styles from '@/app/live-session/page.module.css';

interface CandidateListPageProps {
  status: Extract<CandidateStatus, 'SHORTLISTED' | 'REJECTED'>;
  title: string;
  countVariant: 'shortlisted' | 'rejected';
  countSuffix: string;
  searchPlaceholder: string;
  emptyMessage: string;
  initialData: CandidateListResponse;
  initialQueryKey: string;
}

const listPanelStyle: React.CSSProperties = {
  padding: 'var(--sp-5) var(--sp-8)',
  flex: 1,
};

const listItemsStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '6px',
};

export default function CandidateListPage({
  status,
  title,
  countVariant,
  countSuffix,
  searchPlaceholder,
  emptyMessage,
  initialData,
  initialQueryKey,
}: CandidateListPageProps) {
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<SortOption>('newest');
  const [activeTags, setActiveTags] = useState<Set<string>>(new Set());

  const {
    items,
    statusCount,
    availableTags,
    error,
    isLoading,
    hasLoadedOnce,
  } = useCandidatesListQuery({
    status,
    search,
    activeTags,
    sort,
    initialData,
    initialQueryKey,
  });

  return (
    <>
      <MainHeader
        title={title}
        countLabel={`${statusCount} ${countSuffix}`}
        countVariant={countVariant}
      />
      <FiltersBar
        allCount={statusCount}
        availableTags={availableTags}
        search={search}
        onSearchChange={setSearch}
        activeTags={activeTags}
        onTagChange={setActiveTags}
        sort={sort}
        onSortChange={setSort}
        searchPlaceholder={searchPlaceholder}
      />
      <section style={listPanelStyle}>
        {error && (
          <div className={styles.listMessageError}>{error}</div>
        )}
        {isLoading && !hasLoadedOnce ? (
          <div className={styles.listMessage}>Loading candidates...</div>
        ) : items.length === 0 ? (
          <div className={styles.listMessage}>{emptyMessage}</div>
        ) : (
          <div style={listItemsStyle}>
            {items.map((candidate, i) => (
              <CandidateRow
                key={candidate.id}
                candidate={candidate}
                variant={status === 'SHORTLISTED' ? 'shortlisted' : 'rejected'}
                index={i}
              />
            ))}
          </div>
        )}
      </section>
    </>
  );
}
