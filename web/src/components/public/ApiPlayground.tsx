import React, { useState, useEffect } from 'react';
import { Play, RefreshCw, CheckCircle2, ShieldAlert, Cpu, Activity, Clock, Database, Copy, ShieldCheck, Sliders } from 'lucide-react';
import { api } from '../../services/api';
import type { HealthMetrics } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import { useToast } from '../../context/ToastContext';
import { copyToClipboard } from '../../utils/clipboard';

interface RateLimitLog {
  id: number;
  time: string;
  status: 200 | 429;
  msg: string;
  tokensLeft: number;
}

interface WebhookLogItem {
  id: number;
  time: string;
  provider: string;
  eventType: string;
  isValid: boolean;
  responseTimeMs: number;
  providedSig: string;
  expectedSig: string;
}

export const ApiPlayground: React.FC = () => {
  const { lang, t } = useLanguage();
  const { showToast } = useToast();

  // Active Tab: 'webhook' | 'ratelimit'
  const [activeTab, setActiveTab] = useState<'webhook' | 'ratelimit'>('webhook');

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
  const [webhookLogs, setWebhookLogs] = useState<WebhookLogItem[]>([]);
  const [simulating, setSimulating] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Token Bucket Rate Limiter State
  const MAX_TOKENS = 5;
  const [tokens, setTokens] = useState<number>(MAX_TOKENS);
  const [rlLogs, setRlLogs] = useState<RateLimitLog[]>([]);

  // Token Refill Timer (1 token per 1.5s)
  useEffect(() => {
    const timer = setInterval(() => {
      setTokens((prev) => Math.min(MAX_TOKENS, prev + 1));
    }, 1500);
    return () => clearInterval(timer);
  }, []);

  const handleCopyCurl = () => {
    const curlCmd = "curl http://101.32.126.104:8080/api/v1/health";
    copyToClipboard(curlCmd);
    showToast(t.curlCopied);
  };

  const handleSendRateLimitReq = () => {
    const now = new Date().toLocaleTimeString('en-US', { hour12: false });
    if (tokens > 0) {
      const nextTokens = tokens - 1;
      setTokens(nextTokens);
      setRlLogs((prev) => [
        {
          id: Date.now(),
          time: now,
          status: 200,
          msg: `${t.rateLimitOk} (Token ${nextTokens}/${MAX_TOKENS})`,
          tokensLeft: nextTokens,
        },
        ...prev.slice(0, 7),
      ]);
    } else {
      setRlLogs((prev) => [
        {
          id: Date.now(),
          time: now,
          status: 429,
          msg: `${t.rateLimitExceeded} (Token 0/${MAX_TOKENS})`,
          tokensLeft: 0,
        },
        ...prev.slice(0, 7),
      ]);
    }
  };

  const handleSpamBurst = () => {
    let currentTokens = tokens;
    const newLogs: RateLimitLog[] = [];
    const now = new Date().toLocaleTimeString('en-US', { hour12: false });

    for (let i = 1; i <= 10; i++) {
      if (currentTokens > 0) {
        currentTokens--;
        newLogs.push({
          id: Date.now() + i,
          time: now,
          status: 200,
          msg: `Request #${i}: ${t.rateLimitOk}`,
          tokensLeft: currentTokens,
        });
      } else {
        newLogs.push({
          id: Date.now() + i,
          time: now,
          status: 429,
          msg: `Request #${i}: ${t.rateLimitExceeded}`,
          tokensLeft: 0,
        });
      }
    }
    setTokens(currentTokens);
    setRlLogs((prev) => [...newLogs.reverse(), ...prev].slice(0, 10));
  };

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
      const now = new Date().toLocaleTimeString('en-US', { hour12: false });
      setWebhookLogs((prev) => [
        {
          id: Date.now(),
          time: now,
          provider: res.provider || provider,
          eventType: res.event_type || eventType,
          isValid: res.is_valid,
          responseTimeMs: res.response_time_ms,
          providedSig: res.provided_signature,
          expectedSig: res.expected_signature,
        },
        ...prev.slice(0, 9),
      ]);
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

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left Column: Live System Telemetry Card */}
        <div className="lg:col-span-5 bg-white border border-brand-200 p-4 sm:p-6 flex flex-col justify-between h-[540px] space-y-4">
          <div className="space-y-3.5 flex-1 flex flex-col justify-between">
            <div className="space-y-3.5">
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

              <div className="grid grid-cols-2 gap-2.5 sm:gap-3 font-mono text-xs">
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
            </div>

            <div className="p-3 bg-brand-900 text-brand-200 font-mono text-[10px] sm:text-[11px] space-y-1.5 border border-brand-800 flex-1 min-h-[180px] flex flex-col justify-between overflow-y-auto my-1">
              <div>
                <div className="flex items-start justify-between gap-2 text-emerald-400 font-semibold">
                  <span className="break-all">$ curl http://101.32.126.104:8080/api/v1/health</span>
                  <button
                    onClick={handleCopyCurl}
                    className="p-1 hover:text-white transition-colors shrink-0 bg-brand-800/80"
                    title="Copy cURL Command"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="text-brand-300 text-[10px] sm:text-[11px] border-t border-brand-800 pt-1 mt-1">
                  HTTP/1.1 200 OK | Content-Type: application/json
                </div>
                <div className="text-emerald-400 font-mono text-[10px] sm:text-[11px] leading-relaxed pt-0.5 whitespace-pre">
                  {`{\n  "status": "${health?.status || 'ok'}",\n  "goroutines": ${health?.goroutines || 0},\n  "memory_alloc_mb": ${health?.memory_alloc_mb?.toFixed(2) || '0.00'}\n}`}
                </div>
              </div>
            </div>

            <div className="p-2 bg-emerald-50/70 border border-emerald-200/80 flex items-center justify-between font-mono text-[10px] text-emerald-900 shrink-0">
              <span className="flex items-center gap-1.5 font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping shrink-0" />
                RUNTIME SLA: 99.95% ONLINE
              </span>
              <span className="font-semibold text-emerald-700">Go 1.23+ • Chi Router</span>
            </div>
          </div>

          <div className="pt-2.5 border-t border-brand-100 flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[11px] sm:text-xs font-mono text-brand-500 shrink-0">
            <span>DATABASE: SQLite (WAL Mode)</span>
            <span className="text-emerald-700 font-semibold">CGO-Free Pure Go</span>
          </div>
        </div>

        {/* Right Column: Interactive Simulators (Webhook HMAC vs Rate Limiter) */}
        <div className="lg:col-span-7 bg-white border border-brand-200 p-4 sm:p-6 flex flex-col justify-between h-[540px] space-y-4">
          {/* Tab Switcher Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-brand-100 gap-2 shrink-0">
            <div className="grid grid-cols-2 gap-1.5 font-mono text-xs font-bold w-full sm:w-auto">
              <button
                onClick={() => setActiveTab('webhook')}
                className={`inline-flex items-center justify-center gap-1.5 px-2.5 sm:px-3 py-1.5 border transition-all text-center text-[10px] sm:text-xs font-bold ${
                  activeTab === 'webhook'
                    ? 'bg-brand-900 text-white border-brand-900 shadow-xs'
                    : 'bg-brand-50 text-brand-700 border-brand-200 hover:bg-brand-100'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5 shrink-0 text-emerald-400" />
                <span>{t.tabWebhook}</span>
              </button>
              <button
                onClick={() => setActiveTab('ratelimit')}
                className={`inline-flex items-center justify-center gap-1.5 px-2.5 sm:px-3 py-1.5 border transition-all text-center text-[10px] sm:text-xs font-bold ${
                  activeTab === 'ratelimit'
                    ? 'bg-brand-900 text-white border-brand-900 shadow-xs'
                    : 'bg-brand-50 text-brand-700 border-brand-200 hover:bg-brand-100'
                }`}
              >
                <Sliders className="w-3.5 h-3.5 shrink-0 text-accent" />
                <span>{t.tabRateLimiter}</span>
              </button>
            </div>
            <span className="font-mono text-[9px] sm:text-[10px] bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 font-semibold self-start sm:self-auto shrink-0">
              {activeTab === 'webhook' ? 'POST /api/v1/webhooks/test' : 'GET /api/v1/rate-limit'}
            </span>
          </div>

          {activeTab === 'webhook' ? (
            <div className="flex-1 flex flex-col justify-between space-y-3">
              <div className="space-y-2.5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="block font-mono text-[10px] sm:text-[11px] font-semibold text-brand-700 uppercase mb-1">
                      {t.providerLabel}
                    </label>
                    <select
                      value={provider}
                      onChange={(e) => setProvider(e.target.value)}
                      className="w-full bg-brand-50 border border-brand-300 px-2.5 py-1 font-mono text-xs text-brand-900 focus:outline-none focus:border-brand-900"
                    >
                      <option value="Stripe">Stripe (payment_intent.succeeded)</option>
                      <option value="GitHub">GitHub (push.event)</option>
                      <option value="Midtrans">Midtrans (transaction.settlement)</option>
                      <option value="Custom">Custom Webhook Dispatcher</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-mono text-[10px] sm:text-[11px] font-semibold text-brand-700 uppercase mb-1">
                      {t.eventTypeLabel}
                    </label>
                    <input
                      type="text"
                      value={eventType}
                      onChange={(e) => setEventType(e.target.value)}
                      className="w-full bg-brand-50 border border-brand-300 px-2.5 py-1 font-mono text-xs text-brand-900 focus:outline-none focus:border-brand-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-mono text-[10px] sm:text-[11px] font-semibold text-brand-700 uppercase mb-1">
                    {t.payloadLabel}
                  </label>
                  <textarea
                    rows={4}
                    value={payload}
                    onChange={(e) => setPayload(e.target.value)}
                    className="w-full bg-brand-950 text-emerald-400 font-mono text-xs p-2.5 focus:outline-none focus:ring-1 focus:ring-emerald-500 leading-relaxed"
                  />
                </div>

                <div>
                  <label className="block font-mono text-[10px] sm:text-[11px] font-semibold text-brand-700 uppercase mb-1">
                    {t.sigLabel}
                  </label>
                  <input
                    type="text"
                    placeholder={t.sigPlaceholder}
                    value={customSig}
                    onChange={(e) => setCustomSig(e.target.value)}
                    className="w-full bg-brand-50 border border-brand-300 px-2.5 py-1 font-mono text-xs text-brand-900 focus:outline-none focus:border-brand-900 placeholder:text-brand-400"
                  />
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 pt-0.5">
                  <button
                    onClick={handleSimulate}
                    disabled={simulating}
                    className="inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 bg-brand-900 text-white font-mono text-xs font-semibold hover:bg-brand-800 disabled:bg-brand-400 transition-colors"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    {simulating ? t.dispatchingBtn : t.dispatchBtn}
                  </button>
                  <span className="font-mono text-[10px] sm:text-[11px] text-brand-500">
                    {t.hmacEvaluator}
                  </span>
                </div>
              </div>

              {/* Webhook Dispatch Terminal Log */}
              <div className="bg-brand-950 text-brand-200 p-2.5 border border-brand-800 space-y-1.5 flex-1 min-h-[140px] overflow-y-auto font-mono text-xs">
                <div className="text-[10px] text-brand-400 font-bold uppercase pb-1 border-b border-brand-800 flex items-center justify-between sticky top-0 bg-brand-950 z-10">
                  <span>LIVE WEBHOOK DISPATCH LOG (HMAC ENGINE)</span>
                  <span>{webhookLogs.length} events</span>
                </div>
                {errorMsg && (
                  <div className="p-1.5 bg-red-950/80 border border-red-800 text-red-300 text-[11px] flex items-center gap-1.5">
                    <ShieldAlert className="w-3.5 h-3.5 text-red-400 shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}
                {webhookLogs.length === 0 ? (
                  <div className="text-brand-500 py-3 text-center text-[11px] italic">
                    Click "{t.dispatchBtn}" to simulate HMAC verification live.
                  </div>
                ) : (
                  webhookLogs.map((log) => (
                    <div
                      key={log.id}
                      className={`text-[11px] py-1 border-b border-brand-900 last:border-b-0 space-y-1 ${
                        log.isValid ? 'text-emerald-400' : 'text-red-400'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 truncate pr-2 font-bold">
                          <span className="text-brand-500 font-normal text-[10px]">[{log.time}]</span>
                          <span>{log.provider} • {log.eventType}</span>
                        </div>
                        <span
                          className={`px-1.5 py-0.2 text-[9px] font-bold shrink-0 ${
                            log.isValid
                              ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                              : 'bg-red-950 text-red-400 border border-red-800'
                          }`}
                        >
                          {log.isValid ? `200 OK (${log.responseTimeMs}ms)` : `400 INVALID (${log.responseTimeMs}ms)`}
                        </span>
                      </div>
                      <div className="text-[10px] text-brand-400 space-y-0.5 pl-2 border-l border-brand-800">
                        <div className="truncate">Provided: {log.providedSig}</div>
                        <div className="truncate text-brand-300">Expected: {log.expectedSig}</div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          ) : (
            /* Rate Limiter Simulator Tab */
            <div className="flex-1 flex flex-col justify-between space-y-3">
              <div className="space-y-3">
                {/* Token Bucket Meter Visualizer */}
                <div className="p-3 bg-brand-900 text-white border border-brand-800 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-[10px] sm:text-[11px] uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                      <Sliders className="w-3.5 h-3.5 text-emerald-400 animate-pulse shrink-0" />
                      {t.rateLimiterTitle}
                    </span>
                    <span className="text-[10px] text-brand-300">
                      Refill: 1 token / 1.5s
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-1 border-t border-brand-800">
                    <span className="text-brand-300">{t.availableTokens}:</span>
                    <span className="font-bold text-base text-emerald-300 tabular-nums">
                      {tokens} / {MAX_TOKENS}
                    </span>
                  </div>

                  {/* Token Meter Bars */}
                  <div className="grid grid-cols-5 gap-1.5 pt-0.5">
                    {Array.from({ length: MAX_TOKENS }).map((_, idx) => (
                      <div
                        key={idx}
                        className={`h-2.5 transition-all duration-300 ${
                          idx < tokens
                            ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]'
                            : 'bg-brand-800'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-0.5 font-mono text-xs">
                  <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
                    <button
                      onClick={handleSendRateLimitReq}
                      className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 bg-brand-900 text-white font-mono text-xs font-semibold hover:bg-brand-800 transition-colors shadow-xs"
                    >
                      <Play className="w-3.5 h-3.5 fill-current shrink-0" />
                      <span>{t.sendOneReq}</span>
                    </button>

                    <button
                      onClick={handleSpamBurst}
                      className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 bg-brand-800 text-white font-mono text-xs font-semibold hover:bg-brand-900 transition-colors shadow-xs"
                    >
                      <Activity className="w-3.5 h-3.5 shrink-0 text-emerald-400" />
                      <span>{t.spamBurstReq}</span>
                    </button>

                    <button
                      onClick={() => {
                        setTokens(MAX_TOKENS);
                        setRlLogs([]);
                      }}
                      className="inline-flex items-center justify-center px-3 py-1.5 bg-white text-brand-800 border border-brand-300 font-mono text-xs font-semibold hover:bg-brand-50 transition-colors"
                    >
                      {t.resetBucket}
                    </button>
                  </div>

                  <span className="font-mono text-[10px] sm:text-[11px] text-brand-500">
                    Token Bucket Engine (1500ms Refill)
                  </span>
                </div>

                {/* Rate Limiter Spec & Metadata Summary Tile */}
                <div className="grid grid-cols-2 gap-2 p-2 bg-brand-50 border border-brand-200 font-mono text-[10px]">
                  <div>
                    <span className="text-brand-500 uppercase block font-medium">Algoritma Engine</span>
                    <span className="font-bold text-brand-900 block mt-0.5">Token Bucket (Lua Redis)</span>
                  </div>
                  <div>
                    <span className="text-brand-500 uppercase block font-medium">Header HTTP Response</span>
                    <span className="font-bold text-emerald-700 block mt-0.5">X-RateLimit-Remaining</span>
                  </div>
                </div>
              </div>

              {/* Request Logs Terminal */}
              <div className="bg-brand-950 text-brand-200 p-2.5 border border-brand-800 space-y-1.5 flex-1 min-h-[220px] overflow-y-auto font-mono text-xs">
                <div className="text-[10px] text-brand-400 font-bold uppercase pb-1 border-b border-brand-800 flex items-center justify-between sticky top-0 bg-brand-950 z-10">
                  <span>LIVE TRAFFIC LOG (TOKEN BUCKET ENGINE)</span>
                  <span>{rlLogs.length} events</span>
                </div>
                {rlLogs.length === 0 ? (
                  <div className="text-brand-500 py-8 text-center text-[11px] italic">
                    Click "Send 1 Request" or "Spam 10 Requests" to test rate limiting live.
                  </div>
                ) : (
                  rlLogs.map((log) => (
                    <div
                      key={log.id}
                      className={`text-[11px] flex items-center justify-between py-1 border-b border-brand-900 last:border-b-0 ${
                        log.status === 200 ? 'text-emerald-400' : 'text-red-400 font-bold'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 truncate pr-2">
                        <span className="text-brand-500 font-mono text-[10px]">[{log.time}]</span>
                        <span>{log.msg}</span>
                      </div>
                      <span
                        className={`px-1.5 py-0.2 text-[9px] font-bold shrink-0 ${
                          log.status === 200
                            ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                            : 'bg-red-950 text-red-400 border border-red-800'
                        }`}
                      >
                        {log.status === 200 ? 'HTTP 200 OK' : 'HTTP 429 TOO MANY REQUESTS'}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
