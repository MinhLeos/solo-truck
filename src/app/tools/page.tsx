import Link from 'next/link';
import type { Metadata } from 'next';
import { Card } from '@/components/ui/card';

export const metadata: Metadata = {
  title: 'Free Food Truck Compliance Tools — Solo Truck',
  description:
    'Free tools for food truck owners: check if food is still safe out of the danger zone, and see how ready you are for a health inspection.',
};

const TOOLS = [
  {
    href: '/tools/temp-danger-zone-checker',
    title: 'Temp Danger Zone Checker',
    description:
      'Enter a temperature and how long it’s been sitting out — see if it’s still safe per the FDA Food Code.',
  },
  {
    href: '/tools/inspection-readiness-quiz',
    title: 'Inspection Readiness Quiz',
    description: '12 quick questions → a score and a downloadable PDF you can act on before an inspector shows up.',
  },
];

export default function ToolsIndexPage() {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-xl font-semibold text-ink">Free tools for food truck owners</h1>
        <p className="mt-1 text-sm text-ink-soft">
          No signup, no login — just the calculator or quiz. Nothing here touches your Solo Truck
          account.
        </p>
      </div>
      <div className="flex flex-col gap-3">
        {TOOLS.map((tool) => (
          <Link key={tool.href} href={tool.href}>
            <Card className="flex flex-col gap-1">
              <span className="font-medium text-ink">{tool.title}</span>
              <span className="text-sm text-ink-soft">{tool.description}</span>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
