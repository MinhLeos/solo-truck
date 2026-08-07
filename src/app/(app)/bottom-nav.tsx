import Link from 'next/link';

const LINKS = [
  { href: '/today', label: 'Today' },
  { href: '/checklist', label: 'Checklist' },
  { href: '/history', label: 'History' },
  { href: '/settings/staff', label: 'Staff' },
];

export function BottomNav() {
  return (
    <nav className="flex border-t border-steel-deep bg-card">
      {LINKS.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className="flex-1 py-3 text-center text-sm text-ink-soft hover:text-ink"
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
}
