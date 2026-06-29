"use client";

import { useState } from 'react';
import ToolHeader from '../../components/ToolHeader';
import Textarea from '../../components/Textarea';
import RunBar from '../../components/RunBar';
import Spinner from '../../components/Spinner';
import ErrorBanner from '../../components/ErrorBanner';
import StatTile from '../../components/StatTile';
import Badge from '../../components/Badge';
import { C, CODE_SYSTEMS, SEV } from '../../lib/constants';

import { callAsterTool } from '../../lib/api';

/**
 * Client page for the Coding Assistant. Users paste a clinical note and
 * receive codes across multiple systems (ICD‑10, CPT, LOINC, RxNorm). A
 * filter bar allows users to view a subset of codes.
 */
export default function CoderPage() {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [err, setErr] = useState<string | null>(null);
  const [filter, setFilter] = useState('ALL');

  const run = async () => {
    setLoading(true);
    setResult(null);
    setErr(null);
    try {
      const r = await callAsterTool('coder', input);
      setResult(r);
    } catch (e: any) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  };

  const filtered = result?.codes?.filter((c: any) => filter === 'ALL' || c.system === filter) || [];

  return (
    <div>
      <ToolHeader title="Coding Assistant" subtitle="Clinical note → ICD-10 · CPT · LOINC · RxNorm" />
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
            placeholder="Paste a clinical note — assessment, plan, procedure, encounter summary..."
          />
        </div>
        <RunBar
          leftLabel="Load warehouse note"
          leftAction={async () => { const r = await fetch('/api/sample-note'); const d = await r.json(); if (d.note) setInput(d.note); }}
          onRun={run}
          disabled={!input.trim()}
          loading={loading}
          runLabel="Extract codes"
        />
      </div>

      {loading && <Spinner label="Coding clinical content..." />}
      {err && <ErrorBanner msg={err} />}

      {result?.summary && (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '10px', marginBottom: '14px' }}>
            <StatTile label="Total" val={result.summary.total} />
            <StatTile label="Dx" val={result.summary.dx} color={CODE_SYSTEMS['ICD-10']} />
            <StatTile label="Px" val={result.summary.px} color={CODE_SYSTEMS['CPT']} />
            <StatTile label="Labs" val={result.summary.labs} color={CODE_SYSTEMS['LOINC']} />
            <StatTile label="Meds" val={result.summary.meds} color={CODE_SYSTEMS['RxNorm']} />
          </div>

          {result.summary.primary && (
            <div
              style={{
                background: C.surface,
                border: `1px solid ${C.border}`,
                borderRadius: '8px',
                padding: '12px 14px',
                marginBottom: '14px',
              }}
            >
              <div
                style={{
                  fontSize: '10px',
                  color: C.muted,
                  letterSpacing: '2px',
                  textTransform: 'uppercase',
                  marginBottom: '6px',
                }}
              >
                Primary diagnosis
              </div>
              <div style={{ fontSize: '13px', color: '#f0f6ff' }}>{result.summary.primary}</div>
            </div>
          )}

          {result.codes?.length > 0 && (
            <>
              <div style={{ display: 'flex', gap: '6px', marginBottom: '12px', flexWrap: 'wrap' }}>
                {['ALL', ...Object.keys(CODE_SYSTEMS)].map((sys) => {
                  const active = filter === sys;
                  const color = sys === 'ALL' ? C.accent : CODE_SYSTEMS[sys];
                  return (
                    <button
                      key={sys}
                      onClick={() => setFilter(sys)}
                      style={{
                        padding: '5px 12px',
                        borderRadius: '5px',
                        border: `1px solid ${active ? color : C.border}`,
                        background: active ? `${color}15` : 'transparent',
                        color: active ? color : C.muted,
                        cursor: 'pointer',
                        fontSize: '10px',
                        letterSpacing: '0.5px',
                        fontFamily: 'inherit',
                        fontWeight: 500,
                      }}
                    >
                      {sys}
                    </button>
                  );
                })}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {filtered.map((c: any) => {
                  const color = CODE_SYSTEMS[c.system] || C.muted;
                  return (
                    <div
                      key={c.id}
                      style={{
                        background: C.surface,
                        border: `1px solid ${C.border}`,
                        borderRadius: '8px',
                        padding: '12px 14px',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          marginBottom: '8px',
                          flexWrap: 'wrap',
                        }}
                      >
                        <Badge color={color} label={c.system} />
                        <span style={{ fontSize: '13px', color, fontWeight: 600 }}>{c.code}</span>
                        <span style={{ fontSize: '12px', color: '#f0f6ff', flex: 1, fontWeight: 500 }}>{c.description}</span>
                        <span
                          style={{ fontSize: '10px', color: SEV[c.confidence]?.text || C.muted, letterSpacing: '0.5px' }}
                        >
                          {c.confidence?.toLowerCase()}
                        </span>
                      </div>
                      <div
                        style={{
                          fontSize: '11px',
                          color: C.textDim,
                          lineHeight: '1.65',
                          borderLeft: `2px solid ${color}30`,
                          paddingLeft: '10px',
                          fontStyle: 'italic',
                        }}
                      >
                        {c.justification}
                      </div>
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