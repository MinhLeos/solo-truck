'use client';

import { startTransition, useActionState, useEffect, useState } from 'react';
import { FormMessage } from '@/components/ui/form-message';
import { TruckStep } from './steps/truck-step';
import { EquipmentStep } from './steps/equipment-step';
import { ShiftsStep } from './steps/shifts-step';
import styles from './setup.module.css';
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

  const canAdvance = !((step === 0 && !truckValid) || (step === 1 && !equipmentValid));

  return (
    <>
      <nav className={styles.steps} aria-label="Setup progress">
        {STEP_LABELS.map((label, i) => (
          <div
            key={label}
            className={`${styles.step} ${i === step ? styles.active : ''} ${i < step ? styles.complete : ''}`}
            aria-current={i === step ? 'step' : undefined}
          >
            <span className={styles.stepNumber}>{i < step ? '✓' : i + 1}</span>
            <span>{label}</span>
          </div>
        ))}
      </nav>
      <div className={styles.progressTrack}>
        <span style={{ width: `${((step + 1) / STEP_LABELS.length) * 100}%` }} />
      </div>

      <section className={styles.card}>
        <div className={styles.panel}>
          <div className={styles.panelHeading}>
            <span className={styles.panelIcon}>0{step + 1}</span>
            <div>
              <h2>{STEP_LABELS[step]}</h2>
            </div>
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

          {state.status === 'error' && (
            <div className="mt-4">
              <FormMessage status="error">{state.message}</FormMessage>
            </div>
          )}
        </div>

        <div className={styles.actions}>
          <button
            type="button"
            className={styles.back}
            disabled={step === 0}
            onClick={() => setStep((s) => Math.max(0, s - 1))}
          >
            Back
          </button>
          {step < 2 ? (
            <button
              type="button"
              className={styles.next}
              disabled={!canAdvance}
              onClick={() => setStep((s) => Math.min(2, s + 1))}
            >
              Next<span aria-hidden="true">→</span>
            </button>
          ) : (
            <button
              type="button"
              className={styles.next}
              disabled={pending}
              onClick={() => startTransition(() => dispatch(data))}
            >
              {pending ? 'Finishing…' : 'Finish'}
              {!pending && <span aria-hidden="true">→</span>}
            </button>
          )}
        </div>
      </section>
    </>
  );
}
