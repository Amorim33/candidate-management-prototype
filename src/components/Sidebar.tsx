'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { CandidateDTO } from '@/domain/candidate/schemas';
import styles from './Sidebar.module.css';

interface SidebarProps {
  candidates: CandidateDTO[];
}

export default function Sidebar({ candidates }: SidebarProps) {
  const pathname = usePathname();

  const newCount = candidates.filter(c => c.status === 'NEW').length;
  const shortlistedCount = candidates.filter(c => c.status === 'SHORTLISTED').length;
  const rejectedCount = candidates.filter(c => c.status === 'REJECTED').length;

  const navItems = [
    {
      href: '/live-session',
      label: 'New Candidates',
      count: newCount,
      testId: 'new',
      icon: (
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
        </svg>
      ),
      isActive: pathname === '/live-session',
    },
    {
      href: '/live-session/shortlisted',
      label: 'Shortlisted',
      count: shortlistedCount,
      testId: 'shortlisted',
      icon: (
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      isActive: pathname === '/live-session/shortlisted',
    },
    {
      href: '/live-session/rejected',
      label: 'Rejected',
      count: rejectedCount,
      testId: 'rejected',
      icon: (
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
        </svg>
      ),
      isActive: pathname === '/live-session/rejected',
    },
  ];

  return (
    <nav className={styles.sidebar} aria-label="Main navigation" data-testid="sidebar">
      <Link href="/live-session" className={styles.brand}>
        <div className={styles.brandMark}>WF</div>
        <div>
          <div className={styles.brandText}>Workflow</div>
          <div className={styles.brandSub}>Candidate Manager</div>
        </div>
      </Link>

      <div className={styles.nav}>
        <div className={styles.sectionLabel}>Pipeline</div>
        {navItems.map(item => (
          <Link
            key={item.href}
            href={item.href}
            className={`${styles.navItem} ${item.isActive ? styles.navItemActive : ''}`}
            aria-current={item.isActive ? 'page' : undefined}
            data-testid={`sidebar-nav-${item.testId}`}
          >
            <div className={styles.navIcon}>{item.icon}</div>
            <span className={styles.navLabel}>{item.label}</span>
            <span
              className={`${styles.navBadge} ${item.isActive ? styles.navBadgeActive : styles.navBadgeInactive}`}
              data-testid={`sidebar-badge-${item.testId}`}
            >
              {item.count}
            </span>
          </Link>
        ))}
      </div>
    </nav>
  );
}
