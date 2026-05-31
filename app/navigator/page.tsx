"use client";

import { useState } from 'react';
import ToolHeader from '../../components/ToolHeader';
import Textarea from '../../components/Textarea';
import RunBar from '../../components/RunBar';
import Spinner from '../../components/Spinner';
import ErrorBanner from '../../components/ErrorBanner';
import StatTile from '../../components/StatTile';
import Badge from '../../components/Badge';
import SevBadge from '../../components/SevBadge';
import { C, SEV, EVENT_COLORS } from '../../lib/constants';
import { SAMPLE_FRAGMENTS } from '../../lib/prompts';
import { callAsterTool } from '../../lib/api';

/**
 * Client page for the Record Navigator tool. Users paste one or more patient
 * records and receive a unified timeline back. The input can be any
 * combination of discharge summaries, visit notes, labs etc. The page
 * orchestrates state management, API calls and result rendering.
 */
export default function NavigatorPage() {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [err, setErr] = useState<string | null>(null);

  const run = async () => {
    setLoading(true);
    setResult(null);
    setErr(null);
    try {
      const r = await callAsterTool('navigator', input);
      setResult(r);
    } catch (e: any) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <ToolHeader title="Record Navigator" subtitle="Cross-source clinical timeline extraction" />
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
            placeholder="Paste records from one or more sources — discharge summaries, visit notes, labs, in any format..."
          />
        </div>
        <RunBar
          leftLabel="Load sample records"
          leftAction={() => setInput(SAMPLE_FRAGMENTS)}
          onRun={run}
          disabled={!input.trim()}
          loading={loading}
          runLabel="Normalize"
        />
      </div>

      {loading && <Spinner label="Extracting clinical events..." />}
      {err && <ErrorBanner msg={err} />}

      {result && (
        <div>
          {result.patient && (
            <div
              style={{
                background: C.surface,
                border: `1px solid ${C.border}`,
                borderRadius: '10px',
                padding: '16px',
                marginBottom: '14px',
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
                Unified patient identity
              </div>
              <div style={{ fontSize: '16px', color: '#f0f6ff', fontWeight: 600, marginBottom: '4px' }}>
                {result.patient.name}
              </div>
              <div style={{ fontSize: '11px', color: C.textDim }}>DOB {result.patient.dob}</div>
              {result.patient.aliases?.length > 0 && (
                <div style={{ fontSize: '10px', color: C.muted, marginTop: '8px' }}>
                  Also recorded as: {result.patient.aliases.join(', ')}
                </div>
              )}
            </div>
          )}

          {result.summary && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', marginBottom: '16px' }}>
              <StatTile label="Events" val={result.summary.events} />
              <StatTile label="Sources" val={result.summary.sources} />
              <StatTile label="Range" val={result.summary.range} big={false} />
              <StatTile
                label="Quality"
                val={result.summary.quality}
                big={false}
                color={SEV[result.summary.quality]?.text}
              />
            </div>
          )}

          {result.discrepancies?.length > 0 && (
            <div style={{ marginBottom: '16px' }}>
              <div
                style={{
                  fontSize: '10px',
                  color: C.muted,
                  letterSpacing: '2px',
                  textTransform: 'uppercase',
                  marginBottom: '8px',
                }}
              >
                Identity discrepancies
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {result.discrepancies.map((d: any, i: number) => (
                  <div
                    key={i}
                    style={{
                      background: C.surface,
                      border: `1px solid ${C.border}`,
                      borderRadius: '6px',
                      padding: '10px 14px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                    }}
                  >
                    <SevBadge sev={d.severity as keyof typeof SEV} />
                    <span
                      style={{
                        fontSize: '11px',
                        color: C.muted,
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                      }}
                    >
                      {d.field}
                    </span>
                    <span style={{ fontSize: '12px', color: C.textDim, flex: 1 }}>{d.note}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {result.timeline?.length > 0 && (
            <>
              <div
                style={{
                  fontSize: '10px',
                  color: C.muted,
                  letterSpacing: '2px',
                  textTransform: 'uppercase',
                  marginBottom: '10px',
                }}
              >
                Unified clinical timeline
              </div>
              <div style={{ position: 'relative', paddingLeft: '24px', borderLeft: `1px solid ${C.border}`, marginLeft: '6px' }}>
                {result.timeline.map((e: any) => {
                  const color = EVENT_COLORS[e.type] || C.muted;
                  return (
                    <div key={e.id} style={{ position: 'relative', paddingBottom: '14px' }}>
                      <div
                        style={{
                          position: 'absolute',
                          left: '-30px',
                          top: '4px',
                          width: '11px',
                          height: '11px',
                          borderRadius: '50%',
                          background: C.bg,
                          border: `2px solid ${color}`,
                        }}
                      />
                      <div
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
                            marginBottom: '6px',
                          }}
                        >
                          <Badge color={color} label={e.type} dot />
                          <span style={{ fontSize: '11px', color: C.muted }}>{e.date}</span>
                        </div>
                        <div
                          style={{ fontSize: '13px', color: '#f0f6ff', fontWeight: 500, marginBottom: '4px' }}
                        >
                          {e.title}
                        </div>
                        <div
                          style={{ fontSize: '12px', color: C.textDim, lineHeight: '1.6', marginBottom: '8px' }}
                        >
                          {e.detail}
                        </div>
                        <div
                          style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '10px', color: C.muted }}
                        >
                          <span>{e.source}</span>
                          <span>·</span>
                          <span>
                            confidence{' '}
                            <span style={{ color: SEV[e.confidence]?.text || C.muted }}>
                              {e.confidence?.toLowerCase()}
                            </span>
                          </span>
                        </div>
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