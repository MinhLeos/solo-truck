'use client';

import { useState, type ReactNode } from 'react';
import { Menu, X } from 'lucide-react';

export function NavMenu({
  buttonClassName,
  panelClassName = 'pricing-mobile-links',
  children,
}: {
  buttonClassName: string;
  panelClassName?: string;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        type="button"
        className={buttonClassName}
        aria-label={open ? 'Close menu' : 'Open menu'}
        aria-expanded={open}
        onClick={() => setOpen(!open)}
      >
        {open ? <X size={21} /> : <Menu size={21} />}
      </button>
      {open && (
        // Closes on any link tap so in-page #anchors don't leave the panel open.
        // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions
        <nav className={panelClassName} onClick={() => setOpen(false)}>
          {children}
        </nav>
      )}
    </>
  );
}
