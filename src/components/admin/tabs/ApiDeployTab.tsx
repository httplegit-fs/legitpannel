import React, { useState } from 'react';
import { Terminal, Download, Copy, Check, Server, ShieldCheck, CheckCircle2, Globe, Code2 } from 'lucide-react';
import { ManagedSite } from '../../../types/admin';

interface ApiDeployTabProps {
  activeSite: ManagedSite;
}

export const ApiDeployTab: React.FC<ApiDeployTabProps> = ({ activeSite }) => {
  const [copiedCurl, setCopiedCurl] = useState(false);
  const [copiedJson, setCopiedJson] = useState(false);
  const [copiedSnippet, setCopiedSnippet] = useState(false);

  const config = activeSite.config;
  const origin = window.location.origin;
  const siteEndpoint = `${origin}/api/config/${activeSite.id}`;
  const defaultEndpoint = `${origin}/api/config`;

  const curlCommand = `curl -X GET "${origin}/api/config/${activeSite.id}" -H "Accept: application/json"`;

  const clientSnippet = `// Add this to your static site (${activeSite.url}) to connect:
const CONFIG_PRIMARY = "${origin}/api/config/${activeSite.id}";
const CONFIG_FALLBACK = "/site-config.json";

async function fetchRemoteConfig() {
  try {
    const res = await fetch(CONFIG_PRIMARY, { cache: 'no-cache' });
    if (res.ok) return await res.json();
  } catch (err) {
    console.warn("Using offline fallback:", err);
  }
  const fallback = await fetch(CONFIG_FALLBACK);
  return await fallback.json();
}`;

  const copyCurl = () => {
    navigator.clipboard.writeText(curlCommand);
    setCopiedCurl(true);
    setTimeout(() => setCopiedCurl(false), 2000);
  };

  const copyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(config, null, 2));
    setCopiedJson(true);
    setTimeout(() => setCopiedJson(false), 2000);
  };

  const copySnippet = () => {
    navigator.clipboard.writeText(clientSnippet);
    setCopiedSnippet(true);
    setTimeout(() => setCopiedSnippet(false), 2000);
  };

  const downloadJson = () => {
    const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `site-config-${activeSite.id}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Intro Header */}
      <div className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-rose-600/15 border border-rose-500/30 flex items-center justify-center text-rose-400 shrink-0">
            <Terminal className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold text-white">
                API Integration Hub for "{activeSite.name}"
              </h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-neutral-800 text-neutral-300">
                {activeSite.id}
              </span>
            </div>
            <p className="text-xs text-neutral-400 leading-relaxed max-w-2xl mt-1">
              Your remote panel serves locked endpoints for <span className="font-mono text-neutral-200">{activeSite.url}</span>. You can inspect endpoints, download fallback JSON files, and copy integration code.
            </p>
          </div>
        </div>
      </div>

      {/* Endpoints Table */}
      <div className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-6 space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Server className="w-4 h-4 text-emerald-400" />
          Endpoints for "{activeSite.name}" ({activeSite.url})
        </h3>

        <div className="space-y-2.5 text-xs">
          <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <div className="flex items-center gap-2 font-mono">
                <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 font-bold text-[10px]">GET</span>
                <span className="text-white font-semibold">/api/config/{activeSite.id}</span>
              </div>
              <p className="text-neutral-400 text-[11px] mt-1">
                Direct locked endpoint for <span className="text-white font-mono">{activeSite.name}</span>. Polled every 30 seconds.
              </p>
            </div>
            <span className="text-emerald-400 text-[11px] font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> CORS Allowed (*)
            </span>
          </div>

          <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <div className="flex items-center gap-2 font-mono">
                <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 font-bold text-[10px]">GET</span>
                <span className="text-white font-semibold">/api/site-config/{activeSite.id}</span>
              </div>
              <p className="text-neutral-400 text-[11px] mt-1">
                Alternative failover redundant endpoint for {activeSite.name}.
              </p>
            </div>
            <span className="text-emerald-400 text-[11px] font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> CORS Allowed (*)
            </span>
          </div>

          {activeSite.isDefault && (
            <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <div className="flex items-center gap-2 font-mono">
                  <span className="px-2 py-0.5 rounded bg-sky-950 text-sky-400 font-bold text-[10px]">GET</span>
                  <span className="text-white font-semibold">/api/config (Root Default)</span>
                </div>
                <p className="text-neutral-400 text-[11px] mt-1">
                  Because this is the default site, calling <code className="text-rose-400">/api/config</code> without parameters also serves this site!
                </p>
              </div>
              <span className="text-sky-400 text-[11px] font-semibold">Default Alias</span>
            </div>
          )}
        </div>
      </div>

      {/* Code Snippet for Client Site */}
      <div className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-6 space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400 flex items-center gap-1.5">
            <Code2 className="w-4 h-4 text-rose-400" />
            Client Site Integration Code (Copy into {activeSite.name})
          </h4>
          <button
            onClick={copySnippet}
            className="flex items-center gap-1 text-xs text-rose-400 hover:text-rose-300 font-semibold"
          >
            {copiedSnippet ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedSnippet ? 'Copied Snippet' : 'Copy Code'}</span>
          </button>
        </div>
        <pre className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 font-mono text-xs text-neutral-300 overflow-x-auto leading-relaxed custom-scrollbar">
          {clientSnippet}
        </pre>
      </div>

      {/* Quick Tools: cURL Command & Download JSON */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* cURL Box */}
        <div className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-5 space-y-3 flex flex-col justify-between">
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400">
              Terminal Verification (cURL)
            </h4>
            <p className="text-xs text-neutral-400 mt-1">
              Test the live endpoint for {activeSite.name}:
            </p>
            <div className="mt-3 p-3 rounded-xl bg-neutral-950 border border-neutral-800 font-mono text-xs text-rose-300 break-all select-all">
              {curlCommand}
            </div>
          </div>

          <button
            onClick={copyCurl}
            className="w-full mt-3 py-2 px-3 rounded-xl bg-neutral-800 hover:bg-neutral-750 text-neutral-200 text-xs font-semibold border border-neutral-700/80 flex items-center justify-center gap-1.5 transition-colors"
          >
            {copiedCurl ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedCurl ? 'Copied cURL Command' : 'Copy cURL Command'}</span>
          </button>
        </div>

        {/* Offline Fallback Export Box */}
        <div className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-5 space-y-3 flex flex-col justify-between">
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400">
              Offline Fallback JSON Export ({activeSite.name})
            </h4>
            <p className="text-xs text-neutral-400 mt-1">
              Download this file to put in <code className="text-white font-mono">{activeSite.url}</code> as <code className="text-rose-300 font-mono">public/site-config.json</code>.
            </p>
          </div>

          <div className="flex items-center gap-2 mt-3">
            <button
              onClick={downloadJson}
              className="flex-1 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-md transition-colors flex items-center justify-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download site-config.json</span>
            </button>

            <button
              onClick={copyJson}
              className="py-2 px-3 rounded-xl bg-neutral-800 hover:bg-neutral-750 text-neutral-300 text-xs font-semibold border border-neutral-700 transition-colors flex items-center gap-1"
            >
              {copiedJson ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>Copy</span>
            </button>
          </div>
        </div>
      </div>

      {/* Render.com 1-Click Deployment Specification */}
      <div className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-6 space-y-4 text-xs">
        <div className="flex items-center justify-between">
          <h4 className="font-bold uppercase tracking-wider text-white flex items-center gap-2">
            <Globe className="w-4 h-4 text-rose-500" />
            Render.com Deployment Settings (Copy & Paste)
          </h4>
          <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 font-bold text-[10px] uppercase">
            Free Web Service
          </span>
        </div>

        <p className="text-neutral-400 leading-relaxed">
          Follow these exact configuration settings when creating a New Web Service on <strong>dashboard.render.com</strong>:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 font-mono">
          <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 space-y-1">
            <span className="text-[10px] uppercase tracking-wider text-neutral-500 block">Service Name</span>
            <div className="text-white font-bold">legitpannel</div>
            <span className="text-[10px] text-neutral-500 block">Produces URL: https://legitpannel.onrender.com</span>
          </div>

          <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 space-y-1">
            <span className="text-[10px] uppercase tracking-wider text-neutral-500 block">Runtime Environment</span>
            <div className="text-white font-bold">Node</div>
            <span className="text-[10px] text-neutral-500 block">Node.js 18+ or 20+</span>
          </div>

          <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 space-y-1">
            <span className="text-[10px] uppercase tracking-wider text-neutral-500 block">Build Command</span>
            <div className="text-rose-300 font-bold text-xs select-all">npm install --legacy-peer-deps && npm run build</div>
            <span className="text-[10px] text-amber-400 block font-sans">
              ⚠️ Use <code className="font-mono">--legacy-peer-deps</code> to prevent npm ERESOLVE peer conflicts
            </span>
          </div>

          <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 space-y-1">
            <span className="text-[10px] uppercase tracking-wider text-neutral-500 block">Start Command</span>
            <div className="text-rose-300 font-bold text-xs select-all">npm start</div>
          </div>
        </div>

        {/* Credentials Reminder */}
        <div className="p-3.5 rounded-xl bg-neutral-950 border border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="text-neutral-300">
              Admin Login on Render: <strong className="text-white">ID: prime</strong> / <strong className="text-white">Password: legit</strong>
            </span>
          </div>
          <span className="text-[10px] text-emerald-400 font-mono">PBKDF2 Hash Protected</span>
        </div>
      </div>
    </div>
  );
};
