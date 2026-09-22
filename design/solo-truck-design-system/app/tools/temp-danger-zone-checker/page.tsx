'use client'

import { useMemo, useState } from 'react'
import { ArrowLeft, ArrowRight, Check, Flame, Gauge, Thermometer, TriangleAlert } from 'lucide-react'

export default function TempDangerZoneChecker() {
  const [temperature, setTemperature] = useState('')
  const [minutes, setMinutes] = useState('')
  const [hotDay, setHotDay] = useState(false)

  const result = useMemo(() => {
    const temp = Number(temperature)
    const elapsed = Number(minutes)
    if (!temperature || !minutes || temp < 40 || temp > 140) return { type: 'outside', remaining: 0, limit: hotDay ? 60 : 120 }
    const limit = hotDay ? 60 : 120
    const remaining = limit - elapsed
    if (remaining <= 0) return { type: 'discard', remaining: 0, limit }
    if (remaining <= 20) return { type: 'soon', remaining, limit }
    return { type: 'safe', remaining, limit }
  }, [temperature, minutes, hotDay])

  const labels = { outside: 'Outside the danger zone — no clock running.', safe: 'Still safe.', soon: 'Use it soon — the clock is almost up.', discard: 'Discard it — past the safe window.' }
  const detail = result.type === 'outside' ? 'Only 40°F–140°F counts as the danger zone — this temperature is outside it.' : result.type === 'discard' ? `The FDA Food Code allows ${result.limit} minutes in the danger zone (40°F–140°F)${hotDay ? ' on a hot day' : ''}. Time is up.` : `The FDA Food Code allows ${result.limit} minutes in the danger zone (40°F–140°F)${hotDay ? ' on a hot day' : ''}. ${result.remaining} minute(s) left.`
  const percent = result.type === 'outside' ? 0 : Math.min(100, Math.max(0, ((result.limit - result.remaining) / result.limit) * 100))

  return <main className="checker-page"><header className="checker-header"><a href="/tools" className="checker-brand"><span><Flame size={17} fill="currentColor" /></span>Solo Truck</a><a href="/tools" className="checker-back"><ArrowLeft size={14} /> All tools</a></header><section className="checker-layout"><div className="checker-intro"><p className="checker-kicker"><span />Free food safety tool</p><h1>Temp Danger<br /><em>Zone Checker</em></h1><p className="checker-subtext">Food between 40°F and 140°F is in the "danger zone" — bacteria grow fastest here. The FDA Food Code gives you 2 hours (1 on a hot day) before it's no longer safe to serve.</p><form className="checker-form" onSubmit={(event) => event.preventDefault()}><label>Food temperature (°F)<div className="checker-input"><Thermometer size={18} /><input type="number" value={temperature} onChange={(e) => setTemperature(e.target.value)} placeholder="e.g. 85" /></div></label><label>Minutes sitting out<div className="checker-input"><Gauge size={18} /><input type="number" value={minutes} onChange={(e) => setMinutes(e.target.value)} placeholder="e.g. 45" /></div></label><label className="checker-checkbox"><input type="checkbox" checked={hotDay} onChange={(e) => setHotDay(e.target.checked)} /><span>Hot day — ambient air is 90°F or hotter</span></label></form></div><div className={`checker-result result-${result.type}`}><div className="gauge-wrap"><div className="gauge"><div className="gauge-arc" style={{ '--gauge-progress': `${percent}%` } as React.CSSProperties} /><div className="gauge-center"><span className="gauge-icon">{result.type === 'discard' || result.type === 'soon' ? <TriangleAlert size={25} /> : <Check size={25} />}</span><strong>{result.type === 'outside' ? 'READY' : result.type === 'discard' ? 'STOP' : `${result.remaining}m`}</strong><small>{result.type === 'outside' ? 'NO CLOCK' : 'REMAINING'}</small></div></div></div><p className="result-label">{labels[result.type as keyof typeof labels]}</p><p className="result-detail">{detail}</p><div className="result-rule"><span /><small>FDA FOOD CODE · 40°F — 140°F</small><span /></div></div></section><section className="checker-note"><TriangleAlert size={18} /><p>This is a general FDA Food Code guideline, not a substitute for your local health department's rules — verify with your local health authority.</p></section><section className="checker-closing"><p>Tracking this by memory during a rush is how honest mistakes turn into failed inspections. Solo Truck logs every reading in 30 seconds, with a timestamp that holds up when an inspector asks.</p><a href="/" className="checker-link">See Solo Truck <ArrowRight size={15} /></a></section><footer className="checker-footer">Free tool by Solo Truck — the 30-second daily compliance log for food trucks. <a href="/">Try Solo Truck free →</a></footer></main>
}
