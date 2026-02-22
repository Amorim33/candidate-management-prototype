import { z } from 'zod';

const LINKEDIN_PATTERN = /^(https?:\/\/)?(www\.)?linkedin\.com\/.+$/i;

export const CandidateStatusSchema = z.enum(['NEW', 'SHORTLISTED', 'REJECTED']);
export type CandidateStatus = z.infer<typeof CandidateStatusSchema>;

export const DecisionActionSchema = z.enum(['SHORTLIST', 'REJECT']);
export type DecisionAction = z.infer<typeof DecisionActionSchema>;

export const CandidateDTOSchema = z.object({
  id: z.string(),
  name: z.string().max(120),
  status: CandidateStatusSchema,
  role: z.string().max(120),
  location: z.string().max(120),
  linkedin: z.string().max(200),
  reason: z.string().max(1000).optional(),
  decisionDate: z.string().optional(),
  tags: z.array(z.string()).optional(),
});
export type CandidateDTO = z.infer<typeof CandidateDTOSchema>;

export const TagSchema = z
  .string()
  .trim()
  .min(1, 'Tag must not be empty')
  .max(50, 'Tag is too long');

export const CreateCandidateRequestSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(120, 'Name is too long'),
  linkedin: z
    .string()
    .trim()
    .max(200, 'LinkedIn URL is too long')
    .refine(value => LINKEDIN_PATTERN.test(value), 'LinkedIn must be a valid LinkedIn URL')
    .optional(),
  tags: z
    .array(TagSchema)
    .max(10, 'Too many tags (max 10)')
    .optional(),
});
export type CreateCandidateRequest = z.infer<typeof CreateCandidateRequestSchema>;

export const DecisionRequestSchema = z.object({
  decision: DecisionActionSchema,
  reason: z
    .string()
    .trim()
    .min(10, 'Reason must be at least 10 characters')
    .max(1000, 'Reason is too long'),
});
export type DecisionRequest = z.infer<typeof DecisionRequestSchema>;

export const ErrorResponseSchema = z.object({
  error: z.string(),
});
export type ErrorResponse = z.infer<typeof ErrorResponseSchema>;
