// Serwist's navigation fallback (src/app/sw.ts) serves this page whenever a
// document request fails with no network — precached at build time via
// additionalPrecacheEntries in src/app/serwist/[path]/route.ts.
export default function OfflineFallbackPage() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center bg-ink px-6 text-center text-white">
      <div className="max-w-sm">
        <h1 className="text-xl font-semibold">You&apos;re offline</h1>
        <p className="mt-2 text-sm text-white/70">
          No connection right now. Anything you logged is safely queued on this device and will
          sync automatically once you&apos;re back online.
        </p>
      </div>
    </div>
  );
}
