import { CandidateStatus } from '@/domain/candidate/schemas';
import styles from './StatusChip.module.css';

interface StatusChipProps {
  status: CandidateStatus;
}

const statusMap: Record<CandidateStatus, { label: string; className: string }> = {
  NEW: { label: 'New', className: styles.new },
  SHORTLISTED: { label: 'Shortlisted', className: styles.shortlisted },
  REJECTED: { label: 'Rejected', className: styles.rejected },
};

export default function StatusChip({ status }: StatusChipProps) {
  const { label, className } = statusMap[status];
  return (
    <span className={`${styles.chip} ${className}`}>
      <span className={styles.dot} />
      {label}
    </span>
  );
}
