"use client";

import { useState } from 'react';
import ToolHeader from '../../components/ToolHeader';
import Textarea from '../../components/Textarea';
import RunBar from '../../components/RunBar';
import Spinner from '../../components/Spinner';
import ErrorBanner from '../../components/ErrorBanner';
import StatTile from '../../components/StatTile';
import SevBadge from '../../components/SevBadge';
import { C, SEV, CAT_COLORS } from '../../lib/constants';
import { SAMPLE_SCHEMA } from '../../lib/prompts';
import { callAsterTool } from '../../lib/api';

/**
 * Client page for the Pipeline Auditor. Users paste schemas or pipeline
 * definitions and receive a summary of HIPAA, data quality and
 * interoperability issues. Findings can be expanded/collapsed individually.
 */
export default function AuditorPage() {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [err, setErr] = useState<string | null>(null);
  const [open, setOpen] = useState<string | null>(null);

  const run = async () => {
    setLoading(true);
    setResult(null);
    setErr(null);
    setOpen(null);
    try {
      const r = await callAsterTool('auditor', input);
      setResult(r);
    } catch (e: any) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <ToolHeader title="Pipeline Auditor" subtitle="HIPAA · data quality · interoperability" />
      <div
        style={{
          background: C.surface,
          border: `1px solid ${C.border}`,
          borderRadius: '10px',
          overflow: 'hidden',
          marginBottom: '18px',
        }}
      >
        <div style={{ padding: '14px' }}>
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="-- Paste a SQL schema, dbt model, or YAML/JSON pipeline config..."
          />
        </div>
        <RunBar
          leftLabel="Load sample schema"
          leftAction={() => setInput(SAMPLE_SCHEMA)}
          onRun={run}
          disabled={!input.trim()}
          loading={loading}
          runLabel="Run audit"
        />
      </div>

      {loading && <Spinner label="Auditing pipeline..." />}
      {err && <ErrorBanner msg={err} />}

      {result?.summary && (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '10px', marginBottom: '16px' }}>
            {[
              { label: 'Overall', val: result.summary.overall, key: result.summary.overall, big: false },
              { label: 'Critical', val: result.summary.critical, key: 'CRITICAL', big: true },
              { label: 'High', val: result.summary.high, key: 'HIGH', big: true },
              { label: 'Medium', val: result.summary.medium, key: 'MEDIUM', big: true },
              { label: 'Low', val: result.summary.low, key: 'LOW', big: true },
            ].map((t) => {
              const s = SEV[(t.key as keyof typeof SEV) || 'LOW'] || SEV.LOW;
              return (
                <div
                  key={t.label}
                  style={{
                    background: s.bg,
                    border: `1px solid ${s.border}`,
                    borderRadius: '8px',
                    padding: '12px 10px',
                    textAlign: 'center',
                  }}
                >
                  <div
                    style={{
                      fontSize: t.big ? '22px' : '13px',
                      fontWeight: 700,
                      color: s.text,
                      marginBottom: '4px',
                      letterSpacing: t.big ? '-1px' : '0.5px',
                    }}
                  >
                    {t.val ?? '—'}
                  </div>
                  <div
                    style={{
                      fontSize: '9px',
                      color: C.muted,
                      letterSpacing: '1px',
                      textTransform: 'uppercase',
                    }}
                  >
                    {t.label}
                  </div>
                </div>
              );
            })}
          </div>

          {result.findings?.length > 0 && (
            <>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '14px', flexWrap: 'wrap', alignItems: 'center' }}>
                {Object.entries(CAT_COLORS).map(([cat, color]) => {
                  const n = result.findings.filter((f: any) => f.category === cat).length;
                  return (
                    <span
                      key={cat}
                      style={{
                        padding: '4px 12px',
                        borderRadius: '20px',
                        border: `1px solid ${color}30`,
                        background: `${color}0e`,
                        color,
                        fontSize: '10px',
                        letterSpacing: '0.5px',
                      }}
                    >
                      {cat.toLowerCase()} · {n}
                    </span>
                  );
                })}
                <span
                  style={{ marginLeft: 'auto', padding: '4px 12px', borderRadius: '20px', border: `1px solid ${C.border}`, color: C.muted, fontSize: '10px' }}
                >
                  {result.summary.total} total
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {result.findings.map((f: any) => {
                  const s = SEV[f.severity as keyof typeof SEV] || SEV.LOW;
                  const catColor = CAT_COLORS[f.category as keyof typeof CAT_COLORS];
                  const isOpen = open === f.id;
                  return (
                    <div
                      key={f.id}
                      onClick={() => setOpen(isOpen ? null : f.id)}
                      style={{
                        background: isOpen ? s.bg : C.surface,
                        border: `1px solid ${isOpen ? s.border : C.border}`,
                        borderRadius: '8px',
                        padding: '12px 14px',
                        cursor: 'pointer',
                        transition: 'all 0.15s',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <SevBadge sev={f.severity as keyof typeof SEV} />
                        {catColor && (
                          <span style={{ fontSize: '10px', color: catColor, whiteSpace: 'nowrap', letterSpacing: '0.5px' }}>
                            {f.category.toLowerCase()}
                          </span>
                        )}
                        <span style={{ fontSize: '13px', color: '#cbd5e1', flex: 1, fontWeight: 500 }}>{f.title}</span>
                        <span style={{ color: C.muted, fontSize: '11px' }}>{isOpen ? '▲' : '▼'}</span>
                      </div>
                      {isOpen && (
                        <div style={{ marginTop: '14px', paddingTop: '14px', borderTop: `1px solid ${C.border}` }}>
                          <div style={{ marginBottom: '12px' }}>
                            <div
                              style={{ fontSize: '9px', color: C.muted, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '7px' }}
                            >
                              Finding
                            </div>
                            <div style={{ fontSize: '12px', color: C.textDim, lineHeight: '1.75' }}>{f.explanation}</div>
                          </div>
                          <div
                            style={{ background: 'rgba(52,211,153,0.05)', border: '1px solid rgba(52,211,153,0.15)', borderRadius: '6px', padding: '12px' }}
                          >
                            <div
                              style={{ fontSize: '9px', color: '#34d399', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '7px' }}
                            >
                              Fix
                            </div>
                            <div style={{ fontSize: '12px', color: C.textDim, lineHeight: '1.75' }}>{f.fix}</div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}