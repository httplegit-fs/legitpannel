import React, { useEffect, useState } from 'react';
import { Activity, RefreshCw, Filter, ShieldCheck } from 'lucide-react';
import { ApiAccessLog } from '../../../types/admin';
import { fetchAuditLogs } from '../../../services/adminService';

interface AuditLogsTabProps {
  token: string | null;
}

export const AuditLogsTab: React.FC<AuditLogsTabProps> = ({ token }) => {
  const [logs, setLogs] = useState<ApiAccessLog[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filter, setFilter] = useState<'all' | 'config' | 'update'>('all');

  const loadLogs = async () => {
    setIsLoading(true);
    const data = await fetchAuditLogs(token);
    setLogs(data);
    setIsLoading(false);
  };

  useEffect(() => {
    loadLogs();
  }, [token]);

  const filteredLogs = logs.filter((l) => {
    if (filter === 'config') return l.path.includes('config');
    if (filter === 'update') return l.path.includes('update');
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
            <Activity className="w-5 h-5 text-rose-500" />
            Remote Access & Audit Trail
          </h2>
          <p className="text-xs text-neutral-400 mt-0.5">
            Real-time record of incoming requests to <code className="text-neutral-200 font-mono">/api/config</code> and administrative updates.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Segmented Filter Control */}
          <div className="flex items-center gap-1 p-1 bg-neutral-950 rounded-lg border border-neutral-800 text-xs">
            <button
              onClick={() => setFilter('all')}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                filter === 'all' ? 'bg-neutral-800 text-white font-medium' : 'text-neutral-400 hover:text-white'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('config')}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                filter === 'config' ? 'bg-neutral-800 text-white font-medium' : 'text-neutral-400 hover:text-white'
              }`}
            >
              Sync Hits
            </button>
            <button
              onClick={() => setFilter('update')}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                filter === 'update' ? 'bg-neutral-800 text-white font-medium' : 'text-neutral-400 hover:text-white'
              }`}
            >
              Updates
            </button>
          </div>

          <button
            onClick={loadLogs}
            disabled={isLoading}
            className="p-2 rounded-lg bg-neutral-800 hover:bg-neutral-750 text-neutral-300 transition-colors border border-neutral-700/80"
            title="Refresh logs"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-neutral-900/80 border border-neutral-800 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-950/80 border-b border-neutral-800 text-neutral-400 uppercase text-[10px] tracking-wider font-semibold">
              <tr>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Method</th>
                <th className="py-3 px-4">Endpoint</th>
                <th className="py-3 px-4">Client Origin / IP</th>
                <th className="py-3 px-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/60 font-mono text-neutral-300">
              {filteredLogs.length > 0 ? (
                filteredLogs.map((log, i) => (
                  <tr key={i} className="hover:bg-neutral-850/50 transition-colors">
                    <td className="py-3 px-4 text-neutral-400 tabular-nums">
                      {new Date(log.timestamp).toLocaleTimeString()}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                          log.method === 'GET'
                            ? 'bg-emerald-950 text-emerald-400'
                            : 'bg-rose-950 text-rose-400'
                        }`}
                      >
                        {log.method}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-white font-medium">{log.path}</td>
                    <td className="py-3 px-4 text-neutral-400 truncate max-w-[160px]">{log.ip}</td>
                    <td className="py-3 px-4 text-right">
                      <span className="text-emerald-400 font-bold tabular-nums">200 OK</span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-neutral-500 font-sans">
                    <ShieldCheck className="w-8 h-8 mx-auto mb-2 opacity-30 text-emerald-400" />
                    <p className="text-sm">Audit log ready.</p>
                    <p className="text-xs text-neutral-600 mt-0.5">
                      Requests from legitmovies.onrender.com or curl will appear here.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
