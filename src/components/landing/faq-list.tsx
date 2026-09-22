'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export function FaqList({ items }: { items: { q: string; a: string }[] }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="faq-list">
      {items.map((faq, i) => (
        <div className={`faq-item ${open === i ? 'open' : ''}`} key={faq.q}>
          <button type="button" aria-expanded={open === i} onClick={() => setOpen(open === i ? null : i)}>
            <span>{String(i + 1).padStart(2, '0')}</span>
            {faq.q}
            <ChevronDown size={19} />
          </button>
          {open === i && <p>{faq.a}</p>}
        </div>
      ))}
    </div>
  );
}
