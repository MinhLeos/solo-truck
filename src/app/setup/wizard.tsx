'use client';

import { startTransition, useActionState, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { FormMessage } from '@/components/ui/form-message';
import { TruckStep } from './steps/truck-step';
import { EquipmentStep } from './steps/equipment-step';
import { ShiftsStep } from './steps/shifts-step';
import { completeOnboarding, type OnboardingState } from './actions';
import {
  EMPTY_WIZARD_DATA,
  WIZARD_DRAFT_STORAGE_KEY,
  type WizardData,
} from '@/lib/onboarding/types';

const initialState: OnboardingState = { status: 'idle' };
const STEP_LABELS = ['Truck', 'Equipment', 'Shifts'];

export function Wizard() {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<WizardData>(EMPTY_WIZARD_DATA);
  const [hydrated, setHydrated] = useState(false);
  const [state, dispatch, pending] = useActionState(completeOnboarding, initialState);

  // Restore an in-progress draft on mount — a refresh or accidental tab close
  // mid-wizard shouldn't cost the whole "≤5 minutes" setup flow. On success
  // the server action redirects away entirely, so there's no matching
  // "clear the draft" step here — the stale sessionStorage entry is harmless
  // (tab-scoped, and /setup itself redirects to /today once a truck exists).
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(WIZARD_DRAFT_STORAGE_KEY);
      // One-time restore of browser-only state on mount, deliberately not a
      // lazy useState initializer: sessionStorage isn't available during
      // SSR, so reading it there would cause a hydration mismatch instead.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (raw) setData(JSON.parse(raw));
    } catch {
      // Corrupt/inaccessible sessionStorage — just start fresh.
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    sessionStorage.setItem(WIZARD_DRAFT_STORAGE_KEY, JSON.stringify(data));
  }, [data, hydrated]);

  if (!hydrated) return null;

  const truckValid = Boolean(data.truck.name && data.truck.city && data.truck.state);
  const equipmentValid = data.equipment.length >= 1;

  return (
    <div className="mt-6 flex flex-col gap-4">
      <div className="flex gap-3 text-xs font-medium text-ink-soft">
        {STEP_LABELS.map((label, i) => (
          <span key={label} className={i === step ? 'text-flame' : ''}>
            {i + 1}. {label}
          </span>
        ))}
      </div>

      {step === 0 && (
        <TruckStep data={data.truck} onChange={(truck) => setData({ ...data, truck })} />
      )}
      {step === 1 && (
        <EquipmentStep
          items={data.equipment}
          onChange={(equipment) => setData({ ...data, equipment })}
        />
      )}
      {step === 2 && (
        <ShiftsStep shifts={data.shifts} onChange={(shifts) => setData({ ...data, shifts })} />
      )}

      {state.status === 'error' && <FormMessage status="error">{state.message}</FormMessage>}

      <div className="flex justify-between">
        <Button
          type="button"
          variant="secondary"
          disabled={step === 0}
          onClick={() => setStep((s) => Math.max(0, s - 1))}
        >
          Back
        </Button>
        {step < 2 ? (
          <Button
            type="button"
            disabled={(step === 0 && !truckValid) || (step === 1 && !equipmentValid)}
            onClick={() => setStep((s) => Math.min(2, s + 1))}
          >
            Next
          </Button>
        ) : (
          <Button
            type="button"
            disabled={pending}
            onClick={() => startTransition(() => dispatch(data))}
          >
            {pending ? 'Finishing…' : 'Finish'}
          </Button>
        )}
      </div>
    </div>
  );
}
