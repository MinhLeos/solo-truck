'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FormMessage } from '@/components/ui/form-message';
import { enqueue } from '@/lib/offline/queue';
import type { LogPayload } from '@/lib/logs/types';

export function SupersedeForm({
  logId,
  equipmentId,
  onDone,
}: {
  logId: string;
  equipmentId: string;
  onDone: () => void;
}) {
  const [temperature, setTemperature] = useState('');
  const [reason, setReason] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const temp = Number(temperature);
    if (temperature === '' || Number.isNaN(temp)) {
      setError('Enter the correct temperature.');
      return;
    }
    if (reason.trim().length < 5) {
      setError('Explain what happened (at least 5 characters).');
      return;
    }

    setPending(true);
    const payload: LogPayload = {
      equipmentId,
      temperature: temp,
      supersedesLogId: logId,
      supersedeReason: reason.trim(),
    };
    await enqueue('log', payload);
    setPending(false);
    onDone();
  }

  return (
    <form onSubmit={handleSubmit} className="mt-2 flex flex-col gap-2 border-t border-steel-deep pt-2">
      <div className="flex gap-2">
        <Input
          type="number"
          step="0.1"
          placeholder="Correct °F"
          value={temperature}
          onChange={(e) => setTemperature(e.target.value)}
          className="w-28"
        />
        <Input
          type="text"
          placeholder="What happened? (≥5 chars)"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          className="flex-1"
        />
      </div>
      {error && <FormMessage status="error">{error}</FormMessage>}
      <div className="flex gap-2">
        <Button type="button" variant="secondary" onClick={onDone} className="flex-1">
          Cancel
        </Button>
        <Button type="submit" disabled={pending} className="flex-1">
          {pending ? 'Saving…' : 'Submit correction'}
        </Button>
      </div>
    </form>
  );
}
