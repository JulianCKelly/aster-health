import { FC } from 'react';
import { C } from '../lib/constants';

export interface ToolHeaderProps {
  title: string;
  subtitle: string;
}

/**
 * Standard header used at the top of each tool or page. Displays the
 * supplied title and subtitle, separated by a subtle border.
 */
const ToolHeader: FC<ToolHeaderProps> = ({ title, subtitle }) => (
  <div style={{ marginBottom: '20px', paddingBottom: '16px', borderBottom: `1px solid ${C.border}` }}>
    <div style={{ fontSize: '18px', fontWeight: 700, color: '#f0f6ff', letterSpacing: '-0.5px' }}>{title}</div>
    <div
      style={{
        fontSize: '10px',
        color: C.muted,
        letterSpacing: '2px',
        textTransform: 'uppercase',
        marginTop: '3px',
      }}
    >
      {subtitle}
    </div>
  </div>
);

export default ToolHeader;