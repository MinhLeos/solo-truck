'use client'

import { useMemo, useState } from 'react'
import { ArrowLeft, ArrowRight, Check, Download, Flame, RotateCcw } from 'lucide-react'

const questions = [
  'Is the hand sink stocked with soap and paper towels?',
  'Is the sanitizer solution at the correct strength?',
  'Are cold foods held at 41°F or below?',
  'Are hot foods held at 135°F or above?',
  'Are raw foods stored below ready-to-eat foods?',
  'Are food-contact surfaces clean and sanitized?',
  'Are thermometers calibrated and working?',
  'Are employees following proper handwashing practices?',
  'Are chemicals labeled and stored away from food?',
  'Are the water and waste tanks secure and in good condition?',
  'Are required permits and certificates current and available?',
  'Is the truck free of pests, leaks, and other visible hazards?',
]

export default function InspectionReadinessQuiz() {
  const [answers, setAnswers] = useState<(boolean | null)[]>(Array(questions.length).fill(null))
  const [preparing, setPreparing] = useState(false)
  const answered = answers.filter((answer) => answer !== null).length
  const complete = answered === questions.length
  const score = useMemo(() => answers.filter(Boolean).length, [answers])
  const band = score >= 10 ? ['Inspection-ready.', 'Strong work. Your basics are covered and your routine is doing its job.'] : score >= 7 ? ['Nearly ready.', 'A few gaps are worth fixing before your next service.'] : ['Needs attention.', 'Use these misses as your pre-shift action list before an inspector shows up.']

  function answer(index: number, value: boolean) {
    setAnswers((current) => current.map((answer, item) => item === index ? value : answer))
  }

  function download() {
    setPreparing(true)
    window.setTimeout(() => { window.print(); setPreparing(false) }, 350)
  }

  return (
    <main className="quiz-page">
      <header className="quiz-header"><a className="quiz-brand" href="/"><span><Flame size={16} fill="currentColor" /></span>Solo Truck</a><a className="quiz-back" href="/tools"><ArrowLeft size={15} />All tools</a></header>
      <section className="quiz-shell" aria-labelledby="quiz-title">
        <div className="quiz-intro"><p className="quiz-kicker"><span />Solo Truck / Free tool</p><h1 id="quiz-title">Inspection Readiness Quiz</h1><p>Answer honestly — these are the same 12 checks a pre-shift routine should cover, and the ones inspectors ask about first.</p></div>
        <div className="quiz-progress"><div><span>Pre-shift scan</span><strong>{answered} of {questions.length} answered</strong></div><div className="quiz-progress-track"><span style={{ width: `${(answered / questions.length) * 100}%` }} /></div></div>
        <div className="quiz-list">{questions.map((question, index) => <article className={`quiz-row ${answers[index] !== null ? 'answered' : ''}`} key={question}><div className="quiz-row-number">{String(index + 1).padStart(2, '0')}</div><p>{question}</p><div className="quiz-options"><button className={answers[index] === true ? 'selected yes' : ''} onClick={() => answer(index, true)} aria-pressed={answers[index] === true}>Yes</button><button className={answers[index] === false ? 'selected no' : ''} onClick={() => answer(index, false)} aria-pressed={answers[index] === false}>No</button></div></article>)}</div>
        {complete && <section className={`quiz-result ${score >= 10 ? 'ready' : score >= 7 ? 'nearly' : 'attention'}`}><div className="result-score"><strong>{score} / {questions.length}</strong><span>{band[0]}</span></div><p>{band[1]}</p><button className="quiz-download" onClick={download} disabled={preparing}>{preparing ? 'Preparing…' : 'Download result as PDF'} <Download size={16} /></button><p className="quiz-closing">Solo Truck runs this exact checklist every shift — so you already know where you stand before an inspector does.</p><button className="quiz-reset" onClick={() => setAnswers(Array(questions.length).fill(null))}><RotateCcw size={14} />Retake quiz</button></section>}
      </section>
      <footer className="quiz-footer"><span>Free tool by Solo Truck — the 30-second daily compliance log for food trucks.</span><a href="/#pricing">Try Solo Truck free →</a></footer>
    </main>
  )
}
