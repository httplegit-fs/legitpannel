import React, { useState } from 'react';
import { X, Globe, Plus, Sparkles, Check, AlertCircle } from 'lucide-react';
import { ManagedSite, SiteCategory } from '../../../types/admin';

interface AddSiteModalProps {
  isOpen: boolean;
  onClose: () => void;
  existingSites: ManagedSite[];
  onAddSite: (siteData: { name: string; url: string; slug?: string; category?: SiteCategory; cloneFrom?: string }) => Promise<boolean>;
}

export const AddSiteModal: React.FC<AddSiteModalProps> = ({
  isOpen,
  onClose,
  existingSites,
  onAddSite,
}) => {
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [slug, setSlug] = useState('');
  const [category, setCategory] = useState<SiteCategory>('general');
  const [cloneFrom, setCloneFrom] = useState<string>('legitmovies');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleNameChange = (val: string) => {
    setName(val);
    const autoSlug = val
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
    setSlug(autoSlug);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError('Please provide a website name.');
      return;
    }

    if (!url.trim()) {
      setError('Please provide the website URL (e.g. https://mysite.onrender.com).');
      return;
    }

    let formattedUrl = url.trim();
    if (!/^https?:\/\//i.test(formattedUrl)) {
      formattedUrl = `https://${formattedUrl}`;
    }

    try {
      new URL(formattedUrl);
    } catch {
      setError('Please provide a valid website URL format.');
      return;
    }

    setIsSubmitting(true);
    const success = await onAddSite({
      name: name.trim(),
      url: formattedUrl,
      slug: slug.trim() || undefined,
      category,
      cloneFrom: cloneFrom || undefined,
    });
    setIsSubmitting(false);

    if (success) {
      setName('');
      setUrl('');
      setSlug('');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-neutral-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 select-none">
      <div className="relative w-full max-w-lg bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden my-6">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800 bg-neutral-950/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-600/15 border border-rose-500/30 flex items-center justify-center text-rose-400">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Add New Client Website</h2>
              <p className="text-xs text-neutral-400">
                Register a new streaming site, store, blog, or SaaS URL
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          {error && (
            <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-800/60 flex items-center gap-2 text-rose-300">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          {/* Site Name & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="font-semibold uppercase tracking-wider text-neutral-400">
                Website Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="e.g. CinePulse or TechStore"
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-3 text-white placeholder-neutral-600 focus:outline-none focus:border-rose-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold uppercase tracking-wider text-neutral-400">
                Website Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as SiteCategory)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-3 text-white focus:outline-none focus:border-rose-500"
              >
                <option value="movie">Movie / Streaming</option>
                <option value="ecommerce">E-Commerce / Store</option>
                <option value="blog">Blog / Editorial / News</option>
                <option value="saas">SaaS / Web App</option>
                <option value="general">General / Landing Page</option>
              </select>
            </div>
          </div>

          {/* Site URL */}
          <div className="space-y-1.5">
            <label className="font-semibold uppercase tracking-wider text-neutral-400">
              Target Website URL *
            </label>
            <input
              type="text"
              required
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="e.g. https://mysite.onrender.com or custom domain"
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-3 text-white font-mono placeholder-neutral-600 focus:outline-none focus:border-rose-500"
            />
            <p className="text-[11px] text-neutral-500">
              The public URL of your static or dynamic frontend website.
            </p>
          </div>

          {/* Identifier / Slug */}
          <div className="space-y-1.5">
            <label className="font-semibold uppercase tracking-wider text-neutral-400">
              Site ID / Slug (API identifier)
            </label>
            <div className="flex items-center gap-2">
              <span className="font-mono text-neutral-500 bg-neutral-950 border border-neutral-800 px-3 py-2.5 rounded-xl">
                /api/config/
              </span>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="mysite"
                className="flex-1 bg-neutral-950 border border-neutral-800 rounded-xl p-2.5 text-white font-mono focus:outline-none focus:border-rose-500"
              />
            </div>
          </div>

          {/* Template / Clone from */}
          <div className="space-y-1.5">
            <label className="font-semibold uppercase tracking-wider text-neutral-400">
              Configuration Preset / Clone From
            </label>
            <select
              value={cloneFrom}
              onChange={(e) => setCloneFrom(e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-rose-500"
            >
              <option value="">Start with clean default template</option>
              {existingSites.map((s) => (
                <option key={s.id} value={s.id}>
                  Clone settings from: {s.name} ({s.id})
                </option>
              ))}
            </select>
          </div>

          {/* Submit buttons */}
          <div className="pt-4 flex items-center justify-end gap-3 border-t border-neutral-800/80">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-750 text-neutral-300 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold flex items-center gap-2 shadow-lg shadow-rose-950/60 transition-all disabled:opacity-50"
            >
              {isSubmitting ? (
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Plus className="w-4 h-4" />
              )}
              <span>{isSubmitting ? 'Creating Site...' : 'Add Website & Open Controls'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
