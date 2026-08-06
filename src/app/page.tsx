import { redirect } from 'next/navigation';

// The marketing site is the standalone landing-page.html (Phase 0 step 0.5),
// deployed separately. Anyone hitting the app's own root either has a
// session or doesn't — (app)/layout.tsx and /setup sort out where they
// actually belong, so this route just hands off to the app entry point.
export default function RootPage() {
  redirect('/today');
}
