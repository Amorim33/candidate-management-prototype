'use client';

import { CandidateDTO } from '@/domain/candidate/schemas';
import { getSafeLinkedInUrl } from './lib/linkedin';
import Avatar from './Avatar';
import StatusChip from './StatusChip';
import styles from './CandidateRow.module.css';

const LINKEDIN_SVG = (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

type Variant = 'new' | 'shortlisted' | 'rejected';
const DELAY_CLASSES = [
  styles.delay0,
  styles.delay1,
  styles.delay2,
  styles.delay3,
  styles.delay4,
  styles.delay5,
] as const;

interface CandidateRowProps {
  candidate: CandidateDTO;
  selected?: boolean;
  variant: Variant;
  index?: number;
  onClick?: () => void;
  onReview?: () => void;
}

export default function CandidateRow({
  candidate,
  selected = false,
  variant,
  index = 0,
  onClick,
  onReview,
}: CandidateRowProps) {
  const isReadOnly = variant !== 'new';
  const isDimmed = variant === 'rejected';
  const delayClass = DELAY_CLASSES[index] ?? '';
  const linkedInUrl = getSafeLinkedInUrl(candidate.linkedin);

  const classNames = [
    styles.row,
    selected ? styles.selected : '',
    isReadOnly ? styles.readOnly : '',
    isDimmed ? styles.dimmed : '',
    delayClass,
  ].filter(Boolean).join(' ');

  return (
    <article className={classNames} onClick={onClick} data-testid={`candidate-row-${candidate.id}`}>
      <Avatar name={candidate.name} disabled={isDimmed} />
      <div className={styles.info}>
        <div className={styles.name} data-testid="candidate-name">{candidate.name}</div>
        <div className={styles.meta}>
          <span className={styles.role} data-testid="candidate-role">{candidate.role}</span>
          {candidate.location && (
            <>
              <span className={styles.metaDot} />
              <span className={styles.location} data-testid="candidate-location">{candidate.location}</span>
            </>
          )}
          {linkedInUrl && (
            <>
              <span className={styles.metaDot} />
              <a
                href={linkedInUrl}
                className={styles.linkedinLink}
                target="_blank"
                rel="noopener noreferrer"
                onClick={e => e.stopPropagation()}
              >
                {LINKEDIN_SVG}
                {candidate.linkedin}
              </a>
            </>
          )}
        </div>
        {isReadOnly && candidate.reason && (
          <div className={styles.decisionReason}>&ldquo;{candidate.reason}&rdquo;</div>
        )}
      </div>
      <div className={styles.trailing}>
        <StatusChip status={candidate.status} />
        {candidate.decisionDate && (
          <span className={styles.time}>
            {new Date(candidate.decisionDate + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </span>
        )}
        {variant === 'new' && (
          <div className={styles.actions}>
            <button
              className={`${styles.actionBtn} ${styles.reviewBtn}`}
              onClick={e => { e.stopPropagation(); onReview?.(); }}
              data-testid="candidate-review-btn"
            >
              Review
            </button>
          </div>
        )}
      </div>
    </article>
  );
}
