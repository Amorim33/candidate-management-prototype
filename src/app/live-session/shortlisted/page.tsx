'use client';

import CandidateListPage from '@/components/CandidateListPage';

export default function ShortlistedPage() {
  return (
    <CandidateListPage
      status="SHORTLISTED"
      title="Shortlisted Candidates"
      countVariant="shortlisted"
      countSuffix="shortlisted"
      searchPlaceholder="Search shortlisted..."
      emptyMessage="No shortlisted candidates found."
    />
  );
}
