import { FC, ReactNode } from 'react';
import { C } from '../lib/constants';

export interface RunBarProps {
  leftAction: () => void;
  leftLabel: string;
  onRun: () => void;
  disabled?: boolean;
  loading?: boolean;
  runLabel?: string;
}

/**
 * Bottom bar for each input box with a left auxiliary button and a primary
 * call‑to‑action on the right. It handles disabled and loading states
 * gracefully.
 */
const RunBar: FC<RunBarProps> = ({ leftAction, leftLabel, onRun, disabled, loading, runLabel = 'Run' }) => (
  <div
    style={{
      padding: '12px 14px',
      borderTop: `1px solid ${C.border}`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
    }}
  >
    <button
      onClick={leftAction}
      style={{
        background: 'transparent',
        border: `1px solid ${C.border}`,
        borderRadius: '5px',
        color: C.muted,
        cursor: 'pointer',
        fontSize: '11px',
        padding: '7px 14px',
        fontFamily: 'inherit',
        letterSpacing: '0.5px',
      }}
    >
      {leftLabel}
    </button>
    <button
      onClick={onRun}
      disabled={disabled || loading}
      style={{
        padding: '9px 24px',
        background: !disabled && !loading ? C.accent : C.s2,
        border: 'none',
        borderRadius: '6px',
        color: !disabled && !loading ? '#fff' : C.muted,
        cursor: !disabled && !loading ? 'pointer' : 'not-allowed',
        fontSize: '11px',
        letterSpacing: '1.5px',
        textTransform: 'uppercase',
        fontFamily: 'inherit',
        fontWeight: 500,
      }}
    >
      {loading ? 'Analyzing…' : `${runLabel} →`}
    </button>
  </div>
);

export default RunBar;