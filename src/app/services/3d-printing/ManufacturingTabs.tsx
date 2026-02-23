"use client";

import { useState } from 'react';
import { QuoteCalculator } from './QuoteCalculator';
import { CNCQuoteCalculator } from './CNCQuoteCalculator';
import { LaserQuoteCalculator } from './LaserQuoteCalculator';
import './manufacturing-tabs.css';

const TABS = [
  { id: '3d',    label: '3D Printing' },
  { id: 'cnc',   label: 'CNC Machining' },
  { id: 'laser', label: 'Laser Cutting' },
] as const;

type TabId = typeof TABS[number]['id'];

export function ManufacturingTabs() {
  const [active, setActive] = useState<TabId>('3d');

  return (
    <div className="mfg-tabs">
      <div className="mfg-tabs__bar" role="tablist">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            role="tab"
            aria-selected={active === tab.id}
            className={`mfg-tabs__tab${active === tab.id ? ' mfg-tabs__tab--active' : ''}`}
            onClick={() => setActive(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="mfg-tabs__panel">
        {active === '3d'    && <QuoteCalculator />}
        {active === 'cnc'   && <CNCQuoteCalculator />}
        {active === 'laser' && <LaserQuoteCalculator />}
      </div>
    </div>
  );
}
