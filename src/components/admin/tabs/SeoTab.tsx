import React from 'react';
import { Search, Globe, Image as ImageIcon, Palette, CheckCircle2, ExternalLink } from 'lucide-react';
import { SeoConfig, SiteCategory } from '../../../types/admin';

interface SeoTabProps {
  seo: SeoConfig;
  siteName: string;
  siteUrl: string;
  category: SiteCategory;
  onSeoChange: (updated: SeoConfig) => void;
  onCategoryChange: (category: SiteCategory) => void;
}

export const SeoTab: React.FC<SeoTabProps> = ({
  seo,
  siteName,
  siteUrl,
  category,
  onSeoChange,
  onCategoryChange,
}) => {
  return (
    <div className="space-y-6">
      {/* Intro Header */}
      <div className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0">
            <Search className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-white">
              SEO, OpenGraph & Branding Configuration
            </h2>
            <p className="text-xs text-neutral-400 leading-relaxed max-w-2xl mt-1">
              Universal metadata consumed by search engines and social media networks. Update meta tags, social share banners, theme accents, and site categories without redeploying code.
            </p>
          </div>
        </div>
      </div>

      {/* Website Category & Theme */}
      <div className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-6 space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Palette className="w-4 h-4 text-indigo-400" />
          Website Category & Theme Accent
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          {/* Category */}
          <div className="space-y-1.5">
            <label className="font-semibold uppercase tracking-wider text-neutral-400">
              Site Category
            </label>
            <select
              value={category}
              onChange={(e) => onCategoryChange(e.target.value as SiteCategory)}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-indigo-500"
            >
              <option value="movie">Movie / Streaming Platform</option>
              <option value="ecommerce">E-Commerce / Online Store</option>
              <option value="blog">Blog / Editorial / News</option>
              <option value="saas">SaaS / Web Application</option>
              <option value="general">General / Landing Page</option>
            </select>
          </div>

          {/* Primary Color */}
          <div className="space-y-1.5">
            <label className="font-semibold uppercase tracking-wider text-neutral-400">
              Brand Accent Color
            </label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={seo.primaryColor || '#e11d48'}
                onChange={(e) => onSeoChange({ ...seo, primaryColor: e.target.value })}
                className="w-9 h-9 rounded-lg border border-neutral-800 bg-neutral-950 cursor-pointer p-0.5"
              />
              <input
                type="text"
                value={seo.primaryColor || '#e11d48'}
                onChange={(e) => onSeoChange({ ...seo, primaryColor: e.target.value })}
                className="flex-1 bg-neutral-950 border border-neutral-800 rounded-xl p-2.5 text-white font-mono focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Theme Mode */}
          <div className="space-y-1.5">
            <label className="font-semibold uppercase tracking-wider text-neutral-400">
              Default Theme
            </label>
            <select
              value={seo.themeMode || 'dark'}
              onChange={(e) => onSeoChange({ ...seo, themeMode: e.target.value as any })}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-indigo-500"
            >
              <option value="dark">Dark Theme (Default)</option>
              <option value="light">Light Theme</option>
              <option value="auto">Auto (Match System Preferences)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Meta SEO Inputs */}
      <div className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-6 space-y-4 text-xs">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Globe className="w-4 h-4 text-indigo-400" />
          Search Engine Optimization (SEO)
        </h3>

        {/* Tagline */}
        <div className="space-y-1.5">
          <label className="font-semibold uppercase tracking-wider text-neutral-400">
            Brand Tagline / Slogan
          </label>
          <input
            type="text"
            value={seo.tagline}
            onChange={(e) => onSeoChange({ ...seo, tagline: e.target.value })}
            placeholder="e.g. Stream HD Movies & Trending TV Shows"
            className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-indigo-500"
          />
        </div>

        {/* Meta Title */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="font-semibold uppercase tracking-wider text-neutral-400">
              HTML Page Title (&lt;title&gt;)
            </label>
            <span className="text-[11px] text-neutral-500 tabular-nums">
              {seo.metaTitle.length}/60 recommended
            </span>
          </div>
          <input
            type="text"
            value={seo.metaTitle}
            onChange={(e) => onSeoChange({ ...seo, metaTitle: e.target.value })}
            placeholder="e.g. Legit Movies — Watch High Definition Movies Online"
            className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-indigo-500"
          />
        </div>

        {/* Meta Description */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="font-semibold uppercase tracking-wider text-neutral-400">
              Meta Description
            </label>
            <span className="text-[11px] text-neutral-500 tabular-nums">
              {seo.metaDescription.length}/160 recommended
            </span>
          </div>
          <textarea
            rows={3}
            value={seo.metaDescription}
            onChange={(e) => onSeoChange({ ...seo, metaDescription: e.target.value })}
            placeholder="A short, catchy summary of the website content that displays in Google search results."
            className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-indigo-500 leading-relaxed"
          />
        </div>

        {/* Keywords */}
        <div className="space-y-1.5">
          <label className="font-semibold uppercase tracking-wider text-neutral-400">
            Meta Keywords (Comma separated)
          </label>
          <input
            type="text"
            value={seo.metaKeywords}
            onChange={(e) => onSeoChange({ ...seo, metaKeywords: e.target.value })}
            placeholder="movies, streaming, series, 4k, online, hd"
            className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-indigo-500"
          />
        </div>

        {/* OG Image */}
        <div className="space-y-1.5">
          <label className="font-semibold uppercase tracking-wider text-neutral-400 flex items-center gap-1.5">
            <ImageIcon className="w-3.5 h-3.5 text-indigo-400" />
            OpenGraph Social Share Card Image URL (1200x630)
          </label>
          <input
            type="text"
            value={seo.ogImageUrl}
            onChange={(e) => onSeoChange({ ...seo, ogImageUrl: e.target.value })}
            placeholder="https://mysite.com/og-banner.jpg"
            className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-2.5 text-white font-mono focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Google Search Result Preview */}
      <div className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-6 space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400">
          Google Search Engine Result Snippet Preview
        </h4>

        <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 max-w-xl">
          <div className="text-[11px] text-neutral-400 flex items-center gap-1.5 truncate">
            <span className="w-4 h-4 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-[10px] font-bold">
              G
            </span>
            <span className="truncate">{siteUrl}</span>
          </div>
          <div className="text-base text-sky-400 hover:underline font-medium cursor-pointer mt-1 line-clamp-1">
            {seo.metaTitle || siteName}
          </div>
          <div className="text-xs text-neutral-400 line-clamp-2 mt-1 leading-relaxed">
            {seo.metaDescription || 'No meta description configured for this website.'}
          </div>
        </div>
      </div>
    </div>
  );
};
