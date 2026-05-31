import { FC } from 'react';
import ToolHeader from './ToolHeader';
import { C } from '../lib/constants';

export interface OverviewProps {
  onNav: (id: string) => void;
}

/**
 * The initial landing page for Aster. It explains the product vision and
 * lists the available tools with clickable cards to navigate to them.
 */
const Overview: FC<OverviewProps> = ({ onNav }) => {
  const tools = [
    {
      id: 'navigator',
      title: 'Record Navigator',
      desc: 'Unify fragmented records from multiple sources into a coherent clinical timeline.',
      icon: '⟁',
    },
    {
      id: 'auditor',
      title: 'Pipeline Auditor',
      desc: 'Audit schemas and pipelines for HIPAA, data quality, and interoperability gaps.',
      icon: '◇',
    },
    {
      id: 'coder',
      title: 'Coding Assistant',
      desc: 'Extract diagnoses, procedures, labs, and meds — map to ICD-10, CPT, LOINC, RxNorm.',
      icon: '⌗',
    },
    {
      id: 'reconcile',
      title: 'Continuity Engine',
      desc: 'Reconcile cross-border records — identify duplicates, gaps in care, continuity risks.',
      icon: '⌬',
    },
  ];
  return (
    <div>
      <ToolHeader
        title="Aster Health"
        subtitle="Healthcare data infrastructure for people who live across borders"
      />

      <div
        style={{
          padding: '22px 24px',
          background: C.surface,
          border: `1px solid ${C.border}`,
          borderRadius: '10px',
          marginBottom: '18px',
        }}
      >
        <div
          style={{
            fontSize: '10px',
            color: C.muted,
            letterSpacing: '2px',
            textTransform: 'uppercase',
            marginBottom: '10px',
          }}
        >
          The thesis
        </div>
        <div
          style={{ fontSize: '14px', color: C.text, lineHeight: '1.75', maxWidth: '640px' }}
        >
          When someone moves between health systems — between countries, between insurers, between
          borders of any kind — their medical history fragments. We build the infrastructure that
          puts it back together. Starting with the immigration corridor.
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
        {tools.map((t) => (
          <div
            key={t.id}
            onClick={() => onNav(t.id)}
            style={{
              padding: '18px 20px',
              background: C.surface,
              border: `1px solid ${C.border}`,
              borderRadius: '10px',
              cursor: 'pointer',
              transition: 'all 0.15s',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = C.borderHi;
              (e.currentTarget as HTMLElement).style.background = C.s2;
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = C.border;
              (e.currentTarget as HTMLElement).style.background = C.surface;
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
              <div
                style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '8px',
                  background: 'rgba(37,99,235,0.1)',
                  border: '1px solid rgba(37,99,235,0.25)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#60a5fa',
                  fontSize: '15px',
                  flexShrink: 0,
                }}
              >
                {t.icon}
              </div>
              <div>
                <div
                  style={{ fontSize: '14px', fontWeight: 600, color: '#f0f6ff', marginBottom: '6px' }}
                >
                  {t.title}
                </div>
                <div style={{ fontSize: '11px', color: C.textDim, lineHeight: '1.6' }}>{t.desc}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div
        style={{
          marginTop: '18px',
          padding: '13px 16px',
          background: C.surface,
          border: `1px solid ${C.border}`,
          borderRadius: '8px',
          fontSize: '11px',
          color: C.muted,
          lineHeight: '1.7',
        }}
      >
        Each tool runs against a shared patient narrative — Priya Sharma, an immigrant from Mumbai
        with records at both Apollo Hospital and Kaiser Permanente Los Angeles. Load samples in any
        tool to see the problem and the infrastructure response.
      </div>
    </div>
  );
};

export default Overview;