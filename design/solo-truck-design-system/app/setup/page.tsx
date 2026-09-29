'use client'

import { useMemo, useState } from 'react'
import styles from './setup.module.css'

const equipmentPresets = [
  { name: 'Walk-in fridge', min: 33, max: 41 },
  { name: 'Reach-in fridge', min: 33, max: 41 },
  { name: 'Freezer', min: 0, max: 0 },
  { name: 'Hot holding', min: 135, max: 165 },
]
const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

type Equipment = { id: number; name: string; min: number; max: number }

export default function SetupPage() {
  const [step, setStep] = useState(0)
  const [truck, setTruck] = useState({ name: '', city: '', state: '', unit: 'Truck' })
  const [equipment, setEquipment] = useState<Equipment[]>([])
  const [selectedDays, setSelectedDays] = useState<string[]>([])
  const [nextId, setNextId] = useState(1)

  const canContinue = step !== 1 || equipment.length > 0
  const progress = useMemo(() => ((step + 1) / 3) * 100, [step])

  function addEquipment(preset: (typeof equipmentPresets)[number]) {
    setEquipment((items) => [...items, { ...preset, id: nextId }])
    setNextId((id) => id + 1)
  }

  function updateEquipment(id: number, field: keyof Equipment, value: string) {
    setEquipment((items) => items.map((item) => item.id === id ? { ...item, [field]: field === 'name' ? value : Number(value) } : item))
  }

  function toggleDay(day: string) {
    setSelectedDays((current) => current.includes(day) ? current.filter((item) => item !== day) : [...current, day])
  }

  return (
    <main className={styles.page}>
      <div className={styles.shell}>
        <header className={styles.header}>
          <a className={styles.logo} href="/">Solo Truck</a>
          <span className={styles.kicker}>Quick setup</span>
        </header>

        <section className={styles.intro}>
          <p className={styles.eyebrow}>Let&apos;s get your truck ready</p>
          <h1>Set up your workspace</h1>
          <p>Three quick steps, then you&apos;re ready to start logging.</p>
        </section>

        <nav className={styles.steps} aria-label="Setup progress">
          {['Truck', 'Equipment', 'Shifts'].map((label, index) => (
            <div className={`${styles.step} ${index === step ? styles.active : ''} ${index < step ? styles.complete : ''}`} key={label}>
              <span className={styles.stepNumber}>{index < step ? '✓' : index + 1}</span>
              <span>{label}</span>
            </div>
          ))}
        </nav>
        <div className={styles.progressTrack}><span style={{ width: `${progress}%` }} /></div>

        <section className={styles.card} aria-live="polite">
          {step === 0 && <div className={styles.panel}>
            <div className={styles.panelHeading}><span className={styles.panelIcon}>01</span><div><h2>Tell us about your truck</h2><p>Just the basics — you can change these anytime.</p></div></div>
            <div className={styles.formGrid}>
              <label>Truck name<input value={truck.name} onChange={(e) => setTruck({ ...truck, name: e.target.value })} placeholder="Rosa's Tacos" /></label>
              <label>City<input value={truck.city} onChange={(e) => setTruck({ ...truck, city: e.target.value })} placeholder="Austin" /></label>
              <label>State<input className={styles.stateInput} maxLength={2} value={truck.state} onChange={(e) => setTruck({ ...truck, state: e.target.value.toUpperCase() })} placeholder="TX" /></label>
              <label>Unit type<select value={truck.unit} onChange={(e) => setTruck({ ...truck, unit: e.target.value })}><option>Truck</option><option>Trailer</option><option>Cart</option></select></label>
            </div>
          </div>}

          {step === 1 && <div className={styles.panel}>
            <div className={styles.panelHeading}><span className={styles.panelIcon}>02</span><div><h2>What do you need to check?</h2><p>Tap to add — thresholds prefill with FDA defaults, editable below.</p></div></div>
            <div className={styles.presets}>{equipmentPresets.map((preset) => <button type="button" key={preset.name} onClick={() => addEquipment(preset)}><span>+</span>{preset.name}</button>)}</div>
            {equipment.length === 0 ? <div className={styles.empty}>Add at least one piece of equipment to continue.</div> : <div className={styles.equipmentList}>{equipment.map((item) => <div className={styles.equipmentRow} key={item.id}><input aria-label="Equipment name" value={item.name} onChange={(e) => updateEquipment(item.id, 'name', e.target.value)} /><label>min °F<input type="number" value={item.min} onChange={(e) => updateEquipment(item.id, 'min', e.target.value)} /></label><label>max °F<input type="number" value={item.max} onChange={(e) => updateEquipment(item.id, 'max', e.target.value)} /></label><button type="button" className={styles.remove} aria-label={`Remove ${item.name}`} onClick={() => setEquipment(equipment.filter((equipmentItem) => equipmentItem.id !== item.id))}>×</button></div>)}</div>}
          </div>}

          {step === 2 && <div className={styles.panel}>
            <div className={styles.panelHeading}><span className={styles.panelIcon}>03</span><div><h2>When do you sell?</h2><p>Which days do you sell? Optional — you can skip this and add shifts later.</p></div></div>
            <div className={styles.days}>{days.map((day) => <button type="button" className={selectedDays.includes(day) ? styles.daySelected : ''} onClick={() => toggleDay(day)} key={day} aria-pressed={selectedDays.includes(day)}>{day}</button>)}</div>
            {selectedDays.length > 0 && <div className={styles.times}><label>Open<input type="time" defaultValue="09:00" /></label><span>to</span><label>Close<input type="time" defaultValue="17:00" /></label></div>}
          </div>}
          <div className={styles.actions}>{step > 0 && <button type="button" className={styles.back} onClick={() => setStep(step - 1)}>Back</button>}<button type="button" className={styles.next} disabled={!canContinue} onClick={() => setStep(Math.min(2, step + 1))}>{step === 2 ? 'Finish setup' : 'Next'}<span>→</span></button></div>
        </section>
        <p className={styles.footerNote}>You can update any of this later in Settings.</p>
      </div>
    </main>
  )
}
