import Link from 'next/link';
import type { BillingBanner as BillingBannerType } from '@/lib/billing/access';

export function BillingBanner({ banner }: { banner: BillingBannerType | null }) {
  if (!banner) return null;

  return (
    <Link
      href="/settings/billing"
      className={`billing-strip print:hidden ${banner.urgent ? 'urgent' : ''}`}
    >
      {banner.message}
    </Link>
  );
}
