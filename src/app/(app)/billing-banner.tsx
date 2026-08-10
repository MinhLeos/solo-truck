import Link from 'next/link';
import type { BillingBanner as BillingBannerType } from '@/lib/billing/access';

export function BillingBanner({ banner }: { banner: BillingBannerType | null }) {
  if (!banner) return null;

  return (
    <Link
      href="/settings/billing"
      className={`block px-4 py-1.5 text-center text-sm font-medium ${
        banner.urgent ? 'bg-flame text-white' : 'bg-warn-bg text-flame-deep'
      }`}
    >
      {banner.message}
    </Link>
  );
}
