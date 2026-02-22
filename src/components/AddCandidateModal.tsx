'use client';

import { useState, useRef, KeyboardEvent } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  CandidateDTO,
  CreateCandidateRequest,
  CreateCandidateRequestSchema,
} from '@/domain/candidate/schemas';
import styles from './AddCandidateModal.module.css';

const MAX_TAGS = 10;
const MAX_TAG_LENGTH = 50;

async function createCandidate(data: CreateCandidateRequest): Promise<CandidateDTO> {
  const response = await fetch('/api/candidates', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error || 'Failed to create candidate');
  }

  return result;
}

interface AddCandidateModalProps {
  onClose: () => void;
  onCreated: () => void;
}

export default function AddCandidateModal({ onClose, onCreated }: AddCandidateModalProps) {
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const tagInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<CreateCandidateRequest>({
    resolver: zodResolver(CreateCandidateRequestSchema),
    mode: 'onSubmit',
  });

  const name = watch('name');
  const canCreate = (name?.trim().length ?? 0) > 0 && !isSubmitting;

  const addTag = (raw: string) => {
    const tag = raw.trim().toLowerCase().slice(0, MAX_TAG_LENGTH);
    if (!tag || tags.includes(tag) || tags.length >= MAX_TAGS) return;
    const next = [...tags, tag];
    setTags(next);
    setValue('tags', next);
    setTagInput('');
  };

  const removeTag = (index: number) => {
    const next = tags.filter((_, i) => i !== index);
    setTags(next);
    setValue('tags', next.length > 0 ? next : undefined);
  };

  const handleTagKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag(tagInput);
    }
    if (e.key === 'Backspace' && tagInput === '' && tags.length > 0) {
      removeTag(tags.length - 1);
    }
  };

  const onSubmit = async (data: CreateCandidateRequest) => {
    try {
      await createCandidate(data);
      onCreated();
      onClose();
    } catch (err) {
      setError('root', {
        message: err instanceof Error ? err.message : 'Failed to create candidate',
      });
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose} data-testid="add-candidate-overlay">
      <div className={styles.modal} onClick={e => e.stopPropagation()} data-testid="add-candidate-modal">
        <div className={styles.title}>Add New Candidate</div>
        <div className={styles.subtitle}>Enter the candidate&apos;s details to add them to the pipeline.</div>

        {errors.root && <div className={styles.error} data-testid="add-candidate-error">{errors.root.message}</div>}

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Full Name</label>
            <input
              className={styles.input}
              type="text"
              placeholder="e.g. Maria Santos"
              autoFocus
              data-testid="input-candidate-name"
              {...register('name')}
            />
            {errors.name && <div className={styles.fieldError}>{errors.name.message}</div>}
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>
              LinkedIn URL <span className={styles.optional}>(optional)</span>
            </label>
            <input
              className={styles.input}
              type="text"
              placeholder="e.g. linkedin.com/in/msantos"
              data-testid="input-candidate-linkedin"
              {...register('linkedin', {
                setValueAs: (v: string) => (v?.trim() === '' ? undefined : v),
              })}
            />
            {errors.linkedin && <div className={styles.fieldError} data-testid="linkedin-field-error">{errors.linkedin.message}</div>}
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>
              Tags <span className={styles.optional}>(optional)</span>
            </label>
            <div
              className={styles.tagInputWrapper}
              onClick={() => tagInputRef.current?.focus()}
              data-testid="tag-input-wrapper"
            >
              {tags.map((tag, i) => (
                <span key={tag} className={styles.tag} data-testid={`tag-${tag}`}>
                  {tag}
                  <button
                    type="button"
                    className={styles.tagRemove}
                    onClick={e => { e.stopPropagation(); removeTag(i); }}
                    aria-label={`Remove tag ${tag}`}
                    data-testid={`tag-remove-${tag}`}
                  >
                    <svg viewBox="0 0 16 16" fill="currentColor" width="10" height="10">
                      <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
                    </svg>
                  </button>
                </span>
              ))}
              <input
                ref={tagInputRef}
                className={styles.tagInput}
                type="text"
                placeholder={tags.length === 0 ? 'e.g. frontend, senior, remote' : tags.length >= MAX_TAGS ? 'Max tags reached' : 'Add tag...'}
                value={tagInput}
                onChange={e => setTagInput(e.target.value)}
                onKeyDown={handleTagKeyDown}
                onBlur={() => { if (tagInput.trim()) addTag(tagInput); }}
                disabled={tags.length >= MAX_TAGS}
                data-testid="input-candidate-tags"
              />
            </div>
            <div className={styles.tagHint}>{tags.length} / {MAX_TAGS} tags. Press Enter or comma to add.</div>
            {errors.tags && <div className={styles.fieldError}>{errors.tags.message}</div>}
          </div>

          <div className={styles.actions}>
            <button type="button" className={styles.btnCancel} onClick={onClose} data-testid="btn-cancel-modal">
              Cancel
            </button>
            <button type="submit" className={styles.btnCreate} disabled={!canCreate} data-testid="btn-create-candidate">
              {isSubmitting ? 'Creating...' : 'Add Candidate'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
