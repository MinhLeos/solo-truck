import { ArrowUpRight, Check, Flame } from 'lucide-react'

const tools = [
  {
    number: '01',
    href: '/tools/temp-danger-zone',
    title: 'Temp Danger Zone Checker',
    description: "Enter a temperature and how long it's been sitting out — see if it's still safe per the FDA Food Code.",
    icon: '°F',
  },
  {
    number: '02',
    href: '/tools/inspection-readiness',
    title: 'Inspection Readiness Quiz',
    description: '12 quick questions → a score and a downloadable PDF you can act on before an inspector shows up.',
    icon: '12',
  },
]

export default function ToolsPage() {
  return (
    <main className="tools-page">
      <header className="tools-header">
        <a className="tools-brand" href="/">
          <span><Flame size={16} fill="currentColor" /></span>
          Solo Truck
        </a>
        <nav className="tools-nav" aria-label="Tools navigation">
          <a className="tools-all" href="/tools">All tools</a>
          <a className="tools-try" href="/#pricing">Try Solo Truck free →</a>
        </nav>
      </header>

      <section className="tools-directory" aria-labelledby="tools-title">
        <div className="tools-intro">
          <p className="tools-kicker"><span />Solo Truck / Free tools</p>
          <h1 id="tools-title">Free tools for food truck owners</h1>
          <p className="tools-subtext">No signup, no login —<br className="tools-desktop-break" /> just the calculator or quiz. Nothing here touches your Solo Truck account.</p>
        </div>

        <div className="tools-list">
          {tools.map((tool) => (
            <a className="tool-card" href={tool.href} key={tool.number}>
              <div className="tool-card-top">
                <span className="tool-number">{tool.number}</span>
                <span className="tool-mark" aria-hidden="true">{tool.icon}</span>
              </div>
              <div className="tool-card-copy">
                <h2>{tool.title}</h2>
                <p>{tool.description}</p>
              </div>
              <span className="tool-arrow" aria-hidden="true"><ArrowUpRight size={19} /></span>
            </a>
          ))}
        </div>
      </section>

      <footer className="tools-footer">
        <p><Check size={14} />Free tool by Solo Truck — the 30-second daily compliance log for food trucks.</p>
        <a href="/#pricing">Try Solo Truck free →</a>
      </footer>
    </main>
  )
}
