'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
}

function isIos(): boolean {
  return /iPad|iPhone|iPod/.test(navigator.userAgent) && !('MSStream' in window);
}

function isStandalone(): boolean {
  return window.matchMedia('(display-mode: standalone)').matches;
}

// Android/Chrome fire `beforeinstallprompt`; iOS Safari never does — without
// this split, iPhone owners (likely the majority of this product's users)
// would see no install path at all.
export function InstallPrompt() {
  const [deferredEvent, setDeferredEvent] = useState<BeforeInstallPromptEvent | null>(null);
  const [showIosHint, setShowIosHint] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (isStandalone()) return;

    if (isIos()) {
      // Browser-only fact (navigator.userAgent) computed after mount — not a
      // lazy useState initializer, since that would run during SSR too and
      // could disagree with the client's real device on hydration.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setShowIosHint(true);
      return;
    }

    function onBeforeInstallPrompt(event: Event) {
      event.preventDefault();
      setDeferredEvent(event as BeforeInstallPromptEvent);
    }

    window.addEventListener('beforeinstallprompt', onBeforeInstallPrompt);
    return () => window.removeEventListener('beforeinstallprompt', onBeforeInstallPrompt);
  }, []);

  if (dismissed || (!deferredEvent && !showIosHint)) return null;

  return (
    <div className="flex items-center justify-between gap-3 bg-ink px-4 py-2 text-sm text-white">
      {showIosHint ? (
        <span>Install this app: tap Share, then &quot;Add to Home Screen&quot;.</span>
      ) : (
        <span>Install Solo Truck for quick, one-tap access.</span>
      )}
      <div className="flex items-center gap-2">
        {deferredEvent && (
          <Button
            type="button"
            variant="secondary"
            className="border-none bg-white/10 text-white hover:bg-white/20"
            onClick={async () => {
              await deferredEvent.prompt();
              setDeferredEvent(null);
            }}
          >
            Install
          </Button>
        )}
        <button
          type="button"
          aria-label="Dismiss"
          onClick={() => setDismissed(true)}
          className="text-white/70 hover:text-white"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
