import React from 'react';
import { Film, Home, ArrowLeft } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

export const NotFoundView: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Clean path display (anti-tamper sanitization)
  const cleanPath = location.pathname.replace(/[^a-zA-Z0-9_\-\/]/g, '').slice(0, 40);

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 py-16 text-center">
      <div className="w-16 h-16 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center justify-center text-rose-500 mb-6 shadow-xl">
        <Film className="w-8 h-8 opacity-70" />
      </div>

      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-rose-400 mb-2">
        <span>Error 404</span>
        <span aria-hidden="true" className="text-neutral-600">·</span>
        <span>Route Not Found</span>
      </div>

      <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-3 text-balance">
        Lost in the Cinematic Void
      </h1>

      <p className="max-w-md text-sm text-neutral-400 mb-6 leading-relaxed">
        The title, series, or page requested at <code className="px-1.5 py-0.5 rounded bg-neutral-900 border border-neutral-800 text-neutral-300 font-mono text-xs">{cleanPath}</code> does not exist, has expired, or the path is unauthorized.
      </p>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 px-5 py-2.5 text-xs sm:text-sm font-semibold text-white bg-rose-600 hover:bg-rose-500 rounded-xl transition-colors shadow-lg shadow-rose-950/40"
        >
          <Home className="w-4 h-4" />
          <span>Back to Home</span>
        </button>

        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 px-4 py-2.5 text-xs sm:text-sm font-medium text-neutral-300 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 rounded-xl transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Previous Page</span>
        </button>
      </div>

      <div className="mt-12 text-[11px] text-neutral-600 font-mono">
        Anti-Reconnaissance Architecture Active · Zero Server Footprint
      </div>
    </div>
  );
};
