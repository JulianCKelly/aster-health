import { FC } from 'react';
import { C } from '../lib/constants';

export interface SidebarItem {
  id: string;
  label: string;
  icon: string;
}

export interface SidebarProps {
  active: string;
  onChange: (id: string) => void;
  items?: SidebarItem[];
}

// Default navigation definitions if not provided via props.
const DEFAULT_NAV: SidebarItem[] = [
  { id: 'overview', label: 'Overview', icon: '◎' },
  { id: 'navigator', label: 'Record Navigator', icon: '⟁' },
  { id: 'auditor', label: 'Pipeline Auditor', icon: '◇' },
  { id: 'coder', label: 'Coding Assistant', icon: '⌗' },
  { id: 'reconcile', label: 'Continuity Engine', icon: '⌬' },
];

/**
 * Persistent sidebar component used at the edge of the page. It renders
 * navigation buttons for each tool and highlights the active one. The
 * footer reminds viewers that the app is a demo and not for real PHI.
 */
const Sidebar: FC<SidebarProps> = ({ active, onChange, items = DEFAULT_NAV }) => (
  <div
    style={{
      width: '230px',
      background: C.sidebar,
      borderRight: `1px solid ${C.border}`,
      padding: '24px 0',
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      flexShrink: 0,
    }}
  >
    <div
      style={{
        padding: '0 20px 22px',
        borderBottom: `1px solid ${C.border}`,
        marginBottom: '16px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div
          style={{
            width: '28px',
            height: '28px',
            borderRadius: '7px',
            background: 'linear-gradient(135deg, #2563eb, #7c3aed)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontSize: '13px',
            fontWeight: 700,
          }}
        >
          ✦
        </div>
        <div>
          <div style={{ fontSize: '14px', fontWeight: 700, color: '#f0f6ff' }}>Aster</div>
          <div
            style={{ fontSize: '8px', color: C.muted, letterSpacing: '2px', textTransform: 'uppercase' }}
          >
            Health Infrastructure
          </div>
        </div>
      </div>
    </div>

    <div style={{ padding: '0 12px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
      {items.map((item) => {
        const isActive = active === item.id;
        return (
          <button
            key={item.id}
            onClick={() => onChange(item.id)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '10px 12px',
              border: 'none',
              background: isActive ? 'rgba(37,99,235,0.12)' : 'transparent',
              color: isActive ? '#f0f6ff' : C.muted,
              cursor: 'pointer',
              fontFamily: 'inherit',
              fontSize: '12px',
              borderRadius: '6px',
              textAlign: 'left',
              transition: 'all 0.1s',
              fontWeight: isActive ? 500 : 400,
            }}
          >
            <span
              style={{
                fontSize: '13px',
                color: isActive ? C.accentHi : C.muted,
                width: '16px',
                textAlign: 'center',
              }}
            >
              {item.icon}
            </span>
            {item.label}
          </button>
        );
      })}
    </div>

    <div
      style={{
        marginTop: 'auto',
        padding: '20px',
        fontSize: '9px',
        color: C.faint,
        letterSpacing: '1px',
        lineHeight: '1.6',
      }}
    >
      PUBLIC BENEFIT CORP
      <br />
      DEMO — NOT FOR PHI
    </div>
  </div>
);

export default Sidebar;