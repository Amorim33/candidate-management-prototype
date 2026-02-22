'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  CandidateDTO,
  DecisionAction,
  DecisionRequest,
  DecisionRequestSchema,
} from '@/domain/candidate/schemas';
import { getSafeLinkedInUrl } from './lib/linkedin';

async function submitDecision(
  candidateId: string,
  data: DecisionRequest,
): Promise<CandidateDTO> {
  const response = await fetch(`/api/candidates/${candidateId}/decision`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error || 'Failed to submit decision');
  }

  return result;
}
import Avatar from './Avatar';
import StatusChip from './StatusChip';
import styles from './DecisionPanel.module.css';

const LINKEDIN_SVG = (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

interface DecisionPanelProps {
  candidate: CandidateDTO | null;
  onDecisionSubmitted: () => void | Promise<void>;
}

export default function DecisionPanel({ candidate, onDecisionSubmitted }: DecisionPanelProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    resetField,
    setError,
    formState: { errors, isSubmitting, isValid },
  } = useForm<DecisionRequest>({
    resolver: zodResolver(DecisionRequestSchema),
    mode: 'onChange',
    defaultValues: {
      reason: '',
    },
  });

  const selectedAction = watch('decision') as DecisionAction | undefined;
  const reason = watch('reason') ?? '';
  const linkedInUrl = getSafeLinkedInUrl(candidate?.linkedin);

  if (!candidate) {
    return (
      <aside className={styles.panel}>
        <div className={styles.emptyState} data-testid="decision-panel-empty">
          <svg className={styles.emptyIcon} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
          </svg>
          <div className={styles.emptyTitle}>Select a Candidate</div>
          <div className={styles.emptyText}>Click on a candidate from the list to review and make a decision.</div>
        </div>
      </aside>
    );
  }

  const isLocked = candidate.status !== 'NEW';

  if (isLocked) {
    return (
      <aside className={styles.panel}>
        <div className={styles.header}>
          <div className={styles.title}>Decision Made</div>
          <div className={styles.subtitle}>This candidate has been reviewed</div>
        </div>

        <div className={styles.summary}>
          <Avatar name={candidate.name} size="md" disabled={candidate.status === 'REJECTED'} />
          <div>
            <div className={styles.summaryName}>{candidate.name}</div>
            <div className={styles.summaryRole}>
              {candidate.role}{candidate.location ? ` \u00B7 ${candidate.location}` : ''}
            </div>
            {linkedInUrl && (
              <a
                href={linkedInUrl}
                className={styles.linkedinLink}
                target="_blank"
                rel="noopener noreferrer"
              >
                {LINKEDIN_SVG}
                {candidate.linkedin}
              </a>
            )}
            {candidate.tags && candidate.tags.length > 0 && (
              <div className={styles.tags} data-testid="decision-panel-tags">
                {candidate.tags.map(tag => (
                  <span key={tag} className={styles.tag}>{tag}</span>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className={styles.lockedPanel} data-testid="decision-panel-locked">
          <div className={styles.lockedStatus}>
            <div className={styles.lockedIcon}>
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
              </svg>
            </div>
            <div>
              <div><StatusChip status={candidate.status} /></div>
              <div className={styles.lockedSublabel}>
                Decision locked{candidate.decisionDate ? ` \u00B7 ${new Date(candidate.decisionDate + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}` : ''}
              </div>
            </div>
          </div>

          {candidate.reason && (
            <>
              <div className={styles.lockedReasonLabel}>Decision Reason</div>
              <div className={styles.lockedReason}>&ldquo;{candidate.reason}&rdquo;</div>
            </>
          )}
        </div>
      </aside>
    );
  }

  const normalizedReasonLength = reason.trim().length;
  const isReasonValid = normalizedReasonLength >= 10;
  const canSubmit = isValid && !isSubmitting;

  const handleActionClick = (action: DecisionAction) => {
    if (selectedAction === action) {
      resetField('decision');
    } else {
      setValue('decision', action, { shouldValidate: true });
    }
  };

  const onSubmit = async (data: DecisionRequest) => {
    try {
      await submitDecision(candidate.id, data);
      reset();
      await onDecisionSubmitted();
    } catch (err) {
      setError('root', {
        message: err instanceof Error ? err.message : 'Failed to submit decision',
      });
    }
  };

  const buttonLabel = selectedAction === 'SHORTLIST'
    ? 'Confirm Shortlist'
    : selectedAction === 'REJECT'
      ? 'Confirm Rejection'
      : 'Select an action first';

  const buttonClass = selectedAction === 'REJECT'
    ? styles.btnMuted
    : styles.btnPrimary;

  return (
    <aside className={styles.panel}>
      <div className={styles.header}>
        <div className={styles.title}>Make a Decision</div>
        <div className={styles.subtitle}>Review and decide on this candidate</div>
      </div>

      <div className={styles.summary}>
        <Avatar name={candidate.name} size="md" />
        <div>
          <div className={styles.summaryName} data-testid="decision-candidate-name">{candidate.name}</div>
          <div className={styles.summaryRole}>
            {candidate.role}{candidate.location ? ` \u00B7 ${candidate.location}` : ''}
          </div>
          {linkedInUrl && (
            <a
              href={linkedInUrl}
              className={styles.linkedinLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              {LINKEDIN_SVG}
              {candidate.linkedin}
            </a>
          )}
          {candidate.tags && candidate.tags.length > 0 && (
            <div className={styles.tags} data-testid="decision-panel-tags">
              {candidate.tags.map(tag => (
                <span key={tag} className={styles.tag}>{tag}</span>
              ))}
            </div>
          )}
        </div>
      </div>

      <form className={styles.body} data-testid="decision-panel-form" onSubmit={handleSubmit(onSubmit)}>
        <div className={styles.actionCards}>
          <div
            className={`${styles.actionCard} ${selectedAction === 'SHORTLIST' ? styles.actionCardSelected : ''}`}
            onClick={() => handleActionClick('SHORTLIST')}
            data-testid="action-shortlist"
          >
            <div className={`${styles.actionIcon} ${styles.shortlistIcon}`}>
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className={styles.actionCardLabel}>Shortlist</div>
            <div className={styles.actionCardDesc}>Move to interviews</div>
          </div>
          <div
            className={`${styles.actionCard} ${selectedAction === 'REJECT' ? `${styles.actionCardSelected} ${styles.actionCardRejectSelected}` : ''}`}
            onClick={() => handleActionClick('REJECT')}
            data-testid="action-reject"
          >
            <div className={`${styles.actionIcon} ${styles.rejectIcon}`}>
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
              </svg>
            </div>
            <div className={styles.actionCardLabel}>Reject</div>
            <div className={styles.actionCardDesc}>Archive candidate</div>
          </div>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.formLabel}>
            Reason <span className={styles.formHint}>(min 10 characters)</span>
          </label>
          <textarea
            className={styles.textarea}
            placeholder="Explain your decision..."
            disabled={selectedAction === undefined}
            data-testid="decision-reason"
            {...register('reason')}
          />
          <div className={`${styles.charCount} ${isReasonValid ? styles.charCountValid : ''}`} data-testid="decision-char-count">
            {normalizedReasonLength} / 10 min
          </div>
          {errors.reason && <div className={styles.fieldError}>{errors.reason.message}</div>}
        </div>

        <div className={styles.warningBanner}>
          <div className={styles.warningIcon}>
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
          </div>
          <div className={styles.warningText}>
            <strong>This action is permanent.</strong> Once submitted, the decision cannot be changed.
          </div>
        </div>

        {errors.root && <div className={styles.errorMsg} data-testid="decision-error">{errors.root.message}</div>}

        <button
          type="submit"
          className={`${styles.btnSubmit} ${canSubmit ? buttonClass : ''}`}
          disabled={!canSubmit}
          data-testid="decision-submit"
        >
          {isSubmitting ? 'Submitting...' : buttonLabel}
        </button>
      </form>
    </aside>
  );
}
