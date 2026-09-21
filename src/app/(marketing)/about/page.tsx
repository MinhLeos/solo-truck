import type { Metadata } from 'next';
import { CtaLink } from '@/components/analytics/CtaLink';
import { siteMetadata } from '@/lib/seo/metadata';

export const metadata: Metadata = siteMetadata({
  title: 'About — Solo Truck',
  description:
    'Why an independent developer is building daily compliance logging and Inspector Mode for solo food trucks, built in public with a 20-operator Founding Trucks cohort.',
  path: '/about',
});

export default function AboutPage() {
  return (
    <article className="flex flex-col gap-5 [&_h2]:mt-8 [&_h2]:font-display [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:uppercase [&_h2]:tracking-wide [&_h2]:text-ink [&_p]:text-ink-soft [&_a]:font-medium [&_a]:text-flame">
      <h1 className="font-display text-3xl font-extrabold uppercase tracking-wide text-ink">
        Why I&apos;m building Solo Truck
      </h1>
      <p className="text-sm text-ink-soft">The short version lives on the homepage — this is the long one.</p>

      <h2>How I got here</h2>
      <p>
        I spent time in food truck communities — r/foodtrucks, local Facebook groups, health
        inspection horror-story threads — before writing a line of code. The pattern that stood
        out wasn&apos;t that owners didn&apos;t know the rules. It was that keeping honest, daily
        proof of following them meant a soggy clipboard on the fridge, filled in from memory at
        the end of a rush, if at all.
      </p>
      <p>
        A missed temperature check doesn&apos;t just risk a bad grade — it risks product in the
        trash, a shut-down for the day, or worse. The trucks that pass consistently aren&apos;t
        the ones with perfect-looking logs. They&apos;re the ones that catch a problem early and
        write down what they did about it.
      </p>

      <h2>Why not just use a HACCP binder generator?</h2>
      <p>
        Tools like AuditBinder are good at what they do: they get your food safety plan and
        paperwork right on day one. What they don&apos;t do is help you keep proving, every
        shift, that you&apos;re still following it. That&apos;s a different job — the daily one —
        and it&apos;s the one Solo Truck is built for.
      </p>
      <p>
        Enterprise platforms built for restaurant chains solve a different problem too: multiple
        locations, sensor fleets, a compliance manager. A one-truck owner running the line
        themselves doesn&apos;t need any of that, and shouldn&apos;t have to pay for it.
      </p>

      <h2>How I&apos;m building it</h2>
      <p>
        Solo Truck is built with up to 20 accepted trucks in the{' '}
        <CtaLink page="about" href="/founding-trucks">Founding Trucks program</CtaLink> — talking to them directly,
        shipping what they actually hit friction on, skipping what sounds nice but nobody asked
        for. I share real numbers and real mistakes, not a highlight reel.
      </p>

      <h2>Want to help shape it?</h2>
      <p>
        <CtaLink page="about" href="/signup">Start your free trial</CtaLink> or{' '}
        <CtaLink page="about" href="/founding-trucks">apply for Founding Trucks</CtaLink> — either
        way, feedback goes straight to me, not a support queue.
      </p>
    </article>
  );
}
