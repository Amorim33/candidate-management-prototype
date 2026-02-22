'use client';

import CandidateListPage from '@/components/CandidateListPage';

export default function RejectedPage() {
  return (
    <CandidateListPage
      status="REJECTED"
      title="Rejected Candidates"
      countVariant="rejected"
      countSuffix="rejected"
      searchPlaceholder="Search rejected..."
      emptyMessage="No rejected candidates found."
    />
  );
}
