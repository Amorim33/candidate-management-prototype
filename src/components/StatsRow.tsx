import { CandidateCounts } from '@/domain/candidate/schemas';
import styles from './StatsRow.module.css';

interface StatsRowProps {
  counts: CandidateCounts;
}

export default function StatsRow({ counts }: StatsRowProps) {
  return (
    <div className={styles.statsRow}>
      <div className={styles.card}>
        <div className={styles.label}>Total</div>
        <div className={styles.value} data-testid="stats-total">{counts.total}</div>
      </div>
      <div className={`${styles.card} ${styles.highlight}`}>
        <div className={styles.label}>New</div>
        <div className={styles.value} data-testid="stats-new">{counts.new}</div>
      </div>
      <div className={styles.card}>
        <div className={styles.label}>Shortlisted</div>
        <div className={styles.value} data-testid="stats-shortlisted">{counts.shortlisted}</div>
      </div>
      <div className={styles.card}>
        <div className={styles.label}>Rejected</div>
        <div className={styles.value} data-testid="stats-rejected">{counts.rejected}</div>
      </div>
    </div>
  );
}
