"use client";

import { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Overview from '../components/Overview';
import NavigatorPage from './navigator/page';
import AuditorPage from './auditor/page';
import CoderPage from './coder/page';
import ReconcilePage from './reconcile/page';
import { C } from '../lib/constants';

/**
 * The main application entry point. It renders a persistent sidebar and
 * swaps between the overview and the four tool pages based on the
 * current navigation selection. Styling (e.g. keyframes) is injected
 * globally at this level because Next.js app pages are server components
 * by default, so we mark this component as client‑side.
 */
export default function Page() {
  const [active, setActive] = useState('overview');
  return (
    <div
      style={{
        background: C.bg,
        minHeight: '100vh',
        color: C.text,
        fontFamily: `'JetBrains Mono','Fira Code','Courier New',monospace`,
        display: 'flex',
      }}
    >
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        ::placeholder { color: #2d4a6a; }
        * { box-sizing: border-box; }
      `}</style>
      <Sidebar active={active} onChange={setActive} />
      <div style={{ flex: 1, padding: '28px 32px', maxWidth: '1100px' }}>
        {active === 'overview' && <Overview onNav={setActive} />}
        {active === 'navigator' && <NavigatorPage />}
        {active === 'auditor' && <AuditorPage />}
        {active === 'coder' && <CoderPage />}
        {active === 'reconcile' && <ReconcilePage />}
      </div>
    </div>
  );
}