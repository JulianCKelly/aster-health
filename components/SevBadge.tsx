import { FC } from 'react';
import { SEV } from '../lib/constants';

export interface SevBadgeProps {
  sev: keyof typeof SEV;
}

/**
 * A pill‑shaped badge for severity levels (critical, high, medium, low). It
 * shows both a coloured dot and the label.
 */
const SevBadge: FC<SevBadgeProps> = ({ sev }) => {
  const s = SEV[sev] || SEV.LOW;
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '5px',
        padding: '2px 8px',
        borderRadius: '4px',
        background: `${s.dot}18`,
        border: `1px solid ${s.dot}40`,
        color: s.text,
        fontSize: '9px',
        letterSpacing: '1px',
        textTransform: 'uppercase',
        fontWeight: 600,
        whiteSpace: 'nowrap',
        minWidth: '58px',
        justifyContent: 'center',
      }}
    >
      <span
        style={{
          width: '5px',
          height: '5px',
          borderRadius: '50%',
          background: s.dot,
          flexShrink: 0,
        }}
      />
      {s.label}
    </span>
  );
};

export default SevBadge;