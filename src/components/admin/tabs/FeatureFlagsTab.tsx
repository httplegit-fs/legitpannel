import React, { useState } from 'react';
import { Sliders, ToggleLeft, ToggleRight, Plus, Trash2, Key, Info, CheckCircle2 } from 'lucide-react';
import { FeatureFlagsConfig } from '../../../types/admin';

interface FeatureFlagsTabProps {
  flags: FeatureFlagsConfig;
  onChange: (updated: FeatureFlagsConfig) => void;
}

export const FeatureFlagsTab: React.FC<FeatureFlagsTabProps> = ({ flags, onChange }) => {
  const [newKey, setNewKey] = useState('');
  const [newValue, setNewValue] = useState('');
  const [newDesc, setNewDesc] = useState('');

  const toggleFlag = (flagName: keyof Omit<FeatureFlagsConfig, 'customVariables'>) => {
    onChange({
      ...flags,
      [flagName]: !flags[flagName],
    });
  };

  const handleAddVariable = () => {
    if (!newKey.trim()) return;
    const cleanKey = newKey.trim().toLowerCase().replace(/[^a-z0-9_]/g, '_');
    const existing = flags.customVariables || [];
    const updated = [
      ...existing.filter((v) => v.key !== cleanKey),
      { key: cleanKey, value: newValue.trim(), description: newDesc.trim() || 'Custom remote variable' },
    ];
    onChange({ ...flags, customVariables: updated });
    setNewKey('');
    setNewValue('');
    setNewDesc('');
  };

  const handleRemoveVariable = (keyToRemove: string) => {
    onChange({
      ...flags,
      customVariables: (flags.customVariables || []).filter((v) => v.key !== keyToRemove),
    });
  };

  const standardSwitches = [
    {
      id: 'enableRegistration' as const,
      title: 'User Registration & Signups',
      desc: 'Allow new visitors to create accounts or register profiles.',
    },
    {
      id: 'enableComments' as const,
      title: 'Comments & User Discussions',
      desc: 'Enable community comment threads and rating reviews.',
    },
    {
      id: 'enableSearch' as const,
      title: 'Global Search Engine',
      desc: 'Provide top-level search input for movies, products, or posts.',
    },
    {
      id: 'enableLiveChat' as const,
      title: 'Live Chat Support Widget',
      desc: 'Activate floating customer support widget.',
    },
    {
      id: 'enableNewsletterPopup' as const,
      title: 'Lead Capture & Newsletter Modal',
      desc: 'Display email newsletter signup popup to first-time visitors.',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Intro Header */}
      <div className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-600/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
            <Sliders className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-white">
              Universal Remote Feature Flags & Dynamic Variables
            </h2>
            <p className="text-xs text-neutral-400 leading-relaxed max-w-2xl mt-1">
              Toggle frontend features on or off in real-time across your websites without altering code or re-deploying servers. Define custom key-value variables that your frontend apps fetch dynamically.
            </p>
          </div>
        </div>
      </div>

      {/* Standard Feature Toggles */}
      <div className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-6 space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Sliders className="w-4 h-4 text-amber-400" />
          Global Feature Toggles
        </h3>

        <div className="divide-y divide-neutral-800/80 text-xs">
          {standardSwitches.map((item) => {
            const isEnabled = Boolean(flags[item.id]);
            return (
              <div key={item.id} className="py-3.5 flex items-center justify-between gap-4">
                <div>
                  <h4 className="font-semibold text-white">{item.title}</h4>
                  <p className="text-neutral-400 text-[11px] mt-0.5">{item.desc}</p>
                </div>

                <button
                  onClick={() => toggleFlag(item.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 ${
                    isEnabled
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950/40'
                      : 'bg-neutral-800 text-neutral-400 hover:text-white'
                  }`}
                >
                  {isEnabled ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
                  <span>{isEnabled ? 'ENABLED' : 'DISABLED'}</span>
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Dynamic Key-Value Custom Variables Engine */}
      <div className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-6 space-y-4 text-xs">
        <div>
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Key className="w-4 h-4 text-amber-400" />
            Dynamic Remote Variables (Key-Value Store)
          </h3>
          <p className="text-neutral-400 text-[11px] mt-0.5">
            Store any custom parameters (e.g. <code>contact_whatsapp</code>, <code>coupon_code</code>, <code>discord_invite</code>) that client sites can fetch dynamically.
          </p>
        </div>

        {/* Existing Variables List */}
        <div className="space-y-2">
          {(flags.customVariables || []).map((v) => (
            <div
              key={v.key}
              className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
            >
              <div className="overflow-hidden">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-amber-400">{v.key}</span>
                  <span className="text-neutral-500">=</span>
                  <span className="font-mono text-white truncate max-w-md">"{v.value}"</span>
                </div>
                {v.description && (
                  <p className="text-[11px] text-neutral-500 mt-0.5">{v.description}</p>
                )}
              </div>

              <button
                onClick={() => handleRemoveVariable(v.key)}
                className="p-1.5 text-neutral-500 hover:text-rose-400 rounded-lg hover:bg-neutral-900 transition-colors self-end sm:self-auto shrink-0"
                title="Remove variable"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        {/* Add New Variable Form */}
        <div className="pt-4 border-t border-neutral-800/80 space-y-3">
          <span className="font-semibold text-white uppercase text-[10px] tracking-wider block">
            Add New Remote Variable
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            <input
              type="text"
              value={newKey}
              onChange={(e) => setNewKey(e.target.value)}
              placeholder="Variable Key (e.g. support_phone)"
              className="bg-neutral-950 border border-neutral-800 rounded-xl p-2.5 text-white font-mono focus:outline-none focus:border-amber-500"
            />
            <input
              type="text"
              value={newValue}
              onChange={(e) => setNewValue(e.target.value)}
              placeholder="Value (e.g. +1234567890)"
              className="bg-neutral-950 border border-neutral-800 rounded-xl p-2.5 text-white font-mono focus:outline-none focus:border-amber-500"
            />
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                placeholder="Description"
                className="flex-1 bg-neutral-950 border border-neutral-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-amber-500"
              />
              <button
                type="button"
                onClick={handleAddVariable}
                disabled={!newKey.trim()}
                className="px-3.5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold flex items-center gap-1 transition-colors disabled:opacity-40 shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Add</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
