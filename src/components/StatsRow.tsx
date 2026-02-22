import { CandidateDTO } from '@/domain/candidate/schemas';
import styles from './StatsRow.module.css';

interface StatsRowProps {
  candidates: CandidateDTO[];
}

export default function StatsRow({ candidates }: StatsRowProps) {
  const total = candidates.length;
  const newCount = candidates.filter(c => c.status === 'NEW').length;
  const shortlistedCount = candidates.filter(c => c.status === 'SHORTLISTED').length;
  const rejectedCount = candidates.filter(c => c.status === 'REJECTED').length;

  return (
    <div className={styles.statsRow}>
      <div className={styles.card}>
        <div className={styles.label}>Total</div>
        <div className={styles.value} data-testid="stats-total">{total}</div>
      </div>
      <div className={`${styles.card} ${styles.highlight}`}>
        <div className={styles.label}>New</div>
        <div className={styles.value} data-testid="stats-new">{newCount}</div>
      </div>
      <div className={styles.card}>
        <div className={styles.label}>Shortlisted</div>
        <div className={styles.value} data-testid="stats-shortlisted">{shortlistedCount}</div>
      </div>
      <div className={styles.card}>
        <div className={styles.label}>Rejected</div>
        <div className={styles.value} data-testid="stats-rejected">{rejectedCount}</div>
      </div>
    </div>
  );
}
