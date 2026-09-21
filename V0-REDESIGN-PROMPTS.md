# V0-REDESIGN-PROMPTS.md — Prompt v0.dev cho redesign UI toàn bộ trang
*(Sinh 2026-09-18, sửa lại 2026-09-18: mỗi prompt giờ trích **nguyên văn**
nội dung thật đang có trên trang (copy từ code, không bịa) — mục tiêu là
**chỉ đổi style/layout/màu**, giữ nguyên 100% nội dung. Bảng màu để V0 tự
chọn theo ngành (xem Brief), không ép theo token cũ. Mobile-first, ưu tiên
điện thoại, one-thumb reachable.)*

**Cách dùng:** dán Design System Brief 1 lần vào v0 Project Instructions
(nếu có), rồi chạy từng prompt trang trong cùng project để giữ nhất quán.
Mỗi prompt có 2 phần: **NỘI DUNG THẬT (giữ nguyên)** — copy chính xác từ
code, và **CẦN REDESIGN** — hướng thẩm mỹ/layout. Sau khi v0 ra code, merge
vào codebase thật cần review tay — v0 chỉ nên thay phần UI/JSX/className,
KHÔNG được đụng vào `enqueue()`, server actions, hay logic offline-first/
append-only đã có.

---

## 🎨 Design System Brief (dán 1 lần vào v0 Project Instructions)

```
BRAND: Solo Truck — daily compliance logging for independent food trucks.
Aesthetic direction: industrial commercial-kitchen HUD, not a soft consumer app.
Think: stainless steel prep table, kitchen display screen (KDS), thermometer
LCD readout, caution-tape urgency for warnings — rugged and high-contrast,
not rounded/cute. Users tap this one-thumb, mid-shift, hands sometimes greasy.

COLOR PALETTE: you choose it. Propose a full color system that fits the
industrial-kitchen-HUD direction above — you know this space better than a
fixed list would capture. Requirements on the palette, not the exact hex
values: a dark "ink" neutral for primary text/dark surfaces, a light
neutral for page background, one confident brand/accent color for primary
CTAs, a clear "in range / pass" success color, and a clear "out of range /
needs action" warning color that reads as urgent without looking like a
generic error state. Keep contrast high enough to read outdoors in
daylight glare. Reference (current, not mandatory) palette for context —
feel free to replace entirely: ink #15181B, steel #F2F4F5, flame #E4572E,
pass #1D9E75, led #7FF0D4 (HUD glow accent).

FONTS:
- Display/headers: a bold condensed sans in UPPERCASE with tight letter-
  spacing (currently Barlow Condensed) — open to an alternative in the same
  spirit.
- Body text: a clean humanist sans (currently Barlow).
- All numbers, timestamps, technical labels (°F readings, PIN, IDs): a
  monospace face (currently IBM Plex Mono) — this one matters, keep numbers
  monospace, it's core to the "HUD readout" feel.

RESPONSIVE RULE: mobile-first, design for a phone screen FIRST (390px wide),
then scale up. Every primary action must be a large thumb-reachable tap
target (min 48px height). Assume one-handed use, outdoors/kitchen glare,
sometimes wet or gloved fingers — no tiny tap targets, no hover-only actions.

TECH: Next.js App Router + Tailwind CSS v4. Define your palette as CSS
custom properties / Tailwind theme tokens (not one-off hex classes
scattered inline) so it can be ported back into the existing design-token
setup afterward.
```

---

## Public / Marketing

### 1. Landing page (`/`)
```
IMPORTANT: Only redesign the VISUAL STYLE of THIS page — layout, colors,
spacing, typography, component styling. Do NOT touch code/CSS belonging to
any other page or component in the project. Do NOT change, add, remove,
shorten, or paraphrase any text below — every heading, paragraph, and
label must appear exactly as written. Pure re-skin, not a rewrite.

--- ACTUAL CONTENT ON THIS PAGE (keep verbatim) ---
Nav: logo "Solo Truck" · links "How it works", "Features", "Pricing",
"FAQ" · CTA button "Start free trial".

Hero: eyebrow "For independent food trucks · US". Headline (3 lines):
"The inspector / doesn't call ahead. / Be ready anyway." (last line
accented). Subtext: "Solo Truck replaces the greasy clipboard on your
fridge. Log temps in 30 seconds, catch problems before they cost you
product, and hand any inspector 90 days of honest, time-stamped records —
in one tap." Two buttons: "Start your free trial" and "See how it works".
Below: "14-day free trial · No credit card · Works offline". Phone mockup
next to hero: a tilted "A — Inspection · Passed" placard, and a phone
screen titled "Today" with "🔥 23-day streak", three equipment rows —
"Walk-in fridge / Logged 10:42 AM / 37.4°F / In range", "Hot hold — chili /
Logged 10:44 AM / 141°F / In range", "Prep fridge / Logged 10:45 AM /
44.1°F / Action" (this one flagged) — and a big button "Log a temp".

Scrolling ticker (one continuous line, looping): "06:58 AM — Pre-shift
checklist complete (12/12)" / "07:15 AM — Walk-in fridge 38.1°F" /
"11:02 AM — Prep fridge 44.1°F → moved food, adjusted dial" (flagged) /
"11:26 AM — Prep fridge 39.8°F — back in range" / "02:30 PM — Hot hold
139°F" / "04:47 PM — Inspector Mode opened · 90-day report exported".

Section "Sound familiar?" / "Paper logs are where good trucks go to fail"
— 3 cards:
1. Stamp "Every routine inspection" / "Paperwork first, fridge second" /
   "Before an inspector opens a single cooler, they ask for your logs —
   and most expect 30–90 days of history. A soggy, half-filled clipboard
   is the fastest way to turn a routine visit into a deep dig."
2. Stamp "Inspectors know this trick" / "\"Perfect\" logs get you flagged"
   / "A column of 38°F written in the same pen, five minutes before the
   inspector walked up? They've seen it a thousand times. Fake-perfect
   paper logs invite scrutiny. Honest ones with corrective actions pass."
3. Stamp "One bad day" / "Failing costs more than a fine" / "A cooler
   that quietly died overnight can mean $500 of product in the trash, a
   failing grade, and your truck's name in the local paper. The trucks
   that survive catch it at 44°F — not 49°F."

Dark "truth panel" section — eyebrow "The part nobody tells you" /
"Honest logs pass. We make honest the easy way." / paragraph: "Solo Truck
doesn't help you look perfect — it helps you prove you're paying attention.
Every entry gets a real timestamp the moment you tap save, even with zero
signal inside your steel box. Caught a temp out of range? The app walks
you through the corrective action and attaches it to the record. That's
exactly the story inspectors want to see." Pull-quote blockquote: "\"If it
isn't documented, you didn't do it.\" Temperature logs are the first
records most health inspectors review — and a log that shows a problem
plus the fix reads better than a log that's suspiciously spotless."

Section "Built for a hot kitchen and one free hand" / "Three habits.
Thirty seconds each." — 3 steps:
1. "~2 min · before you open" / "Run the pre-shift check" / "Tap through
   the 12 things inspectors actually look for — hand sink stocked,
   sanitizer at strength, raw below ready-to-eat, tanks tight. Open the
   window knowing you'd pass right now."
2. "~30 sec · a few times a day" / "Log temps as you cook" / "Tap the
   fridge, punch the number, done. Out of range? The app asks what you
   did about it — moved food, adjusted the dial, tossed it — and saves
   the fix with the reading. No signal needed; it syncs later."
3. "1 tap · when it counts" / "Hand over Inspector Mode" / "Inspector at
   the window? One tap opens a clean, read-only report: 90 days of logs,
   checklists, permits, and corrective actions. Export a PDF on the spot
   if they want paper."

Section "Everything you need. Nothing you don't." / "Built for one truck,
not a restaurant chain" / subtext: "No sensors to buy. No staff training
day. No 40-page setup. If you can text, you can run Solo Truck." — 6
feature items (title + body):
- "Works with zero bars" — "Log inside your steel box with no signal.
  Everything queues on your phone and syncs the moment you're back
  online — nothing is ever lost."
- "Timestamps you can't fake" — "Every entry is stamped the second you
  save it and can't be edited after the fact. That's not a limitation —
  that's what makes your records worth trusting."
- "Corrective actions, guided" — "Out-of-range readings walk you through
  the fix and attach it to the log — the exact paper trail inspectors
  respect most."
- "Permit & document vault" — "Permits, commissary agreement, food
  manager cert — photographed once, always on hand, with a heads-up 30
  days before anything expires."
- "Reminders that respect your day" — "Nudges during your service hours
  only. Day off? Total silence. Your streak counter turns compliance into
  a habit you'll actually keep."
- "Your data, always yours" — "Export everything to PDF or CSV any time.
  Even if you cancel, you can still read and export your records. No
  hostages here."

Section "Where Solo Truck fits" / "The missing middle" / subtext: "Binder
generators set you up, then leave you with paper. Enterprise platforms
start at $169/month and assume you have a staff. You need the layer in
between." Comparison table, 4 columns (What you need / Binder generators /
Solo Truck / Enterprise platforms), 6 rows:
- Daily digital temp logs: "Paper sheets to print" / "Yes — 30 sec/entry"
  / "Yes"
- Works offline in the truck: "—" / "Yes, built for it" / "Varies"
- One-tap inspector report: "—" / "Yes + PDF on the spot" / "Yes"
- Setup time: "Minutes" / "5 minutes" / "Days + training"
- Built for a 1–3 person truck: "Partly" / "Entirely" / "No — chains &
  kitchens"
- Price: "~$50–100 once" / "$24/month" / "$169+/month"
Caption below: "Already have a HACCP binder? Great — keep it. Solo Truck
is what keeps it alive between inspections."

Section "Pricing" / "Less than one failed batch of chili" — 2 plan cards:
"Monthly $24/month — Unlimited logs & checklists" and "Yearly $190/year —
Save 34% vs. monthly" (this one highlighted), each with its own "Start
free trial" button. Below: feature checklist — "Unlimited temp logs &
checklists", "Inspector Mode + PDF export", "Document vault with expiry
alerts", "Offline logging & sync", "Email support from a real human".
Line below: "14-day free trial · No credit card required · Full pricing
details" (last part links to /pricing).

Section (flame background) "Ready when you are" / "Start logging in 5
minutes" / "14 days free, no credit card. Set up your truck, log your
first temp, and see for yourself whether it fits your shift." Two
buttons: "Start your free trial" and "Or apply for Founding Trucks — 3
months free". Line below: "Founding Trucks: one cohort of up to 20
accepted trucks gets 3 months free + a direct line to the founder, in
exchange for 15 minutes of feedback a week."

Section "Questions" / "Fair questions, straight answers" — FAQ accordion,
6 items:
1. "Will my inspector actually accept digital logs?" — "Many health
   departments do, as long as you can pull them up on the spot — which is
   exactly what Inspector Mode is for. Some still prefer paper, so every
   report exports to a clean PDF you can print. Requirements vary by
   county; always verify with your local health authority."
2. "What if I have no signal at my spot?" — "That's the normal case, not
   the edge case. Solo Truck saves every log on your phone instantly and
   syncs when you're back in coverage. You'll see exactly what's waiting
   to sync — nothing disappears."
3. "Do I need to buy sensors or special thermometers?" — "No. Use the
   probe thermometer you already own. You read it, you tap it in, done.
   No hardware to buy, pair, or replace."
4. "Can I fix a log if I typed the wrong number?" — "Yes — you add a
   correction with a note, and both entries stay visible. Records can't
   be silently edited or deleted, because that's precisely what makes
   them credible when an inspector is looking at them."
5. "Is this a HACCP plan?" — "No — and that's on purpose. If you need a
   HACCP plan or binder, tools exist for that (and they're good). Solo
   Truck is what happens after setup: the daily logging that keeps your
   operation inspection-ready, every single shift."
6. "What happens to my records if I cancel?" — "You keep read access and
   can export everything to PDF or CSV, forever. We don't hold your
   compliance history hostage — it's yours."

Footer: "Solo Truck" / "Inspector-proof daily logs for independent food
trucks." Links: How it works, Pricing, FAQ, Start free trial, Founding
Trucks, Guide. Legal line: "Solo Truck is a record-keeping tool, not legal
or food-safety advice, and does not guarantee inspection outcomes. Default
thresholds follow the FDA Food Code; actual requirements vary by state and
county — always verify with your local health authority. © 2026 Solo
Truck."

--- CẦN REDESIGN ---
Layout, color palette, typography treatment, spacing, and component style
of every section above. Make the phone mockup feel like a real kitchen
thermometer HUD, not a generic app screenshot. Mobile-first — the ticker,
comparison table, and pricing cards all need a clean stacked mobile layout.
```

### 2. Pricing (`/pricing`)
```
IMPORTANT: Only redesign the VISUAL STYLE of THIS page. Do NOT touch code/
CSS belonging to any other page or component in the project. Do NOT
change, add, remove, or paraphrase any text below.

--- ACTUAL CONTENT ON THIS PAGE (keep verbatim) ---
H1: "One truck, one flat price". Subtext: "No per-employee fees, no
per-log fees, no enterprise sales call. $24/month or $190/year — same
features either way. Every account starts with a 14-day free trial, no
card required."

Two plan cards: "Monthly — $24/month — Cancel any time." and "Yearly —
$190/year — Save 34% vs. paying monthly." (highlighted). Each has its own
"Start free trial" button.

H2 "What's included, at every price" — checklist: "Unlimited temperature
logs & checklists — no per-entry or per-truck limits", "Corrective actions
with photo attachments", "Inspector Mode: one-tap read-only report, PDF
export on the spot", "Document vault for permits, commissary agreement,
certs — with expiry alerts", "Offline logging & sync — built for zero
bars inside a steel truck", "Export everything to PDF/CSV, any time, even
after you cancel", "Email support from the person actually building it".

H2 "What Solo Truck never does" — "No per-staff pricing, no sensor add-on
fees, no locked-in contract. Cancel any time — you keep read access and
can export everything, whether or not you're still subscribed."

Closing line: "Already talked to us and want a hand getting set up? See
what Founding Trucks get — 3 months free in exchange for weekly feedback,
limited to one 20-truck cohort across all referral sources."

--- CẦN REDESIGN ---
Layout, color palette, typography, spacing, card styling for the two
pricing cards (yearly should read as the recommended option), checklist
styling. Mobile: stack the two cards.
```

### 3. About (`/about`)
```
IMPORTANT: Only redesign the VISUAL STYLE of THIS page. Do NOT touch code/
CSS belonging to any other page or component in the project. Do NOT
change, add, remove, or paraphrase any text below.

--- ACTUAL CONTENT ON THIS PAGE (keep verbatim) ---
H1: "Why I'm building Solo Truck". Subtext: "The short version lives on
the homepage — this is the long one."

H2 "How I got here" — "I spent time in food truck communities —
r/foodtrucks, local Facebook groups, health inspection horror-story
threads — before writing a line of code. The pattern that stood out
wasn't that owners didn't know the rules. It was that keeping honest,
daily proof of following them meant a soggy clipboard on the fridge,
filled in from memory at the end of a rush, if at all." / "A missed
temperature check doesn't just risk a bad grade — it risks product in the
trash, a shut-down for the day, or worse. The trucks that pass
consistently aren't the ones with perfect-looking logs. They're the ones
that catch a problem early and write down what they did about it."

H2 "Why not just use a HACCP binder generator?" — "Tools like AuditBinder
are good at what they do: they get your food safety plan and paperwork
right on day one. What they don't do is help you keep proving, every
shift, that you're still following it. That's a different job — the daily
one — and it's the one Solo Truck is built for." / "Enterprise platforms
built for restaurant chains solve a different problem too: multiple
locations, sensor fleets, a compliance manager. A one-truck owner running
the line themselves doesn't need any of that, and shouldn't have to pay
for it."

H2 "How I'm building it" — "Solo Truck is built with up to 20 accepted
trucks in the Founding Trucks program — talking to them directly, shipping
what they actually hit friction on, skipping what sounds nice but nobody
asked for. I share real numbers and real mistakes, not a highlight reel."

H2 "Want to help shape it?" — "Start your free trial or apply for
Founding Trucks — either way, feedback goes straight to me, not a support
queue."

--- CẦN REDESIGN ---
Long-form readable article layout (like a blog post, not a dashboard).
Typography, spacing, heading treatment. Should read warm and personal —
this is a solo builder talking directly to another small business owner.
```

### 4. Founding Trucks (`/founding-trucks`)
```
IMPORTANT: Only redesign the VISUAL STYLE of THIS page. Do NOT touch code/
CSS belonging to any other page or component in the project. Do NOT
change, add, remove, or paraphrase any text below.

--- ACTUAL CONTENT ON THIS PAGE (keep verbatim) ---
Eyebrow: "Founding Trucks". H1: "Apply for one of 20 Founding Trucks spots
— free for 3 months." Subtext: "We're selecting up to 20 independent food
trucks across all referral sources to use Solo Truck daily and tell us,
weekly, what actually helps and what gets in the way. In exchange: 3
months free and a direct line to the person building it."

Offer checklist: "3 months free — no card, no trial countdown", "Direct
line to the founder — real answers, not a support queue", "15 minutes/week
telling us what's broken or missing", "Your name (if you want it) as an
early Solo Truck customer".

CTA button: "Apply — email us your truck" (opens a pre-filled email with
subject "Founding Truck application" and body prompting for truck/business
name, city/state, how they log temps today, and how they heard about
Founding Trucks).

Line below: "Applying does not reserve a spot. If the relevant
social/direct or partner allocation is full, qualified applicants may be
waitlisted. Every application is reviewed and gets a real reply from the
founder."

Secondary link: "See how it works first →" (to /guide).

--- CẦN REDESIGN ---
Single focused offer page, centered content, no distractions — this page
has one job: get an application. Layout, color, typography, button
styling.
```

### 5. Free tools index (`/tools`)
```
IMPORTANT: Only redesign the VISUAL STYLE of THIS page. Do NOT touch code/
CSS belonging to any other page (including the individual tool sub-pages,
which are separate prompts) or component in the project. Do NOT change,
add, remove, or paraphrase any text below.

--- ACTUAL CONTENT ON THIS PAGE (keep verbatim) ---
H1: "Free tools for food truck owners". Subtext: "No signup, no login —
just the calculator or quiz. Nothing here touches your Solo Truck
account."

Two cards linking to sub-pages:
1. "Temp Danger Zone Checker" — "Enter a temperature and how long it's
   been sitting out — see if it's still safe per the FDA Food Code."
2. "Inspection Readiness Quiz" — "12 quick questions → a score and a
   downloadable PDF you can act on before an inspector shows up."

Shared header/footer across all /tools pages: header has "Solo Truck"
logo + "All tools" link + "Try Solo Truck free →" link; footer has "Free
tool by Solo Truck — the 30-second daily compliance log for food trucks."
+ "Try Solo Truck free →" link.

--- CẦN REDESIGN ---
Simple directory/card-list layout. Header + footer should be minimal and
not feel gated or naggy.
```

### 6. Tool — Temp Danger Zone Checker (`/tools/temp-danger-zone-checker`)
```
IMPORTANT: Only redesign the VISUAL STYLE of THIS page. Do NOT touch code/
CSS belonging to any other page or component in the project. Do NOT
change the calculation logic, form field behavior, or any text below.

--- ACTUAL CONTENT ON THIS PAGE (keep verbatim) ---
H1: "Temp Danger Zone Checker". Subtext: "Food between 40°F and 140°F is
in the \"danger zone\" — bacteria grow fastest here. The FDA Food Code
gives you 2 hours (1 on a hot day) before it's no longer safe to serve."

Form: "Food temperature (°F)" number input, "Minutes sitting out" number
input, "Hot day — ambient air is 90°F or hotter" checkbox.

Result card, one of 4 verdicts:
- "Outside the danger zone — no clock running." + "Only 40°F–140°F counts
  as the danger zone — this temperature is outside it."
- "Still safe." + "The FDA Food Code allows [N] minutes in the danger zone
  (40°F–140°F)[ on a hot day]. [N] minute(s) left."
- "Use it soon — the clock is almost up." (same detail line pattern)
- "Discard it — past the safe window." + "...Time is up."

Small print: "This is a general FDA Food Code guideline, not a substitute
for your local health department's rules — verify with your local health
authority."

Closing line: "Tracking this by memory during a rush is how honest
mistakes turn into failed inspections. Solo Truck logs every reading in
30 seconds, with a timestamp that holds up when an inspector asks."

--- CẦN REDESIGN ---
Show the result like a kitchen safety gauge/dial, not a plain text answer
— make the verdict visually obvious at a glance from across a kitchen.
Layout, color, typography for the form and result card.
```

### 7. Tool — Inspection Readiness Quiz (`/tools/inspection-readiness-quiz`)
```
IMPORTANT: Only redesign the VISUAL STYLE of THIS page. Do NOT touch code/
CSS belonging to any other page or component in the project. Do NOT
change the quiz/scoring logic or any text below.

--- ACTUAL CONTENT ON THIS PAGE (keep verbatim) ---
H1: "Inspection Readiness Quiz". Subtext: "Answer honestly — these are the
same 12 checks a pre-shift routine should cover, and the ones inspectors
ask about first."

12 questions (exact wording comes from the app's own checklist question
bank — keep them dynamic/data-driven, don't hardcode placeholder text),
each with two buttons: "Yes" and "No".

Once all 12 answered, a score card appears: "[score] / [total] — [band
headline]" + band detail text, a "Download result as PDF" button (label
changes to "Preparing…" while exporting), and a closing line: "Solo Truck
runs this exact checklist every shift — so you already know where you
stand before an inspector does."

--- CẦN REDESIGN ---
Progress should be visible (e.g. "7 of 12 answered") so it doesn't feel
like a black box. Layout, color, typography for question rows, Yes/No
buttons, and the score reveal card.
```

### 8. Compare vs AuditBinder (`/compare/auditbinder`)
```
IMPORTANT: Only redesign the VISUAL STYLE of THIS page. Do NOT touch code/
CSS belonging to any other page or component in the project. Do NOT
change, add, remove, or paraphrase any text below.

--- ACTUAL CONTENT ON THIS PAGE (keep verbatim) ---
Eyebrow: "Solo Truck vs. AuditBinder". H1: "Got your HACCP binder? Great —
now keep it alive."

Paragraph: "AuditBinder is good at what it does: a one-time $47-97 tool
that generates your HACCP plan, CCP tables, SOPs, and a printable log
sheet. It sets you up on day one. What it doesn't do is log anything for
you after that — the binder just sits on the truck."

Two-column comparison:
- "AuditBinder" ("Day 0 setup — one-time"): ✓ HACCP plan generated for
  you, ✓ Printable log sheets, ✗ No daily logging — paper stays paper, ✗
  No corrective action tracking, ✗ No inspector-ready 90-day view.
- "Solo Truck" ("Every shift, from day 1 onward"): ✓ 30-second temp +
  checklist logging, ✓ Corrective actions required on out-of-range
  readings, ✓ Inspector Mode: 90 days, one tap, ✗ Doesn't write your
  HACCP plan for you.

Paragraph: "Honestly? Most trucks end up wanting both — AuditBinder to get
the paperwork right once, Solo Truck to prove, every day after, that
you're actually following it. A binder an inspector can't see updated
daily doesn't answer the question they actually ask: \"show me today's
log.\""

CTA button: "Try Solo Truck free →"

--- CẦN REDESIGN ---
Long-form readable comparison-article layout. Tone is respectful, not
attacking a competitor. Layout, color, typography for the two-column
comparison block.
```

### 9. Compare vs FoodDocs (`/compare/fooddocs`)
```
IMPORTANT: Only redesign the VISUAL STYLE of THIS page. Do NOT touch code/
CSS belonging to any other page or component in the project. Do NOT
change, add, remove, or paraphrase any text below.

--- ACTUAL CONTENT ON THIS PAGE (keep verbatim) ---
Eyebrow: "Solo Truck vs. FoodDocs". H1: "Built for one truck, not a
restaurant chain."

Paragraph: "FoodDocs is a real, capable platform — Bluetooth sensors,
staff training modules, multi-location dashboards, the works. That's
exactly right for a chain with a compliance manager and a budget. It's
also $169+/month and more setup than a solo owner running one truck needs
or wants."

Two-column comparison:
- "FoodDocs" ("$169+/month — built for chains"): ✓ Bluetooth sensor
  integration, ✓ Staff training + multi-location, ✗ Overkill for a 1-3
  person truck, ✗ Setup and training overhead.
- "Solo Truck" ("$24/month — built for one truck"): ✓ Set up in 5
  minutes, no training, ✓ Works offline in a metal box with weak signal,
  ✓ No sensors to buy or pair, ✗ No multi-location dashboard (yet).

Paragraph: "If you're opening truck #2 or #3 and need a manager overseeing
compliance across locations, FoodDocs is the right tool and we'd say so.
If it's still you, on one truck, logging with one thumb between orders —
that's exactly who Solo Truck is built for."

CTA button: "Try Solo Truck free →"

--- CẦN REDESIGN ---
Same layout pattern as the AuditBinder comparison page — keep visual
consistency between the two. Layout, color, typography.
```

### 10. Guide (`/guide`)
```
IMPORTANT: Only redesign the VISUAL STYLE of THIS page. Do NOT touch code/
CSS belonging to any other page or component in the project. Do NOT
change, add, remove, or paraphrase any text below. Screenshot images stay
as-is (placeholder blocks are fine) — only restyle their frame/border.

--- ACTUAL CONTENT ON THIS PAGE (keep verbatim) ---
Header: "Solo Truck" logo + "Try Solo Truck free →" link.
Eyebrow: "Getting started". H1: "Install Solo Truck and log your first
temperature in a few minutes." Subtext: "Solo Truck works best installed
on your home screen, like an app — it opens instantly and keeps logging
even with no signal in the kitchen. Here's how to get set up, and what
the day-to-day looks like."

H2 "Install on your device" — 3 groups, each a device name + numbered
steps:
- "iPhone / iPad (Safari)": "Open solotruck.app in Safari and sign in.",
  "A bar at the top says \"Install this app: tap Share, then 'Add to Home
  Screen'\".", "Tap the Share icon (square with an arrow) in Safari's
  toolbar.", "Scroll down and tap \"Add to Home Screen\", then \"Add\"."
  (has a screenshot)
- "Android (Chrome)": "Open solotruck.app in Chrome and sign in.",
  "Chrome shows an \"Install\" button in a bar at the bottom — tap it.",
  "Or: tap the ⋮ menu (top right) → \"Install app\" / \"Add to Home
  screen\"."
- "Desktop (Chrome / Edge)": "Open solotruck.app and sign in.", "Look for
  an install icon (a small monitor with a ↓) at the right end of the
  address bar.", "Click it, then click \"Install\". Solo Truck opens in
  its own window from now on."

H2 "How Solo Truck works, day to day" — 8 numbered steps, each title +
body + screenshot:
1. "Log a temperature in 30 seconds" — "Tap an equipment card, punch in
   the number on the big numpad, tap Save. That's it — no typing on a
   tiny keyboard."
2. "Out of range? Fix it, don't hide it" — "If a reading is outside the
   safe range, Solo Truck stops you and asks what you did about it —
   moved the food, adjusted the thermostat, called for repair. Inspectors
   trust an honest log with a corrective action far more than a
   suspiciously perfect one."
3. "Today's board, at a glance" — "Every piece of equipment shows its
   last reading, the time, and a ✓ or ⚠ — so you know at a glance what
   still needs checking today."
4. "Pre-shift checklist" — "Run through the standard pre-shift checks
   before you open — hand sink stocked, sanitizer at the right
   concentration, permits present. Tap to check each one off."
5. "History — nothing ever disappears" — "Every log stays on record,
   even the ones you got wrong. Made a mistake? Add a new entry
   explaining it — the old one stays visible, just marked. Nothing gets
   edited or deleted after the fact."
6. "Documents that don't expire quietly" — "Keep your health permit,
   commissary agreement, food manager certificate, and insurance in one
   place, with expiry reminders."
7. "Inspector Mode — one tap, ready to show" — "When an inspector shows
   up, open Inspector Mode: a clean read-only view of the last 30 or 90
   days — logs, checklists, documents — plus a PDF export or a 24-hour
   read-only link you can share."
8. "Billing, when you're ready" — "Every account starts with a 14-day
   free trial. Subscribe monthly or yearly whenever you're ready —
   reading your own data and exporting it is never blocked, even if a
   subscription lapses."

Closing card: "Ready to try it on your own truck?" + "Apply for Founding
Trucks — 3 months free →" button + "Already have an account? Sign in →"
link.

Footer line: "Solo Truck is a record-keeping tool, not legal or
food-safety advice, and does not guarantee passing an inspection."

--- CẦN REDESIGN ---
Numbered step layout, big readable typography, clear visual separation
between "install" and "how to use" sections. This is a reference doc a
stressed owner skims once — prioritize scannability.
```

### 11. Privacy Policy (`/privacy`)
```
IMPORTANT: Only redesign the VISUAL STYLE of THIS page. Do NOT touch code/
CSS belonging to any other page or component in the project. Do NOT
change, add, remove, or paraphrase any legal text below — wording matters
on a legal page.

--- ACTUAL CONTENT ON THIS PAGE (keep verbatim, section headers as H2) ---
H1 "Privacy Policy". "Last updated September 2026. This is a general
template, not legal advice — it should be reviewed by a professional
before you rely on it with real, paying customers."

"What we collect" — from the truck owner (email, business/truck name,
city/state, billing details handled by payment provider); operational
records (equipment names/thresholds, temp logs, checklist runs,
corrective actions with photos, permits/documents, staff names for PIN
attribution); automatically on public pages only (GA4 analytics).

"How we use it" — solely to run the app, showing logs/checklists/
documents back, computing range status, generating Inspector Mode
reports, sending trial/billing emails. Never sold, never used to
advertise.

"Analytics — public pages only" — GA4 on marketing site only (landing,
free tools, comparison pages, this page). Never loaded inside the app
itself — once signed in and logging, nothing is sent to analytics.
Compliance records are not product-analytics data.

"Records can't be silently edited or deleted" — append-only by design,
once saved an entry can't be altered/removed by anyone. Mistakes get a
correction with a note; both entries stay visible.

"Inspector Mode links" — random unguessable token, expiry the owner
controls, opening logs timestamp+IP shown to the owner.

"Documents & photos" — private bucket, short-lived signed URLs, never
scanned/sold/shared.

"Who we share data with" — bulleted: Supabase (hosting), Dodo Payments
(billing merchant of record), Resend (emails), Sentry (error monitoring,
scrubbed of PII), Google Analytics (public pages only). "We don't sell
your data to anyone, for any purpose."

"Your data, always yours" — export to PDF/CSV any time, keep read access
after cancelling.

"Contact" — privacy@solotruck.app.

--- CẦN REDESIGN ---
Legal-document layout: generous line height, max content width ~700px, no
decorative elements. "Last updated" date visible near the top.
```

### 12. Terms of Service (`/terms`)
```
IMPORTANT: Only redesign the VISUAL STYLE of THIS page. Do NOT touch code/
CSS belonging to any other page or component in the project. Do NOT
change, add, remove, or paraphrase any legal text below.

--- ACTUAL CONTENT ON THIS PAGE (keep verbatim, numbered H2 sections) ---
H1 "Terms of Service". "Last updated September 2026. This is a general
template, not legal advice — it should be reviewed by a professional
before you rely on it with real, paying customers."

1. "What Solo Truck is" — software for logging temps/checklists/
   corrective actions/documents, generating Inspector Mode reports.
2. "Your subscription and trial" — 14-day free trial, no card required.
   Billed monthly/yearly via Dodo Payments (merchant of record). Cancel
   any time, access continues until period paid for ends.
3. "Records are append-only — by design" — can't be edited/deleted once
   saved; corrections recorded alongside, both stay visible.
4. "Staff PIN is attribution, not a login" — 4-digit PIN identifies who
   logged an entry, not a security credential; device must be physically
   secured.
5. "Inspector Mode links are your responsibility" — owner controls
   creation/expiry/revocation; treat like a printed report.
6. "Not legal or food-safety advice" — record-keeping tool only, no
   guarantee of passing inspection; FDA Food Code defaults, verify with
   local authority.
7. "Your data, always yours" — export any time; account closure deletes
   data within 30 days except billing-record retention needs.
8. "Changes to these terms" — material changes announced by email first.
9. "Contact" — hello@solotruck.app, link to Privacy Policy.

--- CẦN REDESIGN ---
Same legal-document layout pattern as the Privacy Policy page — keep
visual consistency between the two.
```

---

## Auth

### 13. Login (`/login`)
```
IMPORTANT: Only redesign the VISUAL STYLE of THIS page. Do NOT touch code/
CSS belonging to any other page or component in the project. Do NOT
change any text, field names, or form behavior below.

--- ACTUAL CONTENT ON THIS PAGE (keep verbatim) ---
H1 "Sign in". Subtext "Welcome back." Google sign-in button. Divider
"or". Fields: Email (placeholder "you@example.com"), Password (placeholder
"••••••••"). Submit button "Sign in" (label becomes "Signing in…" while
pending). Below form: "Forgot password?" link and "Create an account"
link, side by side.

--- CẦN REDESIGN ---
Centered auth card on a page background. Should feel calm and fast — this
is opened quickly at the start of a shift.
```

### 14. Sign up (`/signup`)
```
IMPORTANT: Only redesign the VISUAL STYLE of THIS page. Do NOT touch code/
CSS belonging to any other page or component in the project. Do NOT
change any text, field names, or form behavior below.

--- ACTUAL CONTENT ON THIS PAGE (keep verbatim) ---
H1 "Create an account". Subtext "Set up your food truck." Google sign-in
button. Divider "or". Fields: Email (placeholder "you@example.com"),
Password (placeholder "At least 8 characters", min 8 chars). Submit
button "Create account" (label becomes "Creating account…" while
pending). Success state (replaces the form in the same card): "Check your
email to confirm your account, then sign in." Below: "Already have an
account? Sign in" link.

--- CẦN REDESIGN ---
Same centered auth-card pattern as Login — should look like siblings.
```

### 15. Forgot password (`/auth/forgot-password`)
```
IMPORTANT: Only redesign the VISUAL STYLE of THIS page. Do NOT touch code/
CSS belonging to any other page or component in the project. Do NOT
change any text or form behavior below.

--- ACTUAL CONTENT ON THIS PAGE (keep verbatim) ---
H1 "Reset your password". Subtext "Enter your email — if you have an
account, we'll send a reset link." Field: Email. Submit button "Send
reset link" (label becomes "Sending…" while pending). Success state
(replaces the form): "Check your email for a link to reset your
password." Below: "Back to sign in" link.

--- CẦN REDESIGN ---
Minimal centered card, same visual weight as the reset-password page —
this is a rarely-visited utility screen.
```

### 16. Reset password (`/auth/reset-password`)
```
IMPORTANT: Only redesign the VISUAL STYLE of THIS page. Do NOT touch code/
CSS belonging to any other page or component in the project. Do NOT
change any text or form behavior below.

--- ACTUAL CONTENT ON THIS PAGE (keep verbatim) ---
H1 "Choose a new password". Subtext "For [user's email]." Form fields:
new password + confirm password (exact field labels come from the
existing form component — keep them, just restyle).

--- CẦN REDESIGN ---
Minimal centered card — should look like a sibling of the forgot-password
page.
```

---

## Onboarding

### 17. Setup wizard (`/setup`)
```
IMPORTANT: Only redesign the VISUAL STYLE of THIS page and its 3 steps. Do
NOT touch code/CSS belonging to any other page or component in the
project. Do NOT change any text, field names, presets, or form behavior
below.

--- ACTUAL CONTENT ON THIS PAGE (keep verbatim) ---
3-step wizard with step labels "Truck", "Equipment", "Shifts" and a
progress indicator, Back/Next buttons.

Step 1 "Truck": fields "Truck name" (placeholder "Rosa's Tacos"), "City"
(placeholder "Austin"), "State" (2-letter, placeholder "TX"), "Unit type"
dropdown (Truck / Trailer / Cart).

Step 2 "Equipment": helper text "Tap to add — thresholds prefill with FDA
defaults, editable below." Preset buttons per equipment type (e.g. "+
Walk-in fridge", labels come from the app's equipment presets — keep
dynamic). Each added row: name text input, "min °F" number input, "max
°F" number input, a remove (✕) button. Empty state: "Add at least one
piece of equipment to continue."

Step 3 "Shifts": helper text "Which days do you sell? Optional — you can
skip this and add shifts later." 7 day toggle buttons (Sun–Sat). When any
day selected: "Open" time picker and "Close" time picker (shared across
all selected days).

--- CẦN REDESIGN ---
Fast, low-friction feel (target: done in under 5 minutes). Progress
indicator, step transitions, form field styling, day-toggle buttons.
```

---

## App (đã đăng nhập — phần cần "công nghiệp hoá" nhất)

### 18. App shell — header, bottom nav, billing banner (dùng chung mọi trang app)
```
IMPORTANT: This is a SHARED layout shell used by every authenticated app
page (Today, Checklist, History, Documents, Inspector, Settings). Only
redesign the VISUAL STYLE of this shell. Do NOT touch code/CSS belonging
to any individual page's own content — those are separate prompts and
must stay independently editable. Do NOT change any text or behavior
below.

--- ACTUAL CONTENT ON THIS SHELL (keep verbatim) ---
Header: shows the truck's name (dynamic). An install-PWA prompt banner
appears when relevant (not on this page's design scope — treat as a
placeholder banner slot). Below the header, an optional billing banner
strip — one of these exact messages depending on subscription state:
"Your trial has ended. Subscribe to keep logging new entries." / "Your
trial ends in [N] day(s). Subscribe to keep using Solo Truck." / "We
couldn't process your last payment. Update your payment method to avoid
losing access." / "Your subscription is set to cancel at the end of the
current period." / "Your subscription has ended. Subscribe to keep
logging new entries." A subtle offline/sync status indicator sits near
the header too.

Bottom tab bar, 6 items with these exact labels: "Today", "Checklist",
"History", "Documents", "Inspector", "Settings".

--- CẦN REDESIGN ---
This is the frame a user sees dozens of times a shift — it should feel
like a rugged kitchen device. Bottom nav must work one-thumb on a phone,
active tab clearly highlighted, icons + labels both visible. Billing
banner should read as a soft warning strip, never a blocking modal, never
nagging.
```

### 19. Today (`/today`) — vòng lặp log nhiệt độ chính
```
IMPORTANT: Only redesign the VISUAL STYLE of THIS page and its own sheets/
modals (numpad, staff PIN entry, corrective action). Do NOT touch the
shared app shell, bottom nav, or any other page's code/CSS. Do NOT change
any text, field behavior, or the underlying save/offline-queue logic —
this is a pure visual re-skin.

--- ACTUAL CONTENT ON THIS PAGE (keep verbatim) ---
H1 "Today". Streak counter next to it: "🔥 [N] day(s)" (only shown when
streak > 0).

Equipment list: each is a tappable card showing the equipment name, its
threshold range formatted as "[min]°F – [max]°F" (or "≥ [min]°F" / "≤
[max]°F" / "No threshold set" depending on what's configured), and — if
logged today — the reading as "✓ [temp]°F" (in range) or "⚠ [temp]°F" (out
of range), plus the time and "· [logged by name]" if a staff PIN was
used. If not logged yet today: "No log yet today".

Tapping a card opens a custom numpad sheet: title = equipment name, a big
display of the number being typed with the unit "°F", a 3-column key grid
(1–9, ., 0, ⌫), and "Cancel" / "Save" buttons (Save disabled until a valid
number is entered).

If staff PINs exist, a PIN entry sheet appears next (component exists
already — keep its exact fields, just restyle).

If the reading is out of threshold, a mandatory corrective-action sheet
appears before saving: preset action types (moved food / adjusted
thermostat / discarded items / called repair / other + text), optional
note, optional photo. Copy tone here should read encouraging, not
punishing.

--- CẦN REDESIGN ---
The entire visual language of the equipment cards, the numpad sheet, PIN
sheet, and corrective-action sheet. In-range vs out-of-range states must
be instantly distinguishable from across a kitchen. Numpad stays a large
custom digit grid (never the system keyboard). This is the single
most-used screen — prioritize speed and glanceability above all else.
```

### 20. Checklist (`/checklist`)
```
IMPORTANT: Only redesign the VISUAL STYLE of THIS page. Do NOT touch the
shared app shell, bottom nav, or any other page's code/CSS. Do NOT change
any text or the toggle/save behavior.

--- ACTUAL CONTENT ON THIS PAGE (keep verbatim) ---
H1 "Pre-shift checklist". A list of rows, each a checklist item label
(dynamic, from the truck's own checklist setup — e.g. things like "hand
sink stocked", "sanitizer at strength") with a round checkbox that
toggles instantly on tap; checked items show muted/strikethrough text.

When every item is checked, the whole list is replaced by a full-screen
completion state: "✓" mark, "Ready to open" headline, and "All [N] checks
done for today." subtext.

--- CẦN REDESIGN ---
Large tappable rows, big round checkboxes, and a satisfying (but not
childish) full-screen completion state. This happens once a day and
should feel like a small win before a shift.
```

### 21. History (`/history`)
```
IMPORTANT: Only redesign the VISUAL STYLE of THIS page and its own
"correction" sub-form. Do NOT touch the shared app shell, bottom nav, or
any other page's code/CSS. Do NOT change any text or the append-only/
correction logic.

--- ACTUAL CONTENT ON THIS PAGE (keep verbatim) ---
H1 "History". Entries grouped by day (date label per group). Each entry
row: "[equipment name] — [temp]°F" with a "⚠" if out of threshold, the
time, and "· [logged by]" if applicable. Entries can never be edited or
deleted — instead each (non-superseded) row has a "This was a mistake"
button that opens an inline correction form (reason required, minimum 5
characters). Once corrected, the original entry shows with a light
strikethrough/faded style, and "Corrected: [reason]" appears beneath it —
both stay visible. Empty state: "No logs yet."

--- CẦN REDESIGN ---
Day grouping, entry row styling, and the inline correction form. Make the
append-only nature feel like a feature ("nothing here can quietly
disappear"), not a limitation.
```

### 22. Documents (`/documents`)
```
IMPORTANT: Only redesign the VISUAL STYLE of THIS page and its own upload
form. Do NOT touch the shared app shell, bottom nav, or any other page's
code/CSS. Do NOT change any text or the upload/remove behavior.

--- ACTUAL CONTENT ON THIS PAGE (keep verbatim) ---
H1 "Documents". Subtext: "Permit, commissary agreement, certs — kept
private, viewable by inspectors in Inspector Mode."

Each document is a card: document type label (Health permit / Commissary
agreement / Food manager certificate / Insurance / Other), a status pill
— "Valid" / "Expiring soon" / "Expired" / "No expiry" (plus expiry date if
set), a "View" link (opens the file), and a "Remove" action. Empty state:
"No documents yet."

Below the list: an upload form (file picker + document type dropdown +
optional expiry date — exact fields come from the existing form
component, keep them).

--- CẦN REDESIGN ---
Document card layout, status pill styling (expiring-soon should read
"heads up", not alarmist), and the upload form.
```

### 23. Inspector — owner's dashboard (`/inspector`)
```
IMPORTANT: Only redesign the VISUAL STYLE of THIS page (the owner-facing
management view — NOT the public inspector-facing report at /i/[token],
which is a separate prompt). Do NOT touch the shared app shell, bottom
nav, or any other page's code/CSS. Do NOT change any text, export/print
behavior, or link-management logic.

--- ACTUAL CONTENT ON THIS PAGE (keep verbatim) ---
Range toggle: "30 days" / "90 days" links.

Report view (shared with the public report — see prompt 28 for its exact
content): truck name + "Temperature & Compliance Report — last [N] days"
subtitle, "Print backup" and "Export PDF" buttons (label becomes
"Exporting…" while working), tabs "Logs" / "Checklists" / "Documents", a
legal disclaimer footer line.

Below the report: "Share a read-only link with an inspector" panel —
"Link expires in 24h. You can revoke it anytime." Each active link shows
as a masked URL + "Revoke" button. "Generate new link" button.

--- CẦN REDESIGN ---
This screen should feel authoritative and audit-ready — an owner pulls
this up right when an inspector is at their window, so it needs to read
clearly under pressure. Range toggle, report tabs, and link-management
panel styling.
```

### 24. Settings hub (`/settings`)
```
IMPORTANT: Only redesign the VISUAL STYLE of THIS page. Do NOT touch the
shared app shell, bottom nav, or any other page's code/CSS. Do NOT change
any text or links below.

--- ACTUAL CONTENT ON THIS PAGE (keep verbatim) ---
H1 "Settings". 4 rows linking out: "Billing — Trial status, subscribe,
manage payment", "Staff — PINs for attribution on logs", "Account —
Password, sign-in method", "Getting started guide — Install steps + how
each screen works".

--- CẦN REDESIGN ---
Simple menu list, calm and utilitarian — this is the least-visited screen
in the app.
```

### 25. Settings → Billing (`/settings/billing`)
```
IMPORTANT: Only redesign the VISUAL STYLE of THIS page. Do NOT touch the
shared app shell, bottom nav, or any other page's code/CSS. Do NOT change
any text, prices, or checkout/portal behavior.

--- ACTUAL CONTENT ON THIS PAGE (keep verbatim) ---
H1 "Billing". Status card showing one of: "Free trial" (+ "Trial ends
[date]."), "Active" (+ "Renews [date]."), "Payment failed" (+ "Update your
payment method to avoid losing access."), "Cancelling" (+ "Access ends
[date]."), "Ended".

If not currently a paying/managed subscriber: two buttons — "Subscribe —
$24/month" and "Subscribe — $190/year (save 34%)".

If subscriber with a manageable subscription: "Manage subscription"
button.

--- CẦN REDESIGN ---
Status card and subscribe/manage buttons. Trial-ending and past-due states
should use a warning treatment without feeling threatening — clarity
matters more than salesmanship here.
```

### 26. Settings → Staff (`/settings/staff`)
```
IMPORTANT: Only redesign the VISUAL STYLE of THIS page and its own add
form. Do NOT touch the shared app shell, bottom nav, or any other page's
code/CSS. Do NOT change any text or the add/remove behavior.

--- ACTUAL CONTENT ON THIS PAGE (keep verbatim) ---
H1 "Staff". Subtext: "PINs are for attribution only — not a login or
security mechanism."

Each staff member is a row: name + "PIN [4 digits]" + "Remove" button.
Empty state: "No staff added yet — logs won't ask for a PIN."

Below: an "add staff" form (name field + 4-digit PIN field — exact fields
come from the existing form component, keep them).

--- CẦN REDESIGN ---
Staff row styling and the add form. Keep the "PIN is attribution, not
security" note visible and legible, not buried.
```

### 27. Settings → Account (`/settings/account`)
```
IMPORTANT: Only redesign the VISUAL STYLE of THIS page and its own forms.
Do NOT touch the shared app shell, bottom nav, or any other page's code/
CSS. Do NOT change any text or form behavior.

--- ACTUAL CONTENT ON THIS PAGE (keep verbatim) ---
H1 "Account". Subtext: "Signed in as [email] · via [provider]".

If the account has a password: "Change password" label + change-password
form.

If the account is Google-only: "Set a password" label + "You currently
sign in with Google only. Add a password to also be able to sign in with
email." + set-password form.

--- CẦN REDESIGN ---
Simple stacked form card. Utilitarian, low visual priority.
```

---

## Public Inspector Report

### 28. Public Inspector Mode view (`/i/[token]`)
```
IMPORTANT: Only redesign the VISUAL STYLE of THIS page — the standalone
public report an inspector opens from a shared link. It has NO app shell,
no bottom nav, no sign-in. Do NOT touch any authenticated app page or the
owner's own /inspector dashboard code. Do NOT change any text, the
read-only nature, or the export/print behavior.

--- ACTUAL CONTENT ON THIS PAGE (keep verbatim) ---
Truck name as H1. Subtitle: "Temperature & Compliance Report — last [30 or
90] days". "Print backup" and "Export PDF" buttons.

3 tabs: "Logs", "Checklists", "Documents".

Logs tab: a table with columns "Time" (shows "(logged offline, synced
later)" tag when applicable), "Equipment", "°F", "Status" (✓ In range /
⚠ Out of range), "Corrective action" (shows the action type + note when
present). Empty state: "No logs in this range."

Checklists tab: each checklist run shown with its timestamp, and a list of
items with "✓" or "☐" per item. Empty state: "No checklist runs in this
range."

Documents tab: current (non-expired) documents shown with their kind
label (Health permit / Commissary agreement / Food manager certificate /
Insurance / Other) and "Expires [date]" or "No expiry". Empty state: "No
current documents."

Footer disclaimer (always visible): the exact legal disclaimer text used
elsewhere — "Solo Truck is a record-keeping tool, not legal or
food-safety advice, and does not guarantee inspection outcomes. Default
thresholds follow the FDA Food Code; actual requirements vary by state and
county — always verify with your local health authority."

--- CẦN REDESIGN ---
Must look immediately credible and professional — zero playful/startup
styling, this needs to read as a serious compliance document a real
health inspector opens on their own phone at the truck window. Table
styling, tab styling, print-friendly layout.
```
