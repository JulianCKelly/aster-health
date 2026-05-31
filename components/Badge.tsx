import { FC } from 'react';
// Badge does not require any constants; it receives colours via props.

export interface BadgeProps {
  color: string;
  label: string;
  dot?: boolean;
}

/**
 * A small label component used to mark timeline events or code systems.
 * Optionally displays a coloured dot before the label.
 */
const Badge: FC<BadgeProps> = ({ color, label, dot = false }) => (
  <span
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: dot ? '5px' : 0,
      padding: '2px 8px',
      borderRadius: '4px',
      background: `${color}18`,
      border: `1px solid ${color}40`,
      color,
      fontSize: '9px',
      letterSpacing: '1px',
      textTransform: 'uppercase',
      fontWeight: 600,
      whiteSpace: 'nowrap',
    }}
  >
    {dot && (
      <span
        style={{
          width: '5px',
          height: '5px',
          borderRadius: '50%',
          background: color,
        }}
      />
    )}
    {label}
  </span>
);

export default Badge;