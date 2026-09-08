import React, { useState, useEffect } from 'react';
import { Play, RefreshCw, CheckCircle2, ShieldAlert, Cpu, Activity, Clock, Database } from 'lucide-react';
import { api } from '../../services/api';
import type { HealthMetrics, SimulationResult } from '../../types';
import { useLanguage } from '../../context/LanguageContext';

export const ApiPlayground: React.FC = () => {
  const { lang, t } = useLanguage();

  // Telemetry state
  const [health, setHealth] = useState<HealthMetrics | null>(null);
  const [loadingHealth, setLoadingHealth] = useState<boolean>(false);

  // Webhook Simulator state
  const [provider, setProvider] = useState<string>('Stripe');
  const [eventType, setEventType] = useState<string>('payment_intent.succeeded');
  const [payload, setPayload] = useState<string>(
    JSON.stringify({ id: 'pi_3MtwBwLkdIwHu7ix', amount: 250000, currency: 'idr', status: 'succeeded' }, null, 2)
  );
  const [customSig, setCustomSig] = useState<string>('');
  const [simResult, setSimResult] = useState<SimulationResult | null>(null);
  const [simulating, setSimulating] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fetchHealth = async () => {
    setLoadingHealth(true);
    try {
      const data = await api.getHealth();
      setHealth(data);
    } catch (err: any) {
      console.error('Failed to fetch health:', err);
    } finally {
      setLoadingHealth(false);
    }
  };

  useEffect(() => {
    fetchHealth();
    const interval = setInterval(fetchHealth, 15000); // refresh every 15s
    return () => clearInterval(interval);
  }, []);

  const handleSimulate = async () => {
    setSimulating(true);
    setErrorMsg(null);
    try {
      const res = await api.simulateWebhook(provider, eventType, payload, customSig || undefined);
      setSimResult(res);
    } catch (err: any) {
      setErrorMsg(err.message || 'Simulation failed');
    } finally {
      setSimulating(false);
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-10 sm:py-12 border-t border-brand-200" id="api-playground">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-4 border-b border-brand-200">
        <div>
          <span className="font-mono text-xs font-semibold text-accent uppercase tracking-wider">
            {t.apiTag}
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-brand-900 mt-1">
            {t.apiTitle}
          </h2>
        </div>
        <p className="text-sm text-brand-600 max-w-md mt-2 md:mt-0 font-normal">
          {t.apiDesc}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Live System Telemetry Card */}
        <div className="lg:col-span-5 bg-white border border-brand-200 p-4 sm:p-6 flex flex-col justify-between space-y-5">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-brand-100">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-600" />
                <h3 className="font-mono text-xs font-bold text-brand-900 uppercase tracking-wider">
                  {t.telemetryTitle}
                </h3>
              </div>
              <button
                onClick={fetchHealth}
                disabled={loadingHealth}
                className="p-1 text-brand-400 hover:text-brand-900 transition-colors"
                title="Refresh Health"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loadingHealth ? 'animate-spin text-accent' : ''}`} />
              </button>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3 font-mono text-xs">
              <div className="p-3 bg-brand-50 border border-brand-200">
                <span className="text-[10px] text-brand-500 uppercase flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {t.serverUptime}
                </span>
                <span className="text-base font-bold text-brand-900 block mt-1 tabular-nums">
                  {health?.uptime || (lang === 'id' ? 'Memuat...' : 'Loading...')}
                </span>
              </div>

              <div className="p-3 bg-brand-50 border border-brand-200">
                <span className="text-[10px] text-brand-500 uppercase flex items-center gap-1">
                  <Cpu className="w-3 h-3" /> {t.goroutines}
                </span>
                <span className="text-base font-bold text-brand-900 block mt-1 tabular-nums">
                  {health ? `${health.goroutines} ${lang === 'id' ? 'aktif' : 'active'}` : "--"}
                </span>
              </div>

              <div className="p-3 bg-brand-50 border border-brand-200">
                <span className="text-[10px] text-brand-500 uppercase flex items-center gap-1">
                  <Database className="w-3 h-3" /> {t.heapAlloc}
                </span>
                <span className="text-base font-bold text-brand-900 block mt-1 tabular-nums">
                  {health ? `${health.memory_alloc_mb.toFixed(2)} MB` : "--"}
                </span>
              </div>

              <div className="p-3 bg-brand-50 border border-brand-200">
                <span className="text-[10px] text-brand-500 uppercase flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" /> {t.gcCycles}
                </span>
                <span className="text-base font-bold text-emerald-800 block mt-1 tabular-nums">
                  {health ? `${health.num_gc} ${lang === 'id' ? 'selesai' : 'completed'}` : "--"}
                </span>
              </div>
            </div>

            <div className="mt-4 p-3 bg-brand-900 text-brand-200 font-mono text-[11px] space-y-1">
              <div className="text-emerald-400 font-semibold">$ curl http://localhost:8080/api/v1/health</div>
              <div className="text-brand-300">
                HTTP/1.1 200 OK | Content-Type: application/json
              </div>
              <div className="text-brand-400 truncate">
                {`{"status":"${health?.status || 'ok'}","goroutines":${health?.goroutines || 0},"memory_alloc_mb":${health?.memory_alloc_mb?.toFixed(2) || '0.00'}}`}
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-brand-100 flex items-center justify-between text-xs font-mono text-brand-500">
            <span>DATABASE: SQLite (WAL Mode)</span>
            <span className="text-emerald-700 font-semibold">CGO-Free Pure Go</span>
          </div>
        </div>

        {/* Right Column: Interactive Webhook Simulator */}
        <div className="lg:col-span-7 bg-white border border-brand-200 p-4 sm:p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-brand-100 gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <h3 className="font-mono text-xs font-bold text-brand-900 uppercase tracking-wider truncate">
                {t.simulatorTitle}
              </h3>
            </div>
            <span className="font-mono text-[9px] sm:text-[10px] bg-brand-100 text-brand-800 px-2 py-0.5 font-semibold shrink-0">
              POST /api/v1/webhooks/test
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-mono text-[11px] font-semibold text-brand-700 uppercase mb-1">
                {t.providerLabel}
              </label>
              <select
                value={provider}
                onChange={(e) => setProvider(e.target.value)}
                className="w-full bg-brand-50 border border-brand-300 px-3 py-1.5 font-mono text-xs text-brand-900 focus:outline-none focus:border-brand-900"
              >
                <option value="Stripe">Stripe (payment_intent.succeeded)</option>
                <option value="GitHub">GitHub (push.event)</option>
                <option value="Midtrans">Midtrans (transaction.settlement)</option>
                <option value="Custom">Custom Webhook Dispatcher</option>
              </select>
            </div>

            <div>
              <label className="block font-mono text-[11px] font-semibold text-brand-700 uppercase mb-1">
                {t.eventTypeLabel}
              </label>
              <input
                type="text"
                value={eventType}
                onChange={(e) => setEventType(e.target.value)}
                className="w-full bg-brand-50 border border-brand-300 px-3 py-1.5 font-mono text-xs text-brand-900 focus:outline-none focus:border-brand-900"
              />
            </div>
          </div>

          <div>
            <label className="block font-mono text-[11px] font-semibold text-brand-700 uppercase mb-1">
              {t.payloadLabel}
            </label>
            <textarea
              rows={4}
              value={payload}
              onChange={(e) => setPayload(e.target.value)}
              className="w-full bg-brand-950 text-emerald-400 font-mono text-xs p-3 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block font-mono text-[11px] font-semibold text-brand-700 uppercase mb-1">
              {t.sigLabel}
            </label>
            <input
              type="text"
              placeholder={t.sigPlaceholder}
              value={customSig}
              onChange={(e) => setCustomSig(e.target.value)}
              className="w-full bg-brand-50 border border-brand-300 px-3 py-1.5 font-mono text-xs text-brand-900 focus:outline-none focus:border-brand-900 placeholder:text-brand-400"
            />
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 pt-2">
            <button
              onClick={handleSimulate}
              disabled={simulating}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-brand-900 text-white font-mono text-xs font-semibold hover:bg-brand-800 disabled:bg-brand-400 transition-colors w-full sm:w-auto"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              {simulating ? t.dispatchingBtn : t.dispatchBtn}
            </button>
            <span className="font-mono text-[10px] sm:text-[11px] text-brand-500 text-center sm:text-right">
              {t.hmacEvaluator}
            </span>
          </div>

          {/* Simulation Output Box */}
          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 font-mono text-xs flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-red-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {simResult && (
            <div className="mt-3 p-3 bg-brand-50 border border-brand-200 font-mono text-xs space-y-1.5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pb-1 border-b border-brand-200">
                <span className="flex items-center gap-1.5 font-bold">
                  {simResult.is_valid ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span className="text-emerald-800">{t.sigValid}</span>
                    </>
                  ) : (
                    <>
                      <ShieldAlert className="w-4 h-4 text-red-600 shrink-0" />
                      <span className="text-red-700">{t.sigInvalid}</span>
                    </>
                  )}
                </span>
                <span className="text-brand-600 tabular-nums text-[11px]">
                  {t.execLatency}{simResult.response_time_ms} ms
                </span>
              </div>
              <div className="text-[11px] text-brand-700 pt-1 space-y-1">
                <div className="break-all">
                  <span className="text-brand-500 font-semibold">{t.providedSig}</span>
                  {simResult.provided_signature}
                </div>
                <div className="break-all">
                  <span className="text-brand-500 font-semibold">{t.expectedSig}</span>
                  {simResult.expected_signature}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
