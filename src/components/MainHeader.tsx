import styles from './MainHeader.module.css';

interface MainHeaderProps {
  title: string;
  countLabel: string;
  countVariant: 'new' | 'shortlisted' | 'rejected';
  onAddCandidate?: () => void;
}

const countStyles: Record<string, string> = {
  new: styles.countNew,
  shortlisted: styles.countShortlisted,
  rejected: styles.countRejected,
};

export default function MainHeader({ title, countLabel, countVariant, onAddCandidate }: MainHeaderProps) {
  return (
    <header className={styles.header}>
      <h1 className={styles.title} data-testid="main-header-title">{title}</h1>
      <span className={`${styles.count} ${countStyles[countVariant]}`} data-testid="main-header-count">{countLabel}</span>
      {onAddCandidate && (
        <button className={styles.btnAdd} onClick={onAddCandidate} data-testid="btn-add-candidate">
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Add Candidate
        </button>
      )}
    </header>
  );
}
