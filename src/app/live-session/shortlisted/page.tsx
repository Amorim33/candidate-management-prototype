'use client';

import { useState, useMemo } from 'react';
import { useCandidates } from '@/providers/CandidatesProvider';
import MainHeader from '@/components/MainHeader';
import FiltersBar, { SortOption } from '@/components/FiltersBar';
import CandidateRow from '@/components/CandidateRow';

const listPanelStyle: React.CSSProperties = {
  padding: 'var(--sp-5) var(--sp-8)',
  flex: 1,
};

const listItemsStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '6px',
};

export default function ShortlistedPage() {
  const { candidates } = useCandidates();
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<SortOption>('newest');
  const [activeTags, setActiveTags] = useState<Set<string>>(new Set());

  const shortlisted = candidates.filter(c => c.status === 'SHORTLISTED');

  const filtered = useMemo(() => {
    let result = shortlisted;

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
  }, [shortlisted, search, activeTags, sort]);

  return (
    <>
      <MainHeader
        title="Shortlisted Candidates"
        countLabel={`${shortlisted.length} shortlisted`}
        countVariant="shortlisted"
      />
      <FiltersBar
        candidates={shortlisted}
        search={search}
        onSearchChange={setSearch}
        activeTags={activeTags}
        onTagChange={setActiveTags}
        sort={sort}
        onSortChange={setSort}
        searchPlaceholder="Search shortlisted..."
      />
      <section style={listPanelStyle}>
        <div style={listItemsStyle}>
          {filtered.map((candidate, i) => (
            <CandidateRow
              key={candidate.id}
              candidate={candidate}
              variant="shortlisted"
              index={i}
            />
          ))}
        </div>
      </section>
    </>
  );
}
