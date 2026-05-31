"use client";

import { useState } from 'react';
import ToolHeader from '../../components/ToolHeader';
import Textarea from '../../components/Textarea';
import RunBar from '../../components/RunBar';
import Spinner from '../../components/Spinner';
import ErrorBanner from '../../components/ErrorBanner';
import StatTile from '../../components/StatTile';
import SevBadge from '../../components/SevBadge';
import { C, SEV } from '../../lib/constants';
import { SAMPLE_FRAGMENTS } from '../../lib/prompts';
import { callAsterTool } from '../../lib/api';

/**
 * Client page for the Continuity Engine. Users paste cross‑border or
 * cross‑system records and receive a unified patient view, reconciliation
 * score, gaps and risks. It summarises fragmentation across the health
 * journey and highlights the next actions.
 */
export default function ReconcilePage() {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [err, setErr] = useState<string | null>(null);

  const run = async () => {
    setLoading(true);
    setResult(null);
    setErr(null);
    try {
      const r = await callAsterTool('reconcile', input);
      setResult(r);
    } catch (e: any) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  };

  const score = result?.score ?? 0;
  const scoreColor = score >= 80 ? SEV.LOW : score >= 60 ? SEV.MEDIUM : score >= 40 ? SEV.HIGH : SEV.CRITICAL;

  return (
    <div>
      <ToolHeader title="Continuity Engine" subtitle="Cross-border record reconciliation" />
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
            placeholder="Paste records from multiple sources — across borders, providers, EHR systems..."
          />
        </div>
        <RunBar
          leftLabel="Load cross-border sample"
          leftAction={() => setInput(SAMPLE_FRAGMENTS)}
          onRun={run}
          disabled={!input.trim()}
          loading={loading}
          runLabel="Reconcile"
        />
      </div>

      {loading && <Spinner label="Reconciling records across sources..." />}
      {err && <ErrorBanner msg={err} />}

      {result && (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: '12px', marginBottom: '14px' }}>
            <div
              style={{
                background: scoreColor.bg,
                border: `1px solid ${scoreColor.border}`,
                borderRadius: '10px',
                padding: '20px',
                textAlign: 'center',
              }}
            >
              <div
                style={{
                  fontSize: '9px',
                  color: C.muted,
                  letterSpacing: '2px',
                  textTransform: 'uppercase',
                  marginBottom: '10px',
                }}
              >
                Reconciliation
              </div>
              <div
                style={{ fontSize: '48px', fontWeight: 700, color: scoreColor.text, letterSpacing: '-2px', lineHeight: 1 }}
              >
                {score}
              </div>
              <div style={{ fontSize: '11px', color: C.muted, marginTop: '8px' }}>out of 100</div>
            </div>
            {result.patient && (
              <div
                style={{
                  background: C.surface,
                  border: `1px solid ${C.border}`,
                  borderRadius: '10px',
                  padding: '16px',
                }}
              >
                <div
                  style={{
                    fontSize: '9px',
                    color: C.muted,
                    letterSpacing: '2px',
                    textTransform: 'uppercase',
                    marginBottom: '8px',
                  }}
                >
                  Unified patient
                </div>
                <div style={{ fontSize: '16px', color: '#f0f6ff', fontWeight: 600, marginBottom: '4px' }}>
                  {result.patient.name}
                </div>
                <div style={{ fontSize: '11px', color: C.textDim, marginBottom: '10px' }}>DOB {result.patient.dob}</div>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {result.patient.sources?.map((s: any, i: number) => (
                    <span
                      key={i}
                      style={{
                        padding: '3px 9px',
                        borderRadius: '4px',
                        background: 'rgba(37,99,235,0.08)',
                        border: '1px solid rgba(37,99,235,0.25)',
                        color: '#60a5fa',
                        fontSize: '10px',
                      }}
                    >
                      {s.facility} <span style={{ color: C.muted }}>· {s.mrn}</span>
                    </span>
                  ))}
                </div>
                {result.patient.aliases?.length > 0 && (
                  <div style={{ marginTop: '10px', fontSize: '10px', color: C.muted }}>
                    Variants: {result.patient.aliases.join(', ')}
                  </div>
                )}
              </div>
            )}
          </div>

          {result.stats && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '10px', marginBottom: '16px' }}>
              <StatTile label="Fragments" val={result.stats.fragments} />
              <StatTile label="Unified" val={result.stats.unified} color="#34d399" />
              <StatTile label="Duplicates" val={result.stats.duplicates} color="#38bdf8" />
              <StatTile label="Gaps" val={result.stats.gaps} color="#fdba74" />
              <StatTile label="Risks" val={result.stats.risks} color="#fca5a5" />
            </div>
          )}

          {result.narrative && (
            <div
              style={{
                background: 'rgba(37,99,235,0.05)',
                border: '1px solid rgba(37,99,235,0.2)',
                borderRadius: '8px',
                padding: '14px 16px',
                marginBottom: '16px',
              }}
            >
              <div
                style={{
                  fontSize: '9px',
                  color: '#60a5fa',
                  letterSpacing: '2px',
                  textTransform: 'uppercase',
                  marginBottom: '8px',
                }}
              >
                Reconciled narrative
              </div>
              <div style={{ fontSize: '13px', color: C.text, lineHeight: '1.75' }}>{result.narrative}</div>
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            {result.gaps?.length > 0 && (
              <div>
                <div
                  style={{
                    fontSize: '10px',
                    color: C.muted,
                    letterSpacing: '2px',
                    textTransform: 'uppercase',
                    marginBottom: '8px',
                  }}
                >
                  Care gaps
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {result.gaps.map((g: any) => (
                    <div
                      key={g.id}
                      style={{
                        background: C.surface,
                        border: `1px solid ${C.border}`,
                        borderRadius: '6px',
                        padding: '12px',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                        <SevBadge sev={g.severity as keyof typeof SEV} />
                        <span style={{ fontSize: '9px', color: C.muted, letterSpacing: '1px' }}>{g.category}</span>
                      </div>
                      <div style={{ fontSize: '12px', color: '#f0f6ff', fontWeight: 500, marginBottom: '4px' }}>{g.title}</div>
                      <div style={{ fontSize: '11px', color: C.textDim, lineHeight: '1.6', marginBottom: '8px' }}>{g.detail}</div>
                      <div style={{ fontSize: '11px', color: '#34d399', borderTop: `1px solid ${C.border}`, paddingTop: '8px' }}>
                        → {g.action}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {result.risks?.length > 0 && (
              <div>
                <div
                  style={{
                    fontSize: '10px',
                    color: C.muted,
                    letterSpacing: '2px',
                    textTransform: 'uppercase',
                    marginBottom: '8px',
                  }}
                >
                  Continuity risks
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {result.risks.map((r: any) => (
                    <div
                      key={r.id}
                      style={{
                        background: C.surface,
                        border: `1px solid ${C.border}`,
                        borderRadius: '6px',
                        padding: '12px',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                        <SevBadge sev={r.severity as keyof typeof SEV} />
                        <span style={{ fontSize: '9px', color: C.muted, letterSpacing: '1px' }}>{r.type}</span>
                      </div>
                      <div style={{ fontSize: '12px', color: '#f0f6ff', fontWeight: 500, marginBottom: '4px' }}>{r.title}</div>
                      <div style={{ fontSize: '11px', color: C.textDim, lineHeight: '1.6' }}>{r.detail}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}