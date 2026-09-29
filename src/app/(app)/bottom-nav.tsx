'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Activity, ClipboardCheck, Clock3, FileText, Settings, ShieldCheck } from 'lucide-react';

const LINKS = [
  { href: '/today', label: 'Today', Icon: Activity },
  { href: '/checklist', label: 'Checklist', Icon: ClipboardCheck },
  { href: '/history', label: 'History', Icon: Clock3 },
  { href: '/documents', label: 'Documents', Icon: FileText },
  { href: '/inspector', label: 'Inspector', Icon: ShieldCheck },
  { href: '/settings', label: 'Settings', Icon: Settings },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="bottom-nav print:hidden" aria-label="Primary navigation">
      {LINKS.map(({ href, label, Icon }) => {
        const active = pathname === href || pathname.startsWith(`${href}/`);
        return (
          <Link key={href} href={href} className={active ? 'active' : ''} aria-current={active ? 'page' : undefined}>
            <Icon size={19} strokeWidth={1.8} aria-hidden />
            <span>{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
