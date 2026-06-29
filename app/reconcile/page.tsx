"use client";

import { useState, useEffect } from 'react';
import ToolHeader from '../../components/ToolHeader';
import RunBar from '../../components/RunBar';
import Spinner from '../../components/Spinner';
import ErrorBanner from '../../components/ErrorBanner';
import StatTile from '../../components/StatTile';
import SevBadge from '../../components/SevBadge';
import { C, SEV } from '../../lib/constants';

export default function ReconcilePage() {
  const [patients, setPatients] = useState<any[]>([]);
  const [patientId, setPatientId] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingPatients, setLoadingPatients] = useState(true);
  const [result, setResult] = useState<any>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/patients')
      .then(r => r.json())
      .then(d => {
        setPatients(d.patients || []);
        if (d.patients?.length) setPatientId(d.patients[0].PATIENT_ID);
      })
      .catch(e => setErr(e.message))
      .finally(() => setLoadingPatients(false));
  }, []);

  const run = async () => {
    setLoading(true);
    setResult(null);
    setErr(null);
    try {
      const r = await fetch('/api/reconcile', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ patientId }),
      });
      const data = await r.json();
      if (data.error) throw new Error(data.error);
      setResult(data);
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
          {loadingPatients ? (
            <div style={{ color: C.muted, fontSize: '12px' }}>Loading patients from warehouse...</div>
          ) : (
            <select
              value={patientId}
              onChange={e => setPatientId(e.target.value)}
              style={{
                width: '100%',
                background: C.bg,
                border: `1px solid ${C.border}`,
                borderRadius: '6px',
                color: C.text,
                padding: '10px 12px',
                fontSize: '13px',
                fontFamily: 'inherit',
                cursor: 'pointer',
              }}
            >
              {patients.map((p: any) => (
                <option key={p.PATIENT_ID} value={p.PATIENT_ID}>
                  {p.FULL_NAME} — {p.COUNTRY_OF_ORIGIN} → USA ({p.INSURANCE_STATUS})
                </option>
              ))}
            </select>
          )}
          {patientId && patients.length > 0 && (
            <div style={{ marginTop: '10px', fontSize: '11px', color: C.muted }}>
              {patients.find(p => p.PATIENT_ID === patientId)?.TOTAL_GAPS ?? '—'} care gaps ·{' '}
              {patients.find(p => p.PATIENT_ID === patientId)?.TOTAL_ENCOUNTERS ?? '—'} encounters ·{' '}
              {patients.find(p => p.PATIENT_ID === patientId)?.PRIMARY_LANGUAGE}
            </div>
          )}
        </div>
        <RunBar
          leftLabel=""
          leftAction={() => {}}
          onRun={run}
          disabled={!patientId || loadingPatients}
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
              <div style={{ fontSize: '9px', color: C.muted, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '10px' }}>
                Reconciliation
              </div>
              <div style={{ fontSize: '48px', fontWeight: 700, color: scoreColor.text, letterSpacing: '-2px', lineHeight: 1 }}>
                {score}
              </div>
              <div style={{ fontSize: '11px', color: C.muted, marginTop: '8px' }}>out of 100</div>
            </div>
            {result.patient && (
              <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: '10px', padding: '16px' }}>
                <div style={{ fontSize: '9px', color: C.muted, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '8px' }}>
                  Unified patient
                </div>
                <div style={{ fontSize: '16px', color: '#f0f6ff', fontWeight: 600, marginBottom: '4px' }}>{result.patient.name}</div>
                <div style={{ fontSize: '11px', color: C.textDim, marginBottom: '10px' }}>DOB {result.patient.dob}</div>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {result.patient.sources?.map((s: any, i: number) => (
                    <span key={i} style={{ padding: '3px 9px', borderRadius: '4px', background: 'rgba(37,99,235,0.08)', border: '1px solid rgba(37,99,235,0.25)', color: '#60a5fa', fontSize: '10px' }}>
                      {s.facility} <span style={{ color: C.muted }}>· {s.mrn}</span>
                    </span>
                  ))}
                </div>
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
            <div style={{ background: 'rgba(37,99,235,0.05)', border: '1px solid rgba(37,99,235,0.2)', borderRadius: '8px', padding: '14px 16px', marginBottom: '16px' }}>
              <div style={{ fontSize: '9px', color: '#60a5fa', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '8px' }}>
                Reconciled narrative
              </div>
              <div style={{ fontSize: '13px', color: C.text, lineHeight: '1.75' }}>{result.narrative}</div>
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            {result.gaps?.length > 0 && (
              <div>
                <div style={{ fontSize: '10px', color: C.muted, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '8px' }}>
                  Care gaps
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {result.gaps.map((g: any) => (
                    <div key={g.id} style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: '6px', padding: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                        <SevBadge sev={g.severity as keyof typeof SEV} />
                        <span style={{ fontSize: '9px', color: C.muted, letterSpacing: '1px' }}>{g.category}</span>
                      </div>
                      <div style={{ fontSize: '12px', color: '#f0f6ff', fontWeight: 500, marginBottom: '4px' }}>{g.title}</div>
                      <div style={{ fontSize: '11px', color: C.textDim, lineHeight: '1.6', marginBottom: '8px' }}>{g.detail}</div>
                      <div style={{ fontSize: '11px', color: '#34d399', borderTop: `1px solid ${C.border}`, paddingTop: '8px' }}>→ {g.action}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {result.risks?.length > 0 && (
              <div>
                <div style={{ fontSize: '10px', color: C.muted, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '8px' }}>
                  Continuity risks
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {result.risks.map((r: any) => (
                    <div key={r.id} style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: '6px', padding: '12px' }}>
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
