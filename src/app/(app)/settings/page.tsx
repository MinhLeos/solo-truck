import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
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
      <div className="page-intro">
        <h1>Settings</h1>
      </div>
      <div className="flex flex-col gap-3">
        {LINKS.map((link) => (
          <Link key={link.href} href={link.href}>
            <Card className="data-row hover:border-[#b9d3c2]">
              <div>
                <h3>{link.label}</h3>
                <p>{link.description}</p>
              </div>
              <ChevronRight size={18} className="shrink-0 text-[#839089]" aria-hidden />
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
