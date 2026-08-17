'use client';

import React, { useState } from 'react';
import { 
  Sparkles, 
  Send, 
  Bot, 
  RefreshCw, 
  Save, 
  PenSquare, 
  Eye, 
  CheckCircle, 
  AlertTriangle,
  HelpCircle
} from 'lucide-react';
import { Linkedin, Instagram, Facebook, Twitter } from '@/components/icons/SocialIcons';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function CreateContentPage() {
  const [topic, setTopic] = useState('');
  const [platform, setPlatform] = useState('LINKEDIN');
  const [goal, setGoal] = useState('');
  const [tone, setTone] = useState('');
  
  const [generating, setGenerating] = useState(false);
  const [generatedText, setGeneratedText] = useState('');
  const [saving, setSaving] = useState(false);
  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setGenerating(true);
    setError('');
    setSuccess('');

    try {
      const res = await fetch('/api/ai/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, platform, goal, tone }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to generate content');

      setGeneratedText(data.text);
    } catch (err: any) {
      setError(err.message || 'Failed to communicate with AI endpoint.');
    } finally {
      setGenerating(false);
    }
  };

  const handleSaveDraft = async () => {
    if (!generatedText) return;
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const res = await fetch('/api/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'POST',
          status: 'DRAFT',
          goal: goal || 'Content Marketing',
          pillar: topic,
          platform,
          text: generatedText
        }),
      });

      if (!res.ok) throw new Error('Failed to save draft content.');

      setSuccess('Post draft successfully staged and added to content calendar!');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  // Mock post render details based on selected platform
  const renderPlatformHeader = () => {
    if (platform === 'LINKEDIN') {
      return (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-700 text-xs shadow-inner">JD</div>
          <div>
            <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1">John Doe <span className="text-[10px] text-slate-400 font-normal">• 1st</span></h4>
            <p className="text-[10px] text-slate-400 font-semibold leading-none">Specialty Coffee Specialist • 2h</p>
          </div>
        </div>
      );
    }
    if (platform === 'INSTAGRAM') {
      return (
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600 p-0.5 shadow-sm">
            <div className="w-full h-full rounded-full bg-white flex items-center justify-center font-extrabold text-[9px] text-slate-700 shadow-inner">JD</div>
          </div>
          <h4 className="text-xs font-extrabold text-slate-800">john_doe_coffee</h4>
        </div>
      );
    }
    return (
      <div className="flex items-center gap-2.5">
        <div className="w-7.5 h-7.5 rounded-full bg-brand-indigo/10 flex items-center justify-center font-extrabold text-xs text-brand-indigo shadow-inner">JD</div>
        <h4 className="text-xs font-bold text-slate-800">Acme Coffee Downtown</h4>
      </div>
    );
  };

  return (
    <DashboardShell title="AI Content Editor">
      <div className="space-y-8">
        
        {/* Banner */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white/40 p-5 rounded-2xl border border-slate-200/50 backdrop-blur-md">
          <div className="space-y-1">
            <h2 className="text-sm font-extrabold text-slate-800 tracking-tight flex items-center gap-1.5">
              <Sparkles className="w-4.5 h-4.5 text-brand-indigo animate-float" />
              <span>AI Content Composer Engine</span>
            </h2>
            <p className="text-xs text-slate-500">Draft, optimize, and preview multi-channel social copy grounded in your Brand Kit.</p>
          </div>
        </div>

        {/* Form Grid */}
        <div className="grid lg:grid-cols-12 gap-8">
          
          {/* Inputs Form */}
          <div className="lg:col-span-5">
            <Card hoverEffect={false} className="border border-slate-200/60 bg-white/70 backdrop-blur-md shadow-xl p-6 rounded-2xl space-y-5">
              <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100">
                <div className="w-8 h-8 rounded-xl bg-brand-indigo/10 text-brand-indigo flex items-center justify-center shadow-sm">
                  <PenSquare className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-extrabold text-slate-800 tracking-tight">Generation Prompts</h3>
              </div>

              {error && (
                <div className="flex items-start gap-2.5 p-3.5 bg-red-50 border border-red-200/50 text-red-800 rounded-xl text-xs font-medium">
                  <AlertTriangle className="w-4.5 h-4.5 text-red-500 flex-shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleGenerate} className="space-y-5 text-xs">
                
                {/* Topic */}
                <div className="space-y-2">
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">Topic / Pillar</span>
                  <Input 
                    placeholder="e.g. 5 tips for scaling coffee grind ratio"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    required
                  />
                </div>

                {/* Platform */}
                <div className="space-y-2">
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">Target Channel</span>
                  <select 
                    value={platform}
                    onChange={(e) => setPlatform(e.target.value)}
                    className="flex h-10 w-full rounded-xl border border-slate-200 bg-white/50 px-3 py-2 text-xs font-semibold text-slate-700 focus:border-brand-indigo/60 focus:bg-white focus:outline-none focus:ring-4 focus:ring-brand-indigo/5 transition-all cursor-pointer"
                  >
                    <option value="LINKEDIN">LinkedIn Post</option>
                    <option value="INSTAGRAM">Instagram Caption</option>
                    <option value="FACEBOOK">Facebook Feed Update</option>
                    <option value="TWITTER">Twitter/X Thread</option>
                  </select>
                </div>

                {/* Goal */}
                <div className="space-y-2">
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">Goal Override</span>
                  <Input 
                    placeholder="e.g. Boost organic website visits"
                    value={goal}
                    onChange={(e) => setGoal(e.target.value)}
                  />
                </div>

                {/* Tone Override */}
                <div className="space-y-2">
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">Custom Tone</span>
                  <Input 
                    placeholder="e.g. Energetic yet highly informative"
                    value={tone}
                    onChange={(e) => setTone(e.target.value)}
                  />
                </div>

                {/* Action */}
                <div className="pt-3">
                  <Button type="submit" disabled={generating} className="w-full gap-2">
                    {generating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Bot className="w-4 h-4" />}
                    <span>{generating ? 'Generating Draft...' : 'Generate with Brand Memory'}</span>
                  </Button>
                </div>

              </form>
            </Card>
          </div>

          {/* Editor & Live Preview Panel */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* Editor Card */}
            <Card hoverEffect={false} className="border border-slate-200/60 bg-white/70 backdrop-blur-md shadow-xl p-6 rounded-2xl space-y-5">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-brand-purple/10 text-brand-purple flex items-center justify-center shadow-sm">
                    <PenSquare className="w-4 h-4" />
                  </div>
                  <h3 className="text-sm font-extrabold text-slate-800 tracking-tight">Post Editor</h3>
                </div>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Draft Output</span>
              </div>

              {success && (
                <div className="flex items-center gap-2.5 p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold">
                  <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                  <span>{success}</span>
                </div>
              )}

              <div className="space-y-4">
                <textarea 
                  className="w-full h-64 text-slate-800 bg-slate-50/50 border border-slate-200 focus:border-brand-indigo/60 focus:bg-white rounded-xl text-sm p-4 focus:outline-none focus:ring-4 focus:ring-brand-indigo/5 transition-all font-medium leading-relaxed"
                  placeholder="Generated caption output will appear here. You can refine and customize the copy before scheduling..."
                  value={generatedText}
                  onChange={(e) => setGeneratedText(e.target.value)}
                  disabled={generating}
                />

                <div className="flex justify-end gap-3 pt-2">
                  <Button 
                    variant="outline" 
                    onClick={handleSaveDraft}
                    disabled={!generatedText || saving || generating}
                    className="gap-2 bg-white"
                  >
                    {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    <span>Save Draft to Queue</span>
                  </Button>
                </div>
              </div>
            </Card>

            {/* Live Feed Preview simulation */}
            {generatedText && (
              <Card hoverEffect={false} className="border border-slate-200/50 bg-slate-50/40 p-6 rounded-2xl space-y-4 shadow-sm animate-float">
                <div className="flex items-center justify-between">
                  <h4 className="text-2xs font-extrabold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                    <Eye className="w-3.5 h-3.5" />
                    <span>Real-time Feed Preview ({platform})</span>
                  </h4>
                </div>
                
                <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs space-y-3.5">
                  {renderPlatformHeader()}
                  <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-wrap font-medium">
                    {generatedText}
                  </p>
                  {platform === 'INSTAGRAM' && (
                    <div className="h-64 w-full bg-slate-100 rounded-lg flex items-center justify-center border border-slate-200/50">
                      <Instagram className="w-10 h-10 text-slate-400" />
                    </div>
                  )}
                  {platform === 'LINKEDIN' && (
                    <div className="flex justify-between items-center text-[10px] text-slate-400 font-bold border-t border-slate-100 pt-3">
                      <span>Like</span>
                      <span>Comment</span>
                      <span>Repost</span>
                      <span>Send</span>
                    </div>
                  )}
                </div>
              </Card>
            )}

          </div>

        </div>

      </div>
    </DashboardShell>
  );
}
