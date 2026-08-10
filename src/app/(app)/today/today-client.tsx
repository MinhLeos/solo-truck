'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { enqueue } from '@/lib/offline/queue';
import { isOutOfThreshold } from '@/lib/thresholds';
import type { LogPayload, TodayLog } from '@/lib/logs/types';
import type { CorrectiveActionPayload } from '@/lib/corrective-actions/types';
import { EquipmentCard } from './equipment-card';
import { NumpadSheet } from './numpad-sheet';
import { PinSheet } from './pin-sheet';
import { CorrectiveActionSheet } from './corrective-action-sheet';

interface Equipment {
  id: string;
  name: string;
  thresholdMin: number | null;
  thresholdMax: number | null;
}

interface Staff {
  name: string;
  pin: string;
}

type Step = 'numpad' | 'pin' | 'corrective-action' | null;

export function TodayClient({
  equipment,
  initialLogs,
  staff,
  streak,
  canWrite,
}: {
  equipment: Equipment[];
  initialLogs: Record<string, TodayLog>;
  staff: Staff[];
  streak: number;
  canWrite: boolean;
}) {
  const router = useRouter();
  const [logsByEquipment, setLogsByEquipment] = useState(initialLogs);
  const [activeEquipmentId, setActiveEquipmentId] = useState<string | null>(null);
  const [step, setStep] = useState<Step>(null);
  const [pendingTemperature, setPendingTemperature] = useState<number | null>(null);
  const [pendingLoggedBy, setPendingLoggedBy] = useState<string | null>(null);

  const activeEquipment = equipment.find((e) => e.id === activeEquipmentId) ?? null;

  function closeAll() {
    setActiveEquipmentId(null);
    setStep(null);
    setPendingTemperature(null);
    setPendingLoggedBy(null);
  }

  function applyOptimisticLog(temperature: number, loggedBy: string | null) {
    if (!activeEquipment) return;
    setLogsByEquipment((prev) => ({
      ...prev,
      [activeEquipment.id]: {
        id: `optimistic-${Date.now()}`,
        equipmentId: activeEquipment.id,
        temperature,
        recordedAt: new Date().toISOString(),
        isOutOfThreshold: isOutOfThreshold(
          temperature,
          activeEquipment.thresholdMin,
          activeEquipment.thresholdMax,
        ),
        loggedBy,
      },
    }));
  }

  async function commitLog(temperature: number, loggedBy: string | null) {
    if (!activeEquipment) return;
    const payload: LogPayload = { equipmentId: activeEquipment.id, temperature, loggedBy };
    await enqueue('log', payload);
    applyOptimisticLog(temperature, loggedBy);
    closeAll();
  }

  async function commitLogWithCorrectiveAction(
    temperature: number,
    loggedBy: string | null,
    ca: { actionType: string; note: string; photo: File | null },
  ) {
    if (!activeEquipment) return;
    const logPayload: LogPayload = { equipmentId: activeEquipment.id, temperature, loggedBy };
    const logClientId = await enqueue('log', logPayload);

    const caPayload: CorrectiveActionPayload = {
      logClientId,
      actionType: ca.actionType,
      note: ca.note,
      photo: ca.photo,
    };
    await enqueue('corrective_action', caPayload);

    applyOptimisticLog(temperature, loggedBy);
    closeAll();
  }

  function proceedAfterIdentification(temperature: number, loggedBy: string | null) {
    if (!activeEquipment) return;
    if (isOutOfThreshold(temperature, activeEquipment.thresholdMin, activeEquipment.thresholdMax)) {
      setPendingTemperature(temperature);
      setPendingLoggedBy(loggedBy);
      setStep('corrective-action');
    } else {
      void commitLog(temperature, loggedBy);
    }
  }

  function handleNumpadSave(temperature: number) {
    if (staff.length > 0) {
      setPendingTemperature(temperature);
      setStep('pin');
    } else {
      proceedAfterIdentification(temperature, null);
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold text-ink">Today</h1>
        {streak > 0 && (
          <span className="text-sm font-semibold text-flame">
            🔥 {streak} day{streak === 1 ? '' : 's'}
          </span>
        )}
      </div>
      {equipment.map((item) => (
        <EquipmentCard
          key={item.id}
          name={item.name}
          thresholdMin={item.thresholdMin}
          thresholdMax={item.thresholdMax}
          lastLog={logsByEquipment[item.id]}
          onTap={() => {
            // SECURITY.md §4: expired/trial-ended trucks keep read/export
            // access — only NEW writes are blocked, sent to billing instead
            // of the numpad the moment they'd try to start one.
            if (!canWrite) {
              router.push('/settings/billing');
              return;
            }
            setActiveEquipmentId(item.id);
            setStep('numpad');
          }}
        />
      ))}

      {activeEquipment && step === 'numpad' && (
        <NumpadSheet title={activeEquipment.name} onCancel={closeAll} onSave={handleNumpadSave} />
      )}

      {activeEquipment && step === 'pin' && pendingTemperature !== null && (
        <PinSheet
          staff={staff}
          onCancel={closeAll}
          onVerified={(staffName) => proceedAfterIdentification(pendingTemperature, staffName)}
        />
      )}

      {activeEquipment && step === 'corrective-action' && pendingTemperature !== null && (
        <CorrectiveActionSheet
          temperature={pendingTemperature}
          onCancel={closeAll}
          onSubmit={(ca) => void commitLogWithCorrectiveAction(pendingTemperature, pendingLoggedBy, ca)}
        />
      )}
    </div>
  );
}
