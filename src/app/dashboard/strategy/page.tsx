'use client';

import React, { useState, useEffect } from 'react';
import { 
  Compass, 
  Sparkles, 
  Lock, 
  Unlock, 
  RefreshCw, 
  Check, 
  Edit3, 
  Sliders, 
  Calendar as CalendarIcon, 
  BookOpen, 
  PieChart, 
  ArrowUpRight, 
  ChevronRight, 
  Lightbulb, 
  Plus, 
  PlusCircle, 
  Trash2 
} from 'lucide-react';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

interface Pillar {
  id: string;
  title: string;
  desc: string;
  ratio: number;
  platforms: string[];
  formats: string[];
}

interface ProposalDay {
  day: string;
  pillar: string;
  topic: string;
  cta: string;
  platform: string;
}

export default function AIStrategy() {
  // Page states
  const [version, setVersion] = useState('1.2');
  const [status, setStatus] = useState<'Active' | 'Draft' | 'Generating'>('Active');
  const [isEditingContext, setIsEditingContext] = useState(false);
  const [lockedPillars, setLockedPillars] = useState<Set<string>>(new Set(['pillar-1']));

  // Context input states
  const [industry, setIndustry] = useState('Specialty Coffee Retail');
  const [audience, setAudience] = useState('Local remote workers, creators, and coffee enthusiasts aged 22-45 who value organic single-origin beans.');
  const [goals, setGoals] = useState('Increase local foot traffic, grow online subscription sales, and build a community around craftsmanship.');
  const [voice, setVoice] = useState('Warm, educational, energetic, friendly');

  useEffect(() => {
    fetch('/api/workspaces/strategy')
      .then(res => res.json())
      .then(data => {
        if (data.strategy) {
          const bp = data.strategy.businessProfile;
          const bk = data.strategy.brandKit;
          if (bp) {
            setIndustry(bp.industry || 'Specialty Coffee Retail');
            setAudience(bp.audience || '');
            setGoals(bp.goals || '');
          }
          if (bk) {
            setVoice(bk.tone || 'Warm, educational, energetic, friendly');
          }
        }
      })
      .catch(err => console.error('Failed to load strategy details', err));
  }, []);

  const handleToggleEdit = async () => {
    if (isEditingContext) {
      try {
        await fetch('/api/workspaces/onboarding', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            industry,
            location: 'Roastery HQ',
            services: 'Premium Sourcing & Roasting',
            audience,
            goals
          })
        });

        await fetch('/api/workspaces/brand', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            colors: '#4f46e5,#9333ea,#f8fafc,#0f172a',
            tone: voice,
            logoUrl: null,
            cta: 'Learn more about specialty bean subscription',
            restrictions: null
          })
        });
      } catch (e) {
        console.error('Failed to save grounding settings', e);
      }
    }
    setIsEditingContext(!isEditingContext);
  };

  // Pillars list
  const [pillars, setPillars] = useState<Pillar[]>([
    {
      id: 'pillar-1',
      title: 'Craftsmanship & Roasting',
      desc: 'Showcasing the meticulous roasting process, sourcing stories from farms, and coffee chemistry. Explains the "why" behind premium coffee.',
      ratio: 40,
      platforms: ['LinkedIn', 'Instagram'],
      formats: ['Reels', 'Carousels', 'Long-form Posts']
    },
    {
      id: 'pillar-2',
      title: 'Workcafe Culture',
      desc: 'Highlighting local creators working in-store, co-working facilities, daily aesthetic vlogs, and community events.',
      ratio: 30,
      platforms: ['Instagram', 'TikTok'],
      formats: ['Short Video Reels', 'Stories']
    },
    {
      id: 'pillar-3',
      title: 'Promotional Offers & Beans',
      desc: 'Direct subscription discounts, menu launches, flash bundle deals, and product showcases of newly imported single-origin bags.',
      ratio: 30,
      platforms: ['Facebook', 'Instagram', 'LinkedIn'],
      formats: ['Single Image Updates', 'Promo Carousels']
    }
  ]);

  // Calendar Proposal list
  const [proposalDays, setProposalDays] = useState<ProposalDay[]>([
    {
      day: 'Monday',
      pillar: 'Craftsmanship & Roasting',
      topic: 'Explain how coffee bean density affects the final flavor notes. Hook: "Why your coffee tastes sour, not sweet."',
      cta: 'Explore single-origin coffee subscription',
      platform: 'LinkedIn'
    },
    {
      day: 'Wednesday',
      pillar: 'Workcafe Culture',
      topic: 'Vibe check! A fast-paced aesthetic Reel of creators coding in our downtown cafe with ambient background lo-fi.',
      cta: 'Visit our roastery downtown',
      platform: 'Instagram'
    },
    {
      day: 'Friday',
      pillar: 'Promotional Offers & Beans',
      topic: 'Announcing our weekend bundle: Buy 2 bags of Ethiopia Yirgacheffe, get a custom canvas tote bag free.',
      cta: 'Use code WEEKENDTOTE at checkout',
      platform: 'Instagram'
    }
  ]);

  // Lock toggler
  const toggleLock = (id: string) => {
    const nextLocks = new Set(lockedPillars);
    if (nextLocks.has(id)) {
      nextLocks.delete(id);
    } else {
      nextLocks.add(id);
    }
    setLockedPillars(nextLocks);
  };

  // Strategy regeneration simulator
  const handleRegenerate = () => {
    setStatus('Generating');
    setTimeout(() => {
      // Keep locked, update unlocked
      setPillars(prev => prev.map(p => {
        if (lockedPillars.has(p.id)) return p;
        if (p.id === 'pillar-2') {
          return {
            ...p,
            title: 'Community Roastery Stories',
            desc: 'Interviews with our head roaster, stories behind our farmers in Colombia, and direct-trade transparency transparency disclosures.'
          };
        }
        if (p.id === 'pillar-3') {
          return {
            ...p,
            title: 'Coffee Ritual Hacks',
            desc: 'Step-by-step guides for pour-over, french press, and espresso techniques at home using our custom roasts.'
          };
        }
        return p;
      }));

      // Update proposal days for the unlocked themes
      setProposalDays(prev => prev.map(d => {
        if (d.day === 'Wednesday') {
          return {
            ...d,
            pillar: 'Community Roastery Stories',
            topic: 'Roaster Q&A: Why light roasts retain more antioxidants and caffeine than dark roasts.',
            cta: 'Subscribe to our YouTube channel'
          };
        }
        if (d.day === 'Friday') {
          return {
            ...d,
            pillar: 'Coffee Ritual Hacks',
            topic: 'The golden ratio: How to scale your grind sizes for a perfect v60 extraction at home.',
            cta: 'Get our free Brew Guide PDF'
          };
        }
        return d;
      }));

      const newVersion = (parseFloat(version) + 0.1).toFixed(1);
      setVersion(newVersion);
      setStatus('Active');
    }, 2000);
  };

  return (
    <DashboardShell title="AI Strategy Engine">
      <div className="space-y-8">
        
        {/* Page Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white/40 p-5 rounded-2xl border border-slate-200/50 backdrop-blur-md">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-brand-indigo/10 text-brand-indigo text-xs font-bold border border-brand-indigo/20">
                Strategy v{version}
              </span>
              <span className={`w-2 h-2 rounded-full ${status === 'Generating' ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'}`}></span>
              <span className="text-2xs text-slate-500 font-semibold uppercase tracking-wider">
                {status === 'Generating' ? 'Regenerating...' : 'Active & Synced'}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">Generated and optimized based on your latest business grounding guidelines.</p>
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto">
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1 md:flex-none gap-2 bg-white"
              onClick={handleRegenerate}
              disabled={status === 'Generating'}
            >
              <RefreshCw className={`w-4 h-4 text-slate-500 ${status === 'Generating' ? 'animate-spin' : ''}`} />
              <span>Regenerate Unlocked</span>
            </Button>
            <Button 
              variant="primary" 
              size="sm" 
              className="flex-1 md:flex-none gap-1.5"
              disabled={status === 'Generating'}
            >
              <Check className="w-4 h-4" />
              <span>Apply Strategy</span>
            </Button>
          </div>
        </div>

        {/* main grid */}
        <div className="grid lg:grid-cols-12 gap-8">
          
          {/* Left panel: Business inputs & posting mix (4cols) */}
          <div className="lg:col-span-4 space-y-8">
            
            <Card hoverEffect={false} className="space-y-6 border border-slate-200/60 bg-white/70 backdrop-blur-md shadow-xl p-6 rounded-2xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-brand-indigo/10 text-brand-indigo flex items-center justify-center shadow-sm">
                    <Sliders className="w-4 h-4" />
                  </div>
                  <h3 className="text-sm font-extrabold text-slate-800 tracking-tight">Business Grounding</h3>
                </div>
                <Button 
                  variant={isEditingContext ? 'primary' : 'outline'}
                  size="sm"
                  className="h-8 px-3 text-xs gap-1.5 rounded-lg active:scale-95 shadow-sm font-bold"
                  onClick={() => setIsEditingContext(!isEditingContext)}
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>{isEditingContext ? 'Save Rules' : 'Edit Inputs'}</span>
                </Button>
              </div>
              <hr className="border-slate-100/80" />

              <div className="space-y-6 text-xs">
                
                {/* Industry */}
                <div className="space-y-2">
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">Industry</span>
                  {isEditingContext ? (
                    <Input value={industry} onChange={(e) => setIndustry(e.target.value)} />
                  ) : (
                    <div className="relative pl-3 border-l-2 border-brand-indigo">
                      <p className="text-slate-700 font-bold text-xs leading-relaxed">{industry}</p>
                    </div>
                  )}
                </div>

                {/* Target Audience */}
                <div className="space-y-2">
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">Target Audience</span>
                  {isEditingContext ? (
                    <textarea 
                      className="w-full text-slate-800 bg-slate-50/50 border border-slate-200 focus:border-brand-indigo/60 focus:bg-white rounded-xl text-sm p-3 focus:outline-none focus:ring-4 focus:ring-brand-indigo/5 transition-all"
                      rows={3}
                      value={audience} 
                      onChange={(e) => setAudience(e.target.value)} 
                    />
                  ) : (
                    <div className="relative pl-3 border-l-2 border-brand-purple">
                      <p className="text-slate-600 leading-relaxed font-medium text-xs">{audience}</p>
                    </div>
                  )}
                </div>

                {/* Business Goals */}
                <div className="space-y-2">
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">Primary Goals</span>
                  {isEditingContext ? (
                    <textarea 
                      className="w-full text-slate-800 bg-slate-50/50 border border-slate-200 focus:border-brand-indigo/60 focus:bg-white rounded-xl text-sm p-3 focus:outline-none focus:ring-4 focus:ring-brand-indigo/5 transition-all"
                      rows={3}
                      value={goals} 
                      onChange={(e) => setGoals(e.target.value)} 
                    />
                  ) : (
                    <div className="relative pl-3 border-l-2 border-brand-pink">
                      <p className="text-slate-600 leading-relaxed font-medium text-xs">{goals}</p>
                    </div>
                  )}
                </div>

                {/* Brand Voice */}
                <div className="space-y-2">
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">Brand Voice / Tone</span>
                  {isEditingContext ? (
                    <Input value={voice} onChange={(e) => setVoice(e.target.value)} />
                  ) : (
                    <div className="flex flex-wrap gap-2 pt-1">
                      {voice.split(',').map((tag) => (
                        <span 
                          key={tag} 
                          className="px-3 py-1.5 rounded-full bg-gradient-to-r from-brand-indigo/5 to-brand-purple/5 text-brand-indigo font-bold text-[10px] uppercase tracking-wider border border-brand-indigo/10 transition-all hover:scale-105 shadow-[0_2px_8px_rgba(79,70,229,0.03)] cursor-default"
                        >
                          {tag.trim()}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

              </div>
            </Card>

            {/* Content Ratio Donut Map */}
            <Card hoverEffect={false} className="space-y-6 border border-slate-200/60 bg-white/70 backdrop-blur-md shadow-xl p-6 rounded-2xl">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-brand-purple/10 text-brand-purple flex items-center justify-center shadow-sm">
                  <PieChart className="w-4.5 h-4.5" />
                </div>
                <h3 className="text-sm font-extrabold text-slate-800 tracking-tight">Content Distribution Mix</h3>
              </div>
              <hr className="border-slate-100/80" />

              <div className="space-y-5">
                {pillars.map((pillar, idx) => {
                  const barGradients = [
                    'from-brand-indigo to-brand-purple',
                    'from-brand-purple to-brand-pink',
                    'from-brand-pink to-orange-400'
                  ];
                  const badgeColors = [
                    'text-brand-indigo bg-brand-indigo/10 border-brand-indigo/10',
                    'text-brand-purple bg-brand-purple/10 border-brand-purple/10',
                    'text-brand-pink bg-brand-pink/10 border-brand-pink/10'
                  ];
                  return (
                    <div key={pillar.id} className="space-y-2 group">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-bold text-slate-700 group-hover:text-brand-indigo transition-colors duration-200">
                          {pillar.title}
                        </span>
                        <span className={`px-2 py-0.5 rounded-lg text-2xs font-extrabold border shadow-sm ${badgeColors[idx % 3]}`}>
                          {pillar.ratio}%
                        </span>
                      </div>
                      <div className="h-3.5 w-full rounded-full bg-slate-100/80 p-0.5 border border-slate-200/40 shadow-[inset_0_1px_2px_rgba(0,0,0,0.03)] overflow-hidden">
                        <div 
                          className={`h-full rounded-full bg-gradient-to-r ${barGradients[idx % 3]} transition-all duration-700 ease-out shadow-sm`}
                          style={{ width: `${pillar.ratio}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>

          </div>

          {/* Right panel: Content Pillars & Calendar Proposal (8cols) */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Content Pillars Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-extrabold text-slate-800 tracking-tight">AI Generated Content Pillars</h3>
                <span className="text-2xs text-slate-400 font-semibold uppercase tracking-wider">Locked pillars are preserved</span>
              </div>

              {/* Pillars list */}
              <div className="grid sm:grid-cols-3 gap-6">
                {pillars.map((pillar) => {
                  const isLocked = lockedPillars.has(pillar.id);
                  return (
                    <Card key={pillar.id} hoverEffect className={`flex flex-col justify-between p-5 space-y-4 ${
                      isLocked ? 'border-brand-indigo/30 bg-brand-indigo/[0.01]' : 'border-slate-200'
                    }`}>
                      <div className="space-y-3">
                        <div className="flex justify-between items-start">
                          <h4 className="text-xs font-bold text-slate-800 leading-tight min-h-[32px]">{pillar.title}</h4>
                          <button 
                            onClick={() => toggleLock(pillar.id)}
                            className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                              isLocked 
                                ? 'bg-brand-indigo/10 text-brand-indigo border-brand-indigo/20' 
                                : 'bg-slate-50 text-slate-400 border-slate-200 hover:text-slate-700'
                            }`}
                            title={isLocked ? 'Unlock pillar' : 'Lock pillar'}
                          >
                            {isLocked ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                        <p className="text-[11px] text-slate-500 leading-relaxed min-h-[72px]">{pillar.desc}</p>
                      </div>

                      <div className="space-y-2 pt-2 border-t border-slate-50">
                        <div className="flex flex-wrap gap-1">
                          {pillar.platforms.map((platform) => (
                            <span key={platform} className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px] font-bold">
                              {platform}
                            </span>
                          ))}
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </div>

            {/* Calendar blueprint proposal */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-extrabold text-slate-800 tracking-tight">Weekly Strategy Calendar Blueprint</h3>
                  <p className="text-2xs text-slate-400 font-semibold mt-0.5">Proposed day schedule to achieve content mix target</p>
                </div>
                <Button variant="outline" size="sm" className="gap-1.5 bg-white border-slate-200 text-xs py-1.5">
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Proposal Day</span>
                </Button>
              </div>

              {/* Day slots list */}
              <div className="space-y-4">
                {proposalDays.map((dayObj) => (
                  <div key={dayObj.day} className="border border-slate-200/80 rounded-2xl bg-white p-5 space-y-3 hover:shadow-md transition-shadow">
                    
                    {/* Header */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="w-20 font-extrabold text-slate-800 text-xs">{dayObj.day}</span>
                        <span className="px-2.5 py-0.5 rounded-full bg-brand-indigo/10 text-brand-indigo text-[10px] font-extrabold border border-brand-indigo/20">
                          {dayObj.pillar}
                        </span>
                      </div>
                      <span className="px-2 py-0.5 rounded bg-slate-150 text-slate-600 text-[10px] font-extrabold">
                        {dayObj.platform}
                      </span>
                    </div>

                    {/* Topic content proposal */}
                    <div className="space-y-2">
                      <p className="text-xs text-slate-600 leading-relaxed font-medium">
                        {dayObj.topic}
                      </p>
                      <p className="text-[11px] text-slate-400 italic">
                        Call to Action: "{dayObj.cta}"
                      </p>
                    </div>

                    <hr className="border-slate-50" />

                    {/* Action buttons */}
                    <div className="flex justify-end gap-2 text-2xs font-bold">
                      <Button variant="outline" size="sm" className="px-3.5 py-1.5 text-[10px] bg-white border-slate-200">
                        Edit Blueprint
                      </Button>
                      <Button variant="primary" size="sm" className="px-3.5 py-1.5 text-[10px] gap-1">
                        <span>Draft Post</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </Button>
                    </div>

                  </div>
                ))}
              </div>
            </div>

            {/* Growth experiments suggestions */}
            <Card hoverEffect={false} className="p-5 space-y-4 bg-brand-indigo/[0.02] border-brand-indigo/10">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-brand-indigo/10 text-brand-indigo flex items-center justify-center">
                  <Lightbulb className="w-4.5 h-4.5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-800">Weekly Growth Experiment Suggested</h4>
                  <p className="text-[10px] text-slate-500 font-medium mt-0.5">Calculated based on positive reach shifts in Specialty Coffee retail</p>
                </div>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Try posting a **"LinkedIn Document Carousel"** highlighting Direct Trade bean origins. Document posts currently have a **45% higher save rate** and yield longer screen duration compared to raw link updates.
              </p>
              <div className="flex justify-end pt-1">
                <Button variant="primary" size="sm" className="text-xs gap-1 py-1.5 px-4.5">
                  <PlusCircle className="w-4 h-4" />
                  <span>Accept & Generate Draft</span>
                </Button>
              </div>
            </Card>

          </div>

        </div>

      </div>
    </DashboardShell>
  );
}
