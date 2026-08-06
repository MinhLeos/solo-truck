import { createSerwistRoute } from '@serwist/turbopack';

// A fresh id per build is enough to bust the precache manifest on deploy —
// no need to shell out to git (this repo may build in environments without
// a .git directory, e.g. a fresh checkout or certain deploy pipelines).
const revision = crypto.randomUUID();

export const { dynamic, dynamicParams, revalidate, generateStaticParams, GET } = createSerwistRoute({
  additionalPrecacheEntries: [{ url: '/~offline', revision }],
  swSrc: 'src/app/sw.ts',
  useNativeEsbuild: true,
});
