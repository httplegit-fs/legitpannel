import React from 'react';
import { BarChart3, Code2, ShieldCheck, CheckCircle2, Info } from 'lucide-react';
import { AnalyticsConfig } from '../../../types/admin';

interface AnalyticsTabProps {
  analytics: AnalyticsConfig;
  onChange: (updated: AnalyticsConfig) => void;
}

export const AnalyticsTab: React.FC<AnalyticsTabProps> = ({ analytics, onChange }) => {
  return (
    <div className="space-y-6">
      {/* Intro Header */}
      <div className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-teal-600/15 border border-teal-500/30 flex items-center justify-center text-teal-400 shrink-0">
            <BarChart3 className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-white">
              Analytics, Tracking & Custom Scripts
            </h2>
            <p className="text-xs text-neutral-400 leading-relaxed max-w-2xl mt-1">
              Universal tracking identifiers and custom HTML snippets for Google Analytics, Google Tag Manager, Meta Pixel, Webmaster verification, and live support chat widgets.
            </p>
          </div>
        </div>
      </div>

      {/* Tracking IDs Grid */}
      <div className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-6 space-y-4 text-xs">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-teal-400" />
          Major Webmaster & Analytics Identifiers
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* GA4 */}
          <div className="space-y-1.5">
            <label className="font-semibold uppercase tracking-wider text-neutral-400">
              Google Analytics (GA4) ID
            </label>
            <input
              type="text"
              value={analytics.googleAnalyticsId}
              onChange={(e) => onChange({ ...analytics, googleAnalyticsId: e.target.value.trim() })}
              placeholder="e.g. G-ABC123XYZ"
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-2.5 text-white font-mono focus:outline-none focus:border-teal-500"
            />
            <p className="text-[11px] text-neutral-500">Auto-injects Google gtag.js loader tag.</p>
          </div>

          {/* GTM */}
          <div className="space-y-1.5">
            <label className="font-semibold uppercase tracking-wider text-neutral-400">
              Google Tag Manager (GTM)
            </label>
            <input
              type="text"
              value={analytics.googleTagManagerId}
              onChange={(e) => onChange({ ...analytics, googleTagManagerId: e.target.value.trim() })}
              placeholder="e.g. GTM-XXXXXXX"
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-2.5 text-white font-mono focus:outline-none focus:border-teal-500"
            />
            <p className="text-[11px] text-neutral-500">Tag Manager container ID.</p>
          </div>

          {/* Meta Pixel */}
          <div className="space-y-1.5">
            <label className="font-semibold uppercase tracking-wider text-neutral-400">
              Meta / Facebook Pixel ID
            </label>
            <input
              type="text"
              value={analytics.facebookPixelId}
              onChange={(e) => onChange({ ...analytics, facebookPixelId: e.target.value.trim() })}
              placeholder="e.g. 123456789012345"
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-2.5 text-white font-mono focus:outline-none focus:border-teal-500"
            />
            <p className="text-[11px] text-neutral-500">Facebook conversion pixel tracking.</p>
          </div>
        </div>
      </div>

      {/* Custom Head & Footer Scripts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 text-xs">
        {/* Custom Head Code */}
        <div className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <label className="font-semibold text-white flex items-center gap-1.5">
              <Code2 className="w-4 h-4 text-teal-400" />
              Custom &lt;head&gt; Code
            </label>
            <span className="text-[10px] text-neutral-500">Meta tags, Fonts, Verification</span>
          </div>

          <textarea
            rows={6}
            value={analytics.customHeadCode}
            onChange={(e) => onChange({ ...analytics, customHeadCode: e.target.value })}
            placeholder={`<meta name="google-site-verification" content="..." />\n<!-- Google Fonts or Custom Meta Tags -->`}
            className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-3 text-white font-mono focus:outline-none focus:border-teal-500 leading-relaxed custom-scrollbar text-[11px]"
          />

          <p className="text-[11px] text-neutral-500">
            Injected inside the document <code>&lt;head&gt;</code> before page rendering.
          </p>
        </div>

        {/* Custom Footer Code */}
        <div className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <label className="font-semibold text-white flex items-center gap-1.5">
              <Code2 className="w-4 h-4 text-teal-400" />
              Custom &lt;footer&gt; / Body Scripts
            </label>
            <span className="text-[10px] text-neutral-500">Chat widgets, Hotjar, Clarity</span>
          </div>

          <textarea
            rows={6}
            value={analytics.customFooterCode}
            onChange={(e) => onChange({ ...analytics, customFooterCode: e.target.value })}
            placeholder={`<!-- Tawk.to, Crisp Chat, or Microsoft Clarity Tracking Script -->\n<script type="text/javascript">...</script>`}
            className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-3 text-white font-mono focus:outline-none focus:border-teal-500 leading-relaxed custom-scrollbar text-[11px]"
          />

          <p className="text-[11px] text-neutral-500">
            Injected at the end of <code>&lt;body&gt;</code> for live customer support chat or telemetry.
          </p>
        </div>
      </div>
    </div>
  );
};
