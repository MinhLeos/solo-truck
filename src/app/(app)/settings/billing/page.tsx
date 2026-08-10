import { createClient } from '@/lib/supabase/server';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { startCheckoutAction, openPortalAction } from './actions';

const STATUS_LABEL: Record<string, string> = {
  trialing: 'Free trial',
  active: 'Active',
  past_due: 'Payment failed',
  cancelled: 'Cancelling',
  expired: 'Ended',
};

export default async function BillingSettingsPage() {
  const supabase = await createClient();
  const { data: truck } = await supabase.from('trucks').select('business_id').maybeSingle();

  const { data: subscription } = truck
    ? await supabase
        .from('subscriptions')
        .select('status, provider_customer_id, trial_ends_at, current_period_end')
        .eq('business_id', truck.business_id)
        .maybeSingle()
    : { data: null };

  const status = subscription?.status ?? 'expired';
  const canManage = status === 'active' || status === 'past_due' || status === 'cancelled';

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-lg font-semibold text-ink">Billing</h1>

      <Card className="flex flex-col gap-2">
        <p className="font-medium text-ink">{STATUS_LABEL[status] ?? status}</p>
        {status === 'trialing' && subscription?.trial_ends_at && (
          <p className="text-sm text-ink-soft">
            Trial ends {new Date(subscription.trial_ends_at).toLocaleDateString()}.
          </p>
        )}
        {status === 'active' && subscription?.current_period_end && (
          <p className="text-sm text-ink-soft">
            Renews {new Date(subscription.current_period_end).toLocaleDateString()}.
          </p>
        )}
        {status === 'cancelled' && subscription?.current_period_end && (
          <p className="text-sm text-ink-soft">
            Access ends {new Date(subscription.current_period_end).toLocaleDateString()}.
          </p>
        )}
        {status === 'past_due' && (
          <p className="text-sm text-ink-soft">Update your payment method to avoid losing access.</p>
        )}
      </Card>

      {!canManage && (
        <div className="flex flex-col gap-2">
          <form action={startCheckoutAction.bind(null, 'monthly')}>
            <Button type="submit" className="w-full">
              Subscribe — $24/month
            </Button>
          </form>
          <form action={startCheckoutAction.bind(null, 'yearly')}>
            <Button type="submit" variant="secondary" className="w-full">
              Subscribe — $190/year (save 34%)
            </Button>
          </form>
        </div>
      )}

      {canManage && subscription?.provider_customer_id && (
        <form action={openPortalAction.bind(null, subscription.provider_customer_id)}>
          <Button type="submit" variant="secondary">
            Manage subscription
          </Button>
        </form>
      )}
    </div>
  );
}
