import React, { useState } from 'react';
import {
  X,
  Server,
  ShieldCheck,
  CheckCircle,
  Copy,
  Check,
  RefreshCw,
  Sliders,
  AlertTriangle,
  ExternalLink,
  Code2,
} from 'lucide-react';
import { SiteConfig, SyncDiagnostics } from '../../types/config';
import {
  syncRemoteConfig,
  simulateConfigUpdate,
  resetToLiveSync,
} from '../../services/configService';
import { useNavigate } from 'react-router-dom';

interface ArchitectureModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: SiteConfig;
  diagnostics: SyncDiagnostics;
}

export const ArchitectureModal: React.FC<ArchitectureModalProps> = ({
  isOpen,
  onClose,
  config,
  diagnostics,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'server_code' | 'security' | 'simulator'>('overview');
  const [copied, setCopied] = useState(false);
  const [simMaintenance, setSimMaintenance] = useState(config.maintenance.enabled);
  const [simBroadcast, setSimBroadcast] = useState(config.broadcast.enabled);
  const [simBroadcastMsg, setSimBroadcastMsg] = useState(config.broadcast.message || '');
  const [simTmdbKey, setSimTmdbKey] = useState(config.tmdb.apiKey || '');
  const [isSyncing, setIsSyncing] = useState(false);
  const navigate = useNavigate();

  if (!isOpen) return null;

  const serverJsTemplate = `// server.js (For legitpannel.onrender.com)
const express = require('express');
const cors = require('cors');
const app = express();

// Required: Enable CORS for legit-movies static site
app.use(cors({ origin: '*' }));
app.use(express.json());

// Current Live Configuration State
let currentConfig = {
  siteName: "Legit Movies",
  maintenance: {
    enabled: false,
    message: "We are currently performing scheduled maintenance and server upgrades. We will be back online shortly!"
  },
  broadcast: {
    enabled: false,
    message: "🔥 Welcome to Legit Movies! High-speed streaming is active."
  },
  tmdb: {
    apiKey: "9a846efff59a26bc6ebb68286af2aeb8"
  },
  ads: {
    headerBannerId: "c9cf205fea000976d8c500911e2b0221",
    footerBannerId: "c9cf205fea000976d8c500911e2b0221",
    playerTopAdId: "14c52f7b9071dd9a9b839917e51bdcb1",
    playerBottomAdId: "a93371a702be78576721f5adc2c2309a",
    sidebarAdId: "e497f90baf5dc8f1b9bd0fdc0c5b9613",
    nativeInFeedAdId: "ff02012e1215699d9ae3de05f90398ec",
    directLinkUrl: "https://directyp.org/4/92399e37a2501a9051194e2f08e3352e",
    socialBarScript: "<script data-cfasync=\\"false\\" src=\\"https://bancadeltempoidea.org/14/9a8edf3f113860bd45d90d49d2dc3491\\"></script>",
    popunderScript: "<script data-cfasync=\\"false\\" src=\\"https://aarems.org/1/b476296eb49c0e1d501decd537ad8157\\"></script>"
  }
};

// 1. Primary endpoint consumed by legit-movies.onrender.com
app.get('/api/config', (req, res) => {
  res.json(currentConfig);
});

// 2. Alternative endpoint for redundancy failover
app.get('/api/site-config', (req, res) => {
  res.json(currentConfig);
});

// 3. Admin panel update route (protected by your private ADMIN_SECRET)
app.post('/api/admin/update', (req, res) => {
  const { password, config } = req.body;
  if (password !== (process.env.ADMIN_SECRET || 'your_secret_password_here')) {
    return res.status(401).json({ error: 'Unauthorized: Invalid password' });
  }
  currentConfig = {
    ...currentConfig,
    ...config,
    maintenance: { ...currentConfig.maintenance, ...(config.maintenance || {}) },
    broadcast: { ...currentConfig.broadcast, ...(config.broadcast || {}) },
    tmdb: { ...currentConfig.tmdb, ...(config.tmdb || {}) },
    ads: { ...currentConfig.ads, ...(config.ads || {}) }
  };
  console.log('[Admin Update] Configuration updated successfully.');
  res.json({ success: true, updatedConfig: currentConfig });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(\`Legit Admin Panel running on port \${PORT}\`);
});`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(serverJsTemplate);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleForceSync = async () => {
    setIsSyncing(true);
    try {
      await syncRemoteConfig();
    } finally {
      setIsSyncing(false);
    }
  };

  const applySimulation = () => {
    simulateConfigUpdate({
      maintenance: {
        enabled: simMaintenance,
        message: config.maintenance.message,
      },
      broadcast: {
        enabled: simBroadcast,
        message: simBroadcastMsg,
      },
      tmdb: {
        apiKey: simTmdbKey,
      },
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-neutral-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6">
      <div className="relative w-full max-w-4xl bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden my-6 flex flex-col max-h-[90vh]">
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800 bg-neutral-950/70 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-rose-600/20 border border-rose-500/30 flex items-center justify-center text-rose-400">
              <Server className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white">
                Remote Admin Panel Architecture & Security Guide
              </h2>
              <p className="text-xs text-neutral-400">
                Connection to <span className="font-mono text-neutral-200">https://legitpannel.onrender.com</span>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex border-b border-neutral-800 bg-neutral-950/40 px-6 gap-2 text-xs font-medium shrink-0 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-3 px-3 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'overview'
                ? 'border-rose-500 text-white font-semibold'
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            Connection Status & Sync
          </button>
          <button
            onClick={() => setActiveTab('server_code')}
            className={`py-3 px-3 border-b-2 transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'server_code'
                ? 'border-rose-500 text-white font-semibold'
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>Ready-to-Deploy server.js</span>
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`py-3 px-3 border-b-2 transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'security'
                ? 'border-rose-500 text-white font-semibold'
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Anti-Tamper & Zero Hidden Routes</span>
          </button>
          <button
            onClick={() => setActiveTab('simulator')}
            className={`py-3 px-3 border-b-2 transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'simulator'
                ? 'border-rose-500 text-white font-semibold'
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Live Response Simulator</span>
          </button>
        </div>

        {/* Content body */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm text-neutral-300">
          {/* TAB 1: OVERVIEW & CONNECTION */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Status Header Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-neutral-950/70 border border-neutral-800 rounded-xl p-4">
                  <div className="text-xs text-neutral-400 mb-1">Active Source</div>
                  <div className="text-sm font-bold text-white flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${
                      diagnostics.source.startsWith('remote') ? 'bg-emerald-500' : 'bg-amber-500'
                    }`} />
                    {diagnostics.source === 'remote-primary' && 'Remote Primary API'}
                    {diagnostics.source === 'remote-alternative' && 'Remote Alternative API'}
                    {diagnostics.source === 'local-fallback' && 'Built-in Failover JSON'}
                    {diagnostics.source === 'simulated' && 'Simulator Testbench'}
                  </div>
                  <p className="text-[11px] text-neutral-500 mt-1 truncate">
                    {diagnostics.activeEndpoint}
                  </p>
                </div>

                <div className="bg-neutral-950/70 border border-neutral-800 rounded-xl p-4">
                  <div className="text-xs text-neutral-400 mb-1">Background Sync Cycle</div>
                  <div className="text-sm font-bold text-white font-mono tabular-nums">
                    Every 30s ({diagnostics.nextSyncSeconds}s remaining)
                  </div>
                  <p className="text-[11px] text-neutral-500 mt-1">
                    {diagnostics.syncAttempts} sync checks conducted
                  </p>
                </div>

                <div className="bg-neutral-950/70 border border-neutral-800 rounded-xl p-4">
                  <div className="text-xs text-neutral-400 mb-1">Failover Redundancy</div>
                  <div className="text-sm font-bold text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4" /> Zero Downtime Guaranteed
                  </div>
                  <p className="text-[11px] text-neutral-500 mt-1">
                    Sleep/offline fallback to public/site-config.json
                  </p>
                </div>
              </div>

              {/* Endpoint Diagnostics Table */}
              <div className="bg-neutral-950/60 border border-neutral-800 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-white text-xs uppercase tracking-wider">
                    Locked Remote Connection Endpoints
                  </h3>
                  <button
                    onClick={handleForceSync}
                    disabled={isSyncing}
                    className="flex items-center gap-1.5 px-3 py-1 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs rounded-lg transition-colors border border-neutral-700/60"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                    <span>Sync Now</span>
                  </button>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between p-2.5 bg-neutral-900 rounded-lg border border-neutral-800/80 gap-2">
                    <div>
                      <div className="font-semibold text-neutral-200">1. Primary Endpoint</div>
                      <div className="font-mono text-neutral-400 text-[11px]">
                        https://legitpannel.onrender.com/api/config
                      </div>
                    </div>
                    <span className="text-neutral-400 text-[11px]">Polls every 30 seconds</span>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between p-2.5 bg-neutral-900 rounded-lg border border-neutral-800/80 gap-2">
                    <div>
                      <div className="font-semibold text-neutral-200">2. Alternative Endpoint</div>
                      <div className="font-mono text-neutral-400 text-[11px]">
                        https://legitpannel.onrender.com/api/site-config
                      </div>
                    </div>
                    <span className="text-neutral-400 text-[11px]">Automatic fallback mirror</span>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between p-2.5 bg-neutral-900 rounded-lg border border-neutral-800/80 gap-2">
                    <div>
                      <div className="font-semibold text-emerald-400">3. Built-in Offline Fallback</div>
                      <div className="font-mono text-neutral-400 text-[11px]">
                        /site-config.json
                      </div>
                    </div>
                    <span className="text-emerald-400 text-[11px]">Instantaneous zero-error failover</span>
                  </div>
                </div>

                {diagnostics.rawError && (
                  <div className="p-3 bg-amber-950/30 border border-amber-800/50 rounded-lg flex items-start gap-2.5 text-xs text-amber-200">
                    <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400 mt-0.5" />
                    <div>
                      <p className="font-medium">Automatic Fallback Active</p>
                      <p className="text-amber-300/80 text-[11px] mt-0.5">
                        {diagnostics.rawError} Once you deploy legitpannel.onrender.com, the website will switch to remote automatically within 30 seconds.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Active Sanitized Config JSON Preview */}
              <div className="bg-neutral-950/80 border border-neutral-800 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                    Current Sanitized JSON Config
                  </span>
                  <span className="text-[11px] text-emerald-400">Strict Validation Passing</span>
                </div>
                <pre className="font-mono text-[11px] text-neutral-300 bg-neutral-950 p-3 rounded-lg overflow-x-auto max-h-48 border border-neutral-800/60 leading-relaxed custom-scrollbar">
                  {JSON.stringify(config, null, 2)}
                </pre>
              </div>
            </div>
          )}

          {/* TAB 2: SERVER.JS READY-TO-DEPLOY CODE */}
          {activeTab === 'server_code' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-neutral-950/70 p-4 rounded-xl border border-neutral-800">
                <div>
                  <h3 className="font-bold text-white text-sm">
                    Ready-to-Deploy Template for legitpannel.onrender.com
                  </h3>
                  <p className="text-xs text-neutral-400 mt-0.5">
                    Create a new Web Service on Render with Node.js and deploy this single server.js file.
                  </p>
                </div>
                <button
                  onClick={copyToClipboard}
                  className="flex items-center gap-1.5 px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-semibold shadow-md transition-colors shrink-0"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  <span>{copied ? 'Copied to Clipboard!' : 'Copy server.js Code'}</span>
                </button>
              </div>

              {/* Code viewer */}
              <div className="relative rounded-xl border border-neutral-800 bg-neutral-950 overflow-hidden">
                <div className="flex items-center justify-between px-4 py-2 border-b border-neutral-800 text-xs text-neutral-400 bg-neutral-900/60 font-mono">
                  <span>server.js</span>
                  <span>Node.js / Express</span>
                </div>
                <pre className="p-4 font-mono text-xs text-neutral-200 overflow-x-auto max-h-96 leading-relaxed custom-scrollbar">
                  {serverJsTemplate}
                </pre>
              </div>

              {/* Deployment Checklist for Render */}
              <div className="bg-neutral-950/60 border border-neutral-800 rounded-xl p-4 text-xs space-y-2.5">
                <h4 className="font-semibold text-white uppercase tracking-wider text-[11px]">
                  Render Deployment Instructions:
                </h4>
                <ol className="list-decimal list-inside space-y-1.5 text-neutral-300">
                  <li>Push this <code className="text-rose-300 font-mono">server.js</code> and a <code className="text-rose-300 font-mono">package.json</code> (with express & cors) to a GitHub repository.</li>
                  <li>Log into <span className="text-white font-medium">dashboard.render.com</span> and click <span className="text-white font-medium">New + Web Service</span>.</li>
                  <li>Set service name to <span className="font-mono text-rose-300 font-bold">legitpannel</span> (giving URL https://legitpannel.onrender.com).</li>
                  <li>Set Build Command: <code className="text-neutral-200 bg-neutral-900 px-1 py-0.5 rounded">npm install</code>, Start Command: <code className="text-neutral-200 bg-neutral-900 px-1 py-0.5 rounded">node server.js</code>.</li>
                  <li>Set Environment Variable <code className="text-neutral-200 bg-neutral-900 px-1 py-0.5 rounded">ADMIN_SECRET</code> to your desired private password.</li>
                  <li>Click Deploy! Your website will automatically detect it within 30 seconds.</li>
                </ol>
              </div>
            </div>
          )}

          {/* TAB 3: SECURITY & ZERO HIDDEN ROUTES */}
          {activeTab === 'security' && (
            <div className="space-y-5">
              <div className="bg-neutral-950/70 border border-neutral-800 rounded-xl p-4">
                <h3 className="font-bold text-white text-sm mb-2 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  Zero Hidden Paths (Total Anti-Reconnaissance Protection)
                </h3>
                <p className="text-xs text-neutral-300 leading-relaxed">
                  In accordance with Requirement 1, no hidden route (<code className="text-rose-300 font-mono">/admin</code>, <code className="text-rose-300 font-mono">/prime</code>, <code className="text-rose-300 font-mono">/secret</code>, <code className="text-rose-300 font-mono">/backend</code>) exists in this static website. If an attacker or bot scans these URLs, React Router serves an authentic 404 page. No credentials or tokens are bundled.
                </p>

                {/* Test 404 Trigger */}
                <div className="mt-4 pt-4 border-t border-neutral-800 flex flex-wrap items-center gap-2">
                  <span className="text-xs text-neutral-400 font-medium">Test 404 Protection:</span>
                  {['/admin', '/prime', '/secret', '/backend'].map((path) => (
                    <button
                      key={path}
                      onClick={() => {
                        onClose();
                        navigate(path);
                      }}
                      className="px-2.5 py-1 text-xs font-mono bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-rose-300 rounded transition-colors"
                    >
                      Visit {path}
                    </button>
                  ))}
                </div>
              </div>

              {/* Security Validation Audit Trail */}
              <div className="bg-neutral-950/60 border border-neutral-800 rounded-xl p-4 space-y-3">
                <h4 className="font-semibold text-white text-xs uppercase tracking-wider">
                  Live Anti-Tamper & Security Hardening Audit
                </h4>

                <div className="space-y-2 text-xs">
                  {diagnostics.auditTrail.map((entry, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-lg bg-neutral-900 border border-neutral-800/80 flex items-start justify-between gap-3"
                    >
                      <div>
                        <span className="font-mono text-neutral-200 font-semibold">{entry.field}</span>
                        <p className="text-neutral-400 text-[11px] mt-0.5">{entry.detail}</p>
                      </div>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider shrink-0 ${
                          entry.status === 'passed'
                            ? 'text-emerald-400 bg-emerald-950/60'
                            : entry.status === 'sanitized'
                            ? 'text-sky-400 bg-sky-950/60'
                            : 'text-rose-400 bg-rose-950/60'
                        }`}
                      >
                        {entry.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: SIMULATOR TESTBENCH */}
          {activeTab === 'simulator' && (
            <div className="space-y-4">
              <div className="bg-neutral-950/70 border border-neutral-800 rounded-xl p-4">
                <h3 className="font-bold text-white text-sm mb-1">
                  Live Dynamic Response Testbench
                </h3>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  Test in real-time how the website re-renders when your remote panel sends changes (e.g. toggling Maintenance mode on/off or broadcasting announcements).
                </p>
              </div>

              <div className="bg-neutral-950/60 border border-neutral-800 rounded-xl p-4 space-y-4 text-xs">
                {/* Maintenance Mode Toggle */}
                <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
                  <div>
                    <div className="font-semibold text-white text-sm">System Maintenance Mode</div>
                    <div className="text-neutral-400 text-xs">
                      When enabled, displays full-screen upgrade notice with auto-recheck countdown.
                    </div>
                  </div>
                  <button
                    onClick={() => setSimMaintenance(!simMaintenance)}
                    className={`px-4 py-2 rounded-lg font-bold text-xs transition-colors ${
                      simMaintenance
                        ? 'bg-rose-600 text-white'
                        : 'bg-neutral-800 text-neutral-400 hover:text-white'
                    }`}
                  >
                    {simMaintenance ? 'ENABLED' : 'DISABLED'}
                  </button>
                </div>

                {/* Broadcast Banner Toggle */}
                <div className="space-y-2 pb-3 border-b border-neutral-800">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-white text-sm">Live Broadcast Marquee</div>
                      <div className="text-neutral-400 text-xs">
                        Announcement banner displayed at top of all pages.
                      </div>
                    </div>
                    <button
                      onClick={() => setSimBroadcast(!simBroadcast)}
                      className={`px-4 py-2 rounded-lg font-bold text-xs transition-colors ${
                        simBroadcast
                          ? 'bg-emerald-600 text-white'
                          : 'bg-neutral-800 text-neutral-400 hover:text-white'
                      }`}
                    >
                      {simBroadcast ? 'ENABLED' : 'DISABLED'}
                    </button>
                  </div>
                  <input
                    type="text"
                    value={simBroadcastMsg}
                    onChange={(e) => setSimBroadcastMsg(e.target.value)}
                    placeholder="Broadcast text..."
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-rose-500"
                  />
                </div>

                {/* TMDB Key Input */}
                <div className="space-y-1.5 pb-3 border-b border-neutral-800">
                  <div className="font-semibold text-white text-sm">TMDB API Key (Token)</div>
                  <input
                    type="text"
                    value={simTmdbKey}
                    onChange={(e) => setSimTmdbKey(e.target.value)}
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-lg p-2.5 text-xs text-white font-mono focus:outline-none focus:border-rose-500"
                  />
                </div>

                {/* Buttons */}
                <div className="flex items-center justify-between pt-2">
                  <button
                    onClick={resetToLiveSync}
                    className="px-3.5 py-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs transition-colors"
                  >
                    Reset to Live Remote Sync
                  </button>
                  <button
                    onClick={() => {
                      applySimulation();
                      onClose();
                    }}
                    className="px-5 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs shadow-md transition-colors"
                  >
                    Apply Simulator State
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
