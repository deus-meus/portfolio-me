import React, { useEffect, useState } from 'react';
import { Key, Shield, RefreshCw, CheckCircle2, ShieldAlert } from 'lucide-react';
import { api } from '../../services/api';
import type { WebhookLog } from '../../types';

export const AdminWebhooks: React.FC = () => {
  const [logs, setLogs] = useState<WebhookLog[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [tokenCopied, setTokenCopied] = useState<boolean>(false);
  const token = 'pk_live_dwinarwastu_f9810a7b489c22e';

  const loadLogs = async () => {
    setLoading(true);
    try {
      const data = await api.getWebhookLogs(50);
      setLogs(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLogs();
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(token);
    setTokenCopied(true);
    setTimeout(() => setTokenCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-brand-200 gap-2">
        <div>
          <span className="font-mono text-xs font-semibold text-accent uppercase tracking-wider">
            API & WEBHOOK ORCHESTRATION
          </span>
          <h1 className="text-xl font-bold text-brand-900 mt-0.5">
            Security Tokens & Ingestion Audit
          </h1>
        </div>
        <button
          onClick={loadLogs}
          className="inline-flex items-center gap-1 px-3 py-1.5 bg-brand-50 border border-brand-300 font-mono text-xs text-brand-700 hover:bg-brand-100"
        >
          <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} /> Refresh Logs
        </button>
      </div>

      {/* Security Token & Edge Rate Budget Panels */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
        {/* Token Card */}
        <div className="p-4 bg-brand-50 border border-brand-200 space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-semibold uppercase text-brand-700 flex items-center gap-1.5">
              <Key className="w-3.5 h-3.5 text-accent" /> Public Bearer Key
            </span>
            <span className="text-emerald-800 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 text-[10px] font-bold">
              ACTIVE
            </span>
          </div>
          <div className="p-2.5 bg-white border border-brand-300 flex items-center justify-between gap-2">
            <code className="text-brand-900 font-bold truncate select-all">{token}</code>
            <button
              onClick={handleCopy}
              className="px-2.5 py-1 bg-brand-900 text-white font-semibold text-[11px] shrink-0 hover:bg-brand-800"
            >
              {tokenCopied ? 'Copied!' : 'Copy'}
            </button>
          </div>
          <p className="text-[11px] text-brand-500">
            Client-side read query token injected for public portfolio telemetry.
          </p>
        </div>

        {/* Rate Limiter Status Card */}
        <div className="p-4 bg-brand-50 border border-brand-200 space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-semibold uppercase text-brand-700 flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-emerald-600" /> Active Rate Budget
            </span>
            <span className="text-brand-600 text-[10px] font-bold">SLIDING WINDOW</span>
          </div>
          <div className="p-2.5 bg-white border border-brand-300 flex items-baseline gap-2">
            <span className="text-xl font-bold text-brand-900 tabular-nums">100</span>
            <span className="text-brand-500 text-xs">requests / minute / IP</span>
          </div>
          <p className="text-[11px] text-brand-500">
            In-memory sliding window algorithm protecting auth & simulation endpoints.
          </p>
        </div>
      </div>

      {/* Webhook Audit Log Table */}
      <div className="border border-brand-200 p-5 space-y-4">
        <h2 className="font-mono text-xs font-bold uppercase tracking-wider text-brand-900">
          WEBHOOK INGESTION AUDIT LOGS
        </h2>

        {loading ? (
          <div className="font-mono text-xs text-brand-500 py-6 text-center">Loading audit logs...</div>
        ) : logs.length === 0 ? (
          <div className="font-mono text-xs text-brand-500 py-6 text-center bg-brand-50 border border-brand-200">
            No webhook simulations executed yet. Test via public API Playground.
          </div>
        ) : (
          <div className="border border-brand-200 overflow-x-auto">
            <table className="w-full text-left font-mono text-xs">
              <thead className="bg-brand-50 border-b border-brand-200 text-brand-700">
                <tr>
                  <th className="p-3">Status</th>
                  <th className="p-3">Provider</th>
                  <th className="p-3">Event Type</th>
                  <th className="p-3">Response Time</th>
                  <th className="p-3">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-100">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-brand-50/50">
                    <td className="p-3">
                      {log.is_valid ? (
                        <span className="inline-flex items-center gap-1 text-emerald-800 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 text-[10px] font-bold">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" /> VALID
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-red-700 bg-red-50 border border-red-200 px-1.5 py-0.5 text-[10px] font-bold">
                          <ShieldAlert className="w-3 h-3 text-red-600" /> MISMATCH
                        </span>
                      )}
                    </td>
                    <td className="p-3 font-semibold text-brand-900">{log.provider}</td>
                    <td className="p-3 text-brand-700">{log.event_type}</td>
                    <td className="p-3 text-brand-600 tabular-nums">{log.response_time_ms} ms</td>
                    <td className="p-3 text-brand-400 text-[11px]">
                      {new Date(log.created_at).toLocaleTimeString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
