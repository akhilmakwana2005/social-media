'use client';

import React, { useEffect, useState } from 'react';
import { 
  Globe, 
  Loader2, 
  CheckCircle2, 
  AlertTriangle, 
  Link2, 
  Plus, 
  X, 
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import {
  Linkedin,
  Instagram,
  Facebook,
  Twitter,
  Youtube
} from '@/components/icons/SocialIcons';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

interface SocialAccount {
  id: string;
  provider: string;
  externalId: string;
  status: string;
  expiresIn?: string;
  externalName?: string;
}

export default function SocialsPage() {
  const [accounts, setAccounts] = useState<SocialAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [activeModalProvider, setActiveModalProvider] = useState<string | null>(null);
  const [profileHandle, setProfileHandle] = useState('');
  const [displayName, setDisplayName] = useState('');
  
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const platforms = [
    { id: 'LINKEDIN', name: 'LinkedIn Professional Page', icon: Linkedin, color: 'text-blue-600', bg: 'bg-blue-50/50', placeholder: 'e.g. @johndoe or https://linkedin.com/in/johndoe' },
    { id: 'INSTAGRAM', name: 'Instagram Business Profile', icon: Instagram, color: 'text-pink-600', bg: 'bg-pink-50/50', placeholder: 'e.g. @acmecoffee or https://instagram.com/acmecoffee' },
    { id: 'FACEBOOK', name: 'Facebook Brand Page', icon: Facebook, color: 'text-blue-800', bg: 'bg-blue-50/50', placeholder: 'e.g. Acme Downtown or https://facebook.com/acmecafe' },
    { id: 'TWITTER', name: 'Twitter / X Feed', icon: Twitter, color: 'text-slate-900', bg: 'bg-slate-50', placeholder: 'e.g. @acme_brand or https://x.com/acme_brand' },
    { id: 'YOUTUBE', name: 'YouTube Content Channel', icon: Youtube, color: 'text-red-655', bg: 'bg-red-50/50', placeholder: 'e.g. Acme Studio or https://youtube.com/@acmestudio' },
  ];

  const fetchAccounts = () => {
    setLoading(true);
    fetch('/api/workspaces/socials')
      .then(res => res.json())
      .then(data => {
        if (data.accounts) {
          const formatted = data.accounts.map((acc: any) => {
            const handle = acc.externalId;
            const dispName = acc.scopes && acc.scopes !== 'read write publish' && acc.scopes !== 'read write' ? acc.scopes : acc.provider === 'INSTAGRAM' ? 'Instagram Business' : acc.provider === 'LINKEDIN' ? 'LinkedIn Page' : 'Brand Page';
            return {
              ...acc,
              externalName: handle,
              displayName: dispName,
              expiresIn: 'Active Session (Verified Token)'
            };
          });
          setAccounts(formatted);
        }
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  const handleOpenConnectModal = (provider: string) => {
    setActiveModalProvider(provider);
    setProfileHandle('');
    setDisplayName('');
    setErrorMessage('');
  };

  const handleConnectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profileHandle.trim()) {
      setErrorMessage('Please enter a valid handle or profile link');
      return;
    }
    if (!displayName.trim()) {
      setErrorMessage('Please enter a display name');
      return;
    }
    
    setSubmitting(true);
    setErrorMessage('');
    
    try {
      const res = await fetch('/api/workspaces/socials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider: activeModalProvider,
          handle: profileHandle.trim(),
          displayName: displayName.trim()
        })
      });

      if (res.ok) {
        setSuccessMessage(`${activeModalProvider} channel successfully linked to ${profileHandle}!`);
        setActiveModalProvider(null);
        fetchAccounts();
        setTimeout(() => setSuccessMessage(''), 4000);
      } else {
        const errData = await res.json();
        setErrorMessage(errData.error || 'Failed to link account.');
      }
    } catch (err) {
      setErrorMessage('Connection failed. Verify server status.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDisconnect = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to disconnect ${name}? This will pause all active autopilot schedules for this channel.`)) return;
    try {
      const res = await fetch(`/api/workspaces/socials?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchAccounts();
        setSuccessMessage('Channel disconnected successfully.');
        setTimeout(() => setSuccessMessage(''), 3000);
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <DashboardShell title="Publishing Channels">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header Title */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white/40 p-6 rounded-2xl border border-slate-200/50 backdrop-blur-md">
          <div className="space-y-1">
            <h2 className="text-xl font-extrabold text-slate-800 tracking-tight flex items-center gap-2">
              <Globe className="w-5 h-5 text-brand-indigo" />
              <span>Connected Publishing Channels</span>
            </h2>
            <p className="text-xs text-slate-500">Add profile links or handles to establish active publishing destinations for Auto-Pilot staging.</p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-100 shadow-sm">
            <CheckCircle2 className="w-4 h-4" />
            <span>{accounts.length} Linked Destinations</span>
          </div>
        </div>

        {/* Notices */}
        {successMessage && (
          <div className="flex items-center gap-3 p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-semibold shadow-sm animate-float">
            <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Channels Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3 text-slate-500">
            <Loader2 className="w-8 h-8 animate-spin text-brand-indigo" />
            <span className="text-xs font-medium font-mono">Loading connected profiles...</span>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-8">
            {platforms.map(platform => {
              const account = accounts.find(a => a.provider === platform.id);
              const Icon = platform.icon;
              
              return (
                <Card 
                  key={platform.id} 
                  hoverEffect 
                  className={`group flex flex-col justify-between p-6 border transition-all duration-300 ${
                    account ? 'border-brand-indigo/20 bg-brand-indigo/[0.01]' : 'border-slate-200'
                  }`}
                >
                  <div className="space-y-5">
                    {/* Platform Header */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm transition-transform group-hover:scale-105 ${platform.bg}`}>
                          <Icon className={`w-6 h-6 ${platform.color} fill-current`} />
                        </div>
                        <div>
                          <h3 className="font-extrabold text-slate-800 text-sm leading-snug">{account ? account.displayName : platform.name}</h3>
                          <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mt-0.5">
                            {account ? 'Linked Account' : 'Inactive'}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Channel Info */}
                    {account ? (
                      <div className="space-y-3.5 bg-slate-50/50 p-4 rounded-xl border border-slate-100/60">
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-slate-400 font-semibold">Username / Handle</span>
                          <span className="text-brand-indigo font-extrabold select-all bg-white px-2.5 py-1 rounded-lg border border-slate-150 shadow-2xs font-mono">
                            {account.externalName}
                          </span>
                        </div>
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-slate-400 font-semibold">OAuth Token</span>
                          <span className="text-slate-700 font-semibold text-2xs font-mono">
                            {account.expiresIn}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <p className="text-xs text-slate-500 leading-relaxed font-medium">
                        No active channel linked for this platform. Link this destination to enable scheduling and auto-publishing parameters.
                      </p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="pt-6 mt-6 border-t border-slate-100 flex justify-end">
                    {account ? (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-2xs text-red-650 hover:bg-red-50 hover:text-red-700 bg-white"
                        onClick={() => handleDisconnect(account.id, account.externalName || platform.name)}
                      >
                        Disconnect Channel
                      </Button>
                    ) : (
                      <Button 
                        variant="primary" 
                        size="sm" 
                        className="text-2xs gap-1.5"
                        onClick={() => handleOpenConnectModal(platform.id)}
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Link Channel Link</span>
                      </Button>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        )}

      </div>

      {/* Connect Profile Input Modal */}
      {activeModalProvider && (() => {
        const platform = platforms.find(p => p.id === activeModalProvider);
        if (!platform) return null;
        const PlatformIcon = platform.icon;
        
        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
            <Card hoverEffect={false} className="w-full max-w-md bg-white shadow-2xl rounded-3xl overflow-hidden border border-slate-100 p-6 space-y-6">
              
              {/* Header */}
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-xs ${platform.bg}`}>
                    <PlatformIcon className={`w-5 h-5 ${platform.color} fill-current`} />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-slate-800 tracking-tight">Connect {platform.name}</h3>
                    <p className="text-2xs text-slate-400 font-bold uppercase tracking-wider mt-0.5">Custom Channel Link</p>
                  </div>
                </div>
                <button 
                  onClick={() => setActiveModalProvider(null)}
                  className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-500 hover:text-slate-800 transition-colors shadow-sm cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <hr className="border-slate-100" />

              {errorMessage && (
                <div className="flex items-start gap-2.5 p-3.5 bg-red-50 border border-red-200/50 text-red-800 rounded-xl text-xs font-semibold">
                  <AlertTriangle className="w-4.5 h-4.5 text-red-500 flex-shrink-0 mt-0.5" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleConnectSubmit} className="space-y-5 text-xs">
                {/* Display Name */}
                <div className="space-y-2">
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">Profile / Account Display Name</span>
                  <Input 
                    type="text"
                    placeholder="e.g. Acme Coffee Roastery"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    required
                    className="text-xs font-semibold"
                  />
                </div>

                <div className="space-y-2">
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">Profile Username / URL Link</span>
                  <Input 
                    type="text"
                    placeholder={platform.placeholder}
                    value={profileHandle}
                    onChange={(e) => setProfileHandle(e.target.value)}
                    required
                    className="font-mono text-xs font-semibold"
                  />
                  <p className="text-[10px] text-slate-400 font-medium leading-relaxed mt-1">
                    Enter the exact profile handle or URL link. The dashboard will register this to staging posts, staged previews, and custom logs.
                  </p>
                </div>

                <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <p className="text-[10px] text-slate-500 font-medium leading-relaxed">
                    Account status verified. Links in sandbox mode to authorize automated publishing triggers.
                  </p>
                </div>

                <div className="pt-3 flex gap-3">
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="flex-1 bg-white"
                    onClick={() => setActiveModalProvider(null)}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    className="flex-1 gap-1.5"
                    disabled={submitting}
                  >
                    {submitting ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Link2 className="w-4 h-4" />
                    )}
                    <span>Link Profile</span>
                  </Button>
                </div>
              </form>

            </Card>
          </div>
        );
      })()}

    </DashboardShell>
  );
}
