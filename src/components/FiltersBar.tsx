'use client';

import { CandidateListSort, CandidateListSortSchema } from '@/domain/candidate/schemas';
import styles from './FiltersBar.module.css';

export type SortOption = CandidateListSort;

interface FiltersBarProps {
  allCount: number;
  availableTags: string[];
  search: string;
  onSearchChange: (value: string) => void;
  activeTags: Set<string>;
  onTagChange: (tags: Set<string>) => void;
  sort: SortOption;
  onSortChange: (sort: SortOption) => void;
  searchPlaceholder?: string;
}

export default function FiltersBar({
  allCount,
  availableTags,
  search,
  onSearchChange,
  activeTags,
  onTagChange,
  sort,
  onSortChange,
  searchPlaceholder = 'Search candidates...',
}: FiltersBarProps) {
  const toggleTag = (tag: string) => {
    const next = new Set(activeTags);
    if (next.has(tag)) next.delete(tag);
    else next.add(tag);
    onTagChange(next);
  };

  return (
    <div className={styles.filtersBar} data-testid="filters-bar">
      <div className={styles.searchWrap}>
        <div className={styles.searchIcon}>
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
        </div>
        <input
          className={styles.searchInput}
          type="text"
          placeholder={searchPlaceholder}
          value={search}
          onChange={e => onSearchChange(e.target.value)}
          data-testid="search-input"
        />
      </div>

      <div className={styles.chips}>
        <button
          className={`${styles.chip} ${activeTags.size === 0 ? styles.chipActive : ''}`}
          onClick={() => onTagChange(new Set())}
          data-testid="filter-chip-All"
        >
          All <span className={styles.chipCount}>{allCount}</span>
        </button>
        {availableTags.map(tag => (
          <button
            key={tag}
            className={`${styles.tagChip} ${activeTags.has(tag) ? styles.tagChipActive : ''}`}
            onClick={() => toggleTag(tag)}
            data-testid={`filter-chip-${tag}`}
          >
            {tag}
          </button>
        ))}
      </div>

      <div className={styles.sortWrap}>
        <select
          className={styles.sortSelect}
          value={sort}
          onChange={event => {
            const parsedSort = CandidateListSortSchema.safeParse(event.target.value);
            if (parsedSort.success) {
              onSortChange(parsedSort.data);
            }
          }}
          data-testid="sort-select"
        >
          <option value="newest">Newest first</option>
          <option value="oldest">Oldest first</option>
          <option value="name-az">Name A-Z</option>
        </select>
        <div className={styles.sortChevron}>
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
          </svg>
        </div>
      </div>
    </div>
  );
}
