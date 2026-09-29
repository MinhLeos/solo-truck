import Link from "next/link"
import { AppShell, PageIntro, SectionCard } from "@/components/app-shell"
const rows=[['Billing — Trial status, subscribe, manage payment','/settings/billing'],['Staff — PINs for attribution on logs','/settings/staff'],['Account — Password, sign-in method','/settings/account'],['Getting started guide — Install steps + how each screen works','/guide']]
export default function Settings(){return <AppShell active="Settings"><PageIntro eyebrow="WORKSPACE" title="Settings"/><SectionCard><div className="list-stack">{rows.map(([label,href])=><Link className="data-row" href={href} key={href} style={{textDecoration:'none',color:'inherit'}}><h3>{label}</h3><span>→</span></Link>)}</div></SectionCard></AppShell>}
