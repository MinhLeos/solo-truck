import Link from 'next/link';
import { Card } from '@/components/ui/card';

const LINKS = [
  { href: '/settings/billing', label: 'Billing', description: 'Trial status, subscribe, manage payment' },
  { href: '/settings/staff', label: 'Staff', description: 'PINs for attribution on logs' },
  { href: '/settings/account', label: 'Account', description: 'Password, sign-in method' },
  { href: '/guide', label: 'Getting started guide', description: 'Install steps + how each screen works' },
];

export default function SettingsPage() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-lg font-semibold text-ink">Settings</h1>
      <div className="flex flex-col gap-2">
        {LINKS.map((link) => (
          <Link key={link.href} href={link.href}>
            <Card className="flex flex-col">
              <span className="font-medium text-ink">{link.label}</span>
              <span className="text-sm text-ink-soft">{link.description}</span>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
