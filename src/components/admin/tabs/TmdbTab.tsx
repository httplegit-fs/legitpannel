import React, { useState } from 'react';
import { Film, CheckCircle2, AlertCircle, RefreshCw, Key, ExternalLink } from 'lucide-react';
import { TmdbConfig } from '../../../types/admin';
import { testTmdbApiKey } from '../../../services/adminService';

interface TmdbTabProps {
  tmdb: TmdbConfig;
  onChange: (updated: TmdbConfig) => void;
}

export const TmdbTab: React.FC<TmdbTabProps> = ({ tmdb, onChange }) => {
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{
    tested: boolean;
    valid: boolean;
    message: string;
    sampleMovie?: string;
    totalResults?: number;
  }>({
    tested: false,
    valid: false,
    message: '',
  });

  const handleTestKey = async () => {
    if (!tmdb.apiKey.trim()) {
      setTestResult({
        tested: true,
        valid: false,
        message: 'Please enter a TMDB API key before testing.',
      });
      return;
    }

    setTesting(true);
    const result = await testTmdbApiKey(tmdb.apiKey.trim());
    setTesting(false);
    setTestResult({
      tested: true,
      valid: result.valid,
      message: result.message,
      sampleMovie: result.sampleMovie,
      totalResults: result.totalResults,
    });
  };

  const isFormatValid = /^[a-zA-Z0-9]{16,64}$/.test(tmdb.apiKey.trim());

  return (
    <div className="space-y-6">
      {/* Intro Box */}
      <div className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-sky-600/15 border border-sky-500/30 flex items-center justify-center text-sky-400 shrink-0">
            <Film className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h2 className="text-base sm:text-lg font-bold text-white">
              The Movie Database (TMDB) API Configuration
            </h2>
            <p className="text-xs text-neutral-400 leading-relaxed max-w-2xl">
              Legit Movies uses TMDB API to fetch live metadata: posters, high-res backdrops, release years, cast credits, synopses, and user ratings. This key is securely delivered to <span className="font-mono text-neutral-200">legitmovies.onrender.com</span> via <code className="text-rose-400 font-mono">GET /api/config</code>.
            </p>
          </div>
        </div>
      </div>

      {/* API Key Form */}
      <div className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-6 space-y-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1.5">
            TMDB v3 API Key (Read Access Token)
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-500">
              <Key className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={tmdb.apiKey}
              onChange={(e) => {
                onChange({ ...tmdb, apiKey: e.target.value.trim() });
                setTestResult({ tested: false, valid: false, message: '' });
              }}
              placeholder="e.g. 9a846efff59a26bc6ebb68286af2aeb8"
              className="w-full pl-9 pr-28 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-xs sm:text-sm text-white font-mono placeholder-neutral-600 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
            />
            <button
              type="button"
              onClick={handleTestKey}
              disabled={testing || !tmdb.apiKey}
              className="absolute inset-y-1.5 right-1.5 px-3 bg-sky-600 hover:bg-sky-500 text-white rounded-lg text-xs font-semibold transition-colors disabled:opacity-50 flex items-center gap-1.5"
            >
              {testing ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : null}
              <span>{testing ? 'Testing...' : 'Test Key'}</span>
            </button>
          </div>
        </div>

        {/* Format validation status */}
        <div className="flex items-center justify-between text-xs">
          <span className="text-neutral-400">
            Format Constraint: 16–64 alphanumeric characters
          </span>
          <span
            className={`font-semibold flex items-center gap-1 ${
              isFormatValid ? 'text-emerald-400' : 'text-rose-400'
            }`}
          >
            {isFormatValid ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5" /> Format Valid
              </>
            ) : (
              <>
                <AlertCircle className="w-3.5 h-3.5" /> Invalid Key Format
              </>
            )}
          </span>
        </div>

        {/* Live Test Feedback Banner */}
        {testResult.tested && (
          <div
            className={`p-4 rounded-xl border flex items-start gap-3 text-xs leading-relaxed ${
              testResult.valid
                ? 'bg-emerald-950/40 border-emerald-700/60 text-emerald-200'
                : 'bg-rose-950/40 border-rose-800/60 text-rose-200'
            }`}
          >
            {testResult.valid ? (
              <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-400 mt-0.5" />
            ) : (
              <AlertCircle className="w-5 h-5 shrink-0 text-rose-400 mt-0.5" />
            )}
            <div>
              <p className="font-semibold text-sm">
                {testResult.valid ? 'TMDB API Connection Confirmed!' : 'Verification Failed'}
              </p>
              <p className="mt-0.5">{testResult.message}</p>
              {testResult.sampleMovie && (
                <p className="mt-1 text-emerald-300 font-mono text-[11px]">
                  Sample query returned: "{testResult.sampleMovie}" ({testResult.totalResults || 0} results)
                </p>
              )}
            </div>
          </div>
        )}

        {/* How to get a new key */}
        <div className="pt-4 border-t border-neutral-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-neutral-400">
          <div>
            Need a fresh TMDB key or rotating credentials?
          </div>
          <a
            href="https://www.themoviedb.org/settings/api"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-sky-400 hover:text-sky-300 font-semibold"
          >
            <span>Generate Free TMDB API Key</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
};
