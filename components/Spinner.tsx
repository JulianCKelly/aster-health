import { FC } from 'react';
import { C } from '../lib/constants';

export interface SpinnerProps {
  label?: string;
}

/**
 * A simple spinner for indicating loading states. The animation is
 * implemented via CSS; consumers can provide an optional label.
 */
const Spinner: FC<SpinnerProps> = ({ label = 'Processing...' }) => (
  <div style={{ textAlign: 'center', padding: '52px', color: C.muted }}>
    <div
      style={{
        width: '32px',
        height: '32px',
        border: `2px solid rgba(37,99,235,0.15)`,
        borderTop: `2px solid ${C.accent}`,
        borderRadius: '50%',
        margin: '0 auto 14px',
        animation: 'spin 0.85s linear infinite',
      }}
    />
    <div style={{ fontSize: '10px', letterSpacing: '2.5px', textTransform: 'uppercase' }}>{label}</div>
  </div>
);

export default Spinner;