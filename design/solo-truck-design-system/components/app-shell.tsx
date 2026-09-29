'use client'

import Link from "next/link"
import { Activity, ClipboardCheck, Clock3, FileText, ShieldCheck, Settings } from "lucide-react"
import type { ReactNode } from "react"

const tabs = [
  ["Today", "/today", Activity], ["Checklist", "/checklist", ClipboardCheck], ["History", "/history", Clock3],
  ["Documents", "/documents", FileText], ["Inspector", "/inspector", ShieldCheck], ["Settings", "/settings", Settings],
] as const

export function AppShell({ children, active = "Today", truckName = "Morning Star" }: { children: ReactNode; active?: string; truckName?: string }) {
  return <div className="app-frame">
    <header className="app-header"><div><span className="eyebrow">SOLO TRUCK</span><strong>{truckName}</strong></div><div className="sync-status"><span /> Synced just now</div></header>
    <div className="billing-strip">Your trial ends in 14 day(s). Subscribe to keep using Solo Truck. <Link href="/settings/billing">View billing</Link></div>
    <main className="app-content">{children}</main>
    <nav className="bottom-nav" aria-label="Primary navigation">{tabs.map(([label, href, Icon]) => <Link className={active === label ? "active" : ""} href={href} key={label}><Icon size={19} strokeWidth={1.8}/><span>{label}</span></Link>)}</nav>
  </div>
}

export function PageIntro({ eyebrow, title, children }: { eyebrow?: string; title: string; children?: ReactNode }) { return <div className="page-intro">{eyebrow && <span className="eyebrow">{eyebrow}</span>}<h1>{title}</h1>{children && <p>{children}</p>}</div> }

export function StatusPill({ children, tone = "neutral" }: { children: ReactNode; tone?: "neutral" | "good" | "warn" | "bad" }) { return <span className={`status-pill ${tone}`}>{children}</span> }

export function SectionCard({ children, className = "" }: { children: ReactNode; className?: string }) { return <section className={`section-card ${className}`}>{children}</section> }

export function AppButton({ children, variant = "primary", ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "secondary" | "quiet" }) { return <button className={`app-button ${variant}`} {...props}>{children}</button> }

export function AppFooter() { return <footer className="app-footer">Solo Truck keeps a clear record of the work your team does every shift.</footer> }
