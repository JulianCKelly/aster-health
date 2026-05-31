import { FC } from 'react';
import { C } from '../lib/constants';

export interface StatTileProps {
  label: string;
  val: number | string | null | undefined;
  color?: string;
  big?: boolean;
}

/**
 * A reusable component for showing a numeric statistic with an optional
 * colour accent. Used in the navigator, auditor, coder and reconcile
 * modules to summarise counts and ranges.
 */
const StatTile: FC<StatTileProps> = ({ label, val, color, big = true }) => (
  <div
    style={{
      background: color ? `${color}10` : C.surface,
      border: `1px solid ${color ? `${color}30` : C.border}`,
      borderRadius: '8px',
      padding: '12px 10px',
      textAlign: 'center',
    }}
  >
    <div
      style={{
        fontSize: big ? '22px' : '13px',
        fontWeight: 700,
        color: color || '#f0f6ff',
        marginBottom: '4px',
        letterSpacing: big ? '-1px' : '0.5px',
      }}
    >
      {val ?? '—'}
    </div>
    <div
      style={{
        fontSize: '9px',
        color: C.muted,
        letterSpacing: '1px',
        textTransform: 'uppercase',
      }}
    >
      {label}
    </div>
  </div>
);

export default StatTile;