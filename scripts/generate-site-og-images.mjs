// One-off/maintenance script: renders the static 1200x630 OG images used by
// src/lib/seo/metadata.ts (siteMetadata()) for the public pages. Run
// manually with `node scripts/generate-site-og-images.mjs` whenever the
// template needs a visual tweak — output is committed as static PNGs, not
// generated per-request.
import { ImageResponse } from 'next/og.js';
import { writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';

const OUT_DIR = path.join(process.cwd(), 'public', 'og', 'site');

const COLORS = {
  ink: '#15181B',
  inkSoft: '#3C4247',
  flame: '#E4572E',
  flameDeep: '#B83E1D',
  led: '#7FF0D4',
  white: '#FFFFFF',
};

function h(type, props, ...children) {
  const filtered = children.filter(Boolean);
  const c = filtered.length === 0 ? undefined : filtered.length === 1 ? filtered[0] : filtered;
  return { type, props: { ...props, children: c } };
}

function logoMark() {
  return h(
    'div',
    {
      style: {
        display: 'flex',
        width: 56,
        height: 56,
        borderRadius: 12,
        background: COLORS.ink,
        color: COLORS.led,
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 22,
        fontWeight: 500,
      },
    },
    '°F',
  );
}

function ogTemplate({ title, badge }) {
  return h(
    'div',
    {
      style: {
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: 80,
        background: `linear-gradient(135deg, ${COLORS.ink} 0%, #20262C 100%)`,
        fontFamily: 'sans-serif',
      },
    },
    h(
      'div',
      { style: { display: 'flex', alignItems: 'center', gap: 16 } },
      logoMark(),
      h('span', { style: { color: COLORS.white, fontSize: 32, fontWeight: 700 } }, 'Solo Truck'),
    ),
    h(
      'div',
      { style: { display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 920 } },
      badge &&
        h(
          'span',
          {
            style: {
              display: 'flex',
              alignSelf: 'flex-start',
              background: COLORS.flame,
              color: COLORS.white,
              fontSize: 24,
              fontWeight: 600,
              padding: '6px 18px',
              borderRadius: 999,
            },
          },
          badge,
        ),
      h(
        'span',
        { style: { color: COLORS.white, fontSize: 58, fontWeight: 700, lineHeight: 1.15 } },
        title,
      ),
    ),
    h(
      'span',
      { style: { color: 'rgba(255,255,255,0.75)', fontSize: 26 } },
      'solotruck.app — inspector-proof daily logs for food trucks',
    ),
  );
}

const IMAGES = [
  { slug: 'default', title: 'Your paper temp log, but inspector-proof', badge: null },
  {
    slug: 'founding-trucks',
    title: 'Become a Founding Truck — 3 months free',
    badge: 'Founding Trucks',
  },
  {
    slug: 'compare-auditbinder',
    title: 'Got your HACCP binder? Now keep it alive.',
    badge: 'Solo Truck vs AuditBinder',
  },
  {
    slug: 'compare-fooddocs',
    title: 'Built for one truck, not a restaurant chain',
    badge: 'Solo Truck vs FoodDocs',
  },
  {
    slug: 'tools',
    title: 'Free compliance tools for food truck owners',
    badge: 'Free Tools',
  },
];

await mkdir(OUT_DIR, { recursive: true });

for (const { slug, title, badge } of IMAGES) {
  const res = new ImageResponse(ogTemplate({ title, badge }), { width: 1200, height: 630 });
  const buf = Buffer.from(await res.arrayBuffer());
  await writeFile(path.join(OUT_DIR, `${slug}.png`), buf);
  console.log(`wrote ${slug}.png (${buf.length} bytes)`);
}
