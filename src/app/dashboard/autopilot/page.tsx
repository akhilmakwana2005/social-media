'use client';

import React, { useEffect, useState } from 'react';
import { 
  Cpu, 
  Save, 
  Loader2, 
  CheckCircle, 
  AlertTriangle,
  Play,
  Pause,
  Plus,
  Trash2,
  Calendar,
  Clock,
  Sparkles,
  Link as LinkIcon
} from 'lucide-react';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

interface AutomationLog {
  id: string;
  time: string;
  action: string;
  status: 'SUCCESS' | 'WARNING' | 'DRAFT_STAGED';
}

export default function AutopilotPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isSystemActive, setIsSystemActive] = useState(true);
  
  // Form states
  const [mode, setMode] = useState<'APPROVAL_REQUIRED' | 'AUTO_PUBLISH'>('APPROVAL_REQUIRED');
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(['LINKEDIN', 'INSTAGRAM']);
  const [frequency, setFrequency] = useState(3);
  const [timeSlots, setTimeSlots] = useState<string[]>(['09:00', '15:00', '19:30']);
  const [newTime, setNewTime] = useState('');

  // Dynamic database logs
  const [logs, setLogs] = useState<AutomationLog[]>([]);

  const availablePlatforms = [
    { key: 'LINKEDIN', name: 'LinkedIn' },
    { key: 'INSTAGRAM', name: 'Instagram' },
    { key: 'FACEBOOK', name: 'Facebook' },
    { key: 'TWITTER', name: 'Twitter' },
    { key: 'YOUTUBE', name: 'YouTube' }
  ];

  useEffect(() => {
    fetch('/api/workspaces/automation')
      .then(res => res.json())
      .then(data => {
        if (data.rule) {
          setMode(data.rule.mode);
          if (data.rule.platforms) {
            setSelectedPlatforms(data.rule.platforms.split(','));
          }
          setFrequency(data.rule.frequency);
          try {
            const parsed = JSON.parse(data.rule.windows);
            if (Array.isArray(parsed)) setTimeSlots(parsed);
          } catch (e) {
            // Use defaults if parse fails
          }
        }
        if (data.logs) {
          setLogs(data.logs);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = {
        mode,
        platforms: selectedPlatforms.join(','),
        frequency,
        windows: JSON.stringify(timeSlots)
      };
      
      const res = await fetch('/api/workspaces/automation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        alert('Auto-Pilot settings saved successfully!');
        // Refresh the logs immediately from the DB to show the "SAVE_RULES" entry
        const updatedRes = await fetch('/api/workspaces/automation');
        if (updatedRes.ok) {
          const updatedData = await updatedRes.json();
          if (updatedData.logs) {
            setLogs(updatedData.logs);
          }
        }
      } else {
        alert('Failed to save settings.');
      }
    } catch (e) {
      alert('Failed to save settings.');
    } finally {
      setSaving(false);
    }
  };

  const togglePlatform = (key: string) => {
    if (selectedPlatforms.includes(key)) {
      setSelectedPlatforms(selectedPlatforms.filter(p => p !== key));
    } else {
      setSelectedPlatforms([...selectedPlatforms, key]);
    }
  };

  const addTimeSlot = () => {
    if (!newTime) return;
    if (timeSlots.includes(newTime)) return;
    setTimeSlots([...timeSlots, newTime].sort());
    setNewTime('');
  };

  const deleteTimeSlot = (time: string) => {
    setTimeSlots(timeSlots.filter(t => t !== time));
  };

  return (
    <DashboardShell title="Auto-Pilot Configuration">
      <div className="space-y-8">
        
        {/* Banner with system activity toggler */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white/40 p-5 rounded-2xl border border-slate-200/50 backdrop-blur-md">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <span className="w-8 h-8 rounded-xl bg-brand-indigo/10 text-brand-indigo flex items-center justify-center shadow-sm">
                <Cpu className="w-4.5 h-4.5" />
              </span>
              <div>
                <h2 className="text-sm font-extrabold text-slate-800 tracking-tight flex items-center gap-2">
                  <span>Auto-Pilot Scheduler Engine</span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold border ${
                    isSystemActive ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-slate-100 text-slate-500 border-slate-200'
                  }`}>
                    {isSystemActive ? 'Active' : 'Paused'}
                  </span>
                </h2>
              </div>
            </div>
            <p className="text-xs text-slate-500 mt-1">Configure publishing rules, connected channels, and optimal distribution times.</p>
          </div>
          
          <Button 
            variant={isSystemActive ? 'outline' : 'primary'}
            size="sm" 
            className="w-full md:w-auto gap-2 bg-white"
            onClick={() => setIsSystemActive(!isSystemActive)}
          >
            {isSystemActive ? (
              <>
                <Pause className="w-4 h-4 text-slate-600" />
                <span>Pause Auto-Pilot</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 text-white fill-current" />
                <span>Resume Scheduler</span>
              </>
            )}
          </Button>
        </div>

        {loading ? (
          <div className="text-center py-12 text-slate-500 font-semibold flex items-center justify-center gap-2">
            <Loader2 className="w-5 h-5 animate-spin text-brand-indigo" />
            <span>Loading settings...</span>
          </div>
        ) : (
          <div className="grid lg:grid-cols-12 gap-8">
            
            {/* Left: Configuration form (7 cols) */}
            <div className="lg:col-span-7 space-y-8">
              
              <Card hoverEffect={false} className="border border-slate-200/60 bg-white/70 backdrop-blur-md shadow-xl p-6 rounded-2xl space-y-6">
                
                {/* 1. Automation Mode Cards */}
                <div className="space-y-3">
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">Automation Mode</span>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {/* Draft Mode Card */}
                    <button 
                      onClick={() => setMode('APPROVAL_REQUIRED')}
                      className={`p-4 rounded-xl border text-left space-y-2 transition-all duration-200 focus:outline-none cursor-pointer ${
                        mode === 'APPROVAL_REQUIRED'
                          ? 'border-brand-indigo bg-brand-indigo/[0.02] ring-2 ring-brand-indigo/10 shadow-sm'
                          : 'border-slate-200 bg-white/50 hover:bg-white hover:border-slate-350'
                      }`}
                    >
                      <h4 className="text-xs font-bold text-slate-800">Drafts Only (Approval Required)</h4>
                      <p className="text-[11px] text-slate-500 leading-relaxed">
                        AI generates post drafts and schedules them. Nothing is published until you manually approve it.
                      </p>
                    </button>
                    
                    {/* Direct Publish Card */}
                    <button 
                      onClick={() => setMode('AUTO_PUBLISH')}
                      className={`p-4 rounded-xl border text-left space-y-2 transition-all duration-200 focus:outline-none cursor-pointer ${
                        mode === 'AUTO_PUBLISH'
                          ? 'border-brand-indigo bg-brand-indigo/[0.02] ring-2 ring-brand-indigo/10 shadow-sm'
                          : 'border-slate-200 bg-white/50 hover:bg-white hover:border-slate-350'
                      }`}
                    >
                      <h4 className="text-xs font-bold text-slate-800">Auto-Publish (Fully Autonomous)</h4>
                      <p className="text-[11px] text-slate-500 leading-relaxed">
                        AI generates, schedules, and posts directly to connected social accounts. No manual work.
                      </p>
                    </button>
                  </div>
                </div>

                {/* 2. Target Channels */}
                <div className="space-y-3">
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">Target Channels</span>
                  <div className="flex flex-wrap gap-2.5">
                    {availablePlatforms.map((plat) => {
                      const isSelected = selectedPlatforms.includes(plat.key);
                      return (
                        <button
                          key={plat.key}
                          onClick={() => togglePlatform(plat.key)}
                          className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all duration-200 cursor-pointer ${
                            isSelected
                              ? 'bg-brand-indigo/10 text-brand-indigo border-brand-indigo/35 shadow-sm scale-102'
                              : 'bg-slate-50 text-slate-550 border-slate-200 hover:bg-slate-100/60'
                          }`}
                        >
                          {plat.name}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 3. Frequency & Density */}
                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">Weekly Density</span>
                    <Input 
                      type="number" 
                      value={frequency} 
                      onChange={(e) => setFrequency(parseInt(e.target.value) || 1)}
                      min={1} 
                      max={14}
                      label="Posts per week"
                    />
                  </div>

                  {/* 4. Scheduling Windows */}
                  <div className="space-y-2">
                    <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">Add Posting Slot</span>
                    <div className="flex gap-2 items-center pt-2">
                      <input 
                        type="time" 
                        className="px-4 py-2.5 bg-slate-50/50 border border-slate-200 focus:border-brand-indigo/60 focus:bg-white rounded-xl text-sm text-slate-800 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-brand-indigo/5 placeholder:text-slate-400 flex-1"
                        value={newTime}
                        onChange={(e) => setNewTime(e.target.value)}
                      />
                      <Button variant="outline" size="sm" onClick={addTimeSlot} className="h-10 bg-white">
                        <Plus className="w-4 h-4 text-slate-600" />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Active time slots list */}
                <div className="space-y-3 pt-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Configured Slots</span>
                  {timeSlots.length === 0 ? (
                    <p className="text-2xs text-slate-400 italic">No posting time slots set. Add one above.</p>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {timeSlots.map((time) => (
                        <div 
                          key={time} 
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-50 border border-slate-200 text-xs font-bold text-slate-600 shadow-sm transition-all hover:border-red-200"
                        >
                          <Clock className="w-3.5 h-3.5 text-slate-450" />
                          <span>{time}</span>
                          <button 
                            onClick={() => deleteTimeSlot(time)}
                            className="p-0.5 rounded text-slate-400 hover:text-red-500 cursor-pointer"
                          >
                            &times;
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Form Footer */}
                <div className="pt-5 border-t border-slate-100 flex justify-end">
                  <Button onClick={handleSave} disabled={saving} className="gap-2">
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    <span>Save Auto-Pilot Rules</span>
                  </Button>
                </div>

              </Card>

            </div>

            {/* Right: Activity Log & Overview (5 cols) */}
            <div className="lg:col-span-5 space-y-8">
              
              {/* Auto-Pilot log summary */}
              <Card hoverEffect={false} className="border border-slate-200/60 bg-white/70 backdrop-blur-md shadow-xl p-6 rounded-2xl space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-brand-indigo/10 text-brand-indigo flex items-center justify-center shadow-sm">
                      <Calendar className="w-4.5 h-4.5" />
                    </div>
                    <h3 className="text-sm font-extrabold text-slate-800 tracking-tight">Auto-Pilot Logs</h3>
                  </div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Recent Runs</span>
                </div>
                <hr className="border-slate-100/80" />

                <div className="space-y-4">
                  {logs.map((log) => {
                    let statusBg = 'bg-slate-100 text-slate-600 border-slate-200';
                    if (log.status === 'SUCCESS') statusBg = 'bg-emerald-50 text-emerald-700 border-emerald-100';
                    else if (log.status === 'WARNING') statusBg = 'bg-amber-50 text-amber-600 border-amber-100';
                    else if (log.status === 'DRAFT_STAGED') statusBg = 'bg-brand-indigo/5 text-brand-indigo border-brand-indigo/10';

                    return (
                      <div key={log.id} className="border border-slate-100 rounded-xl p-3.5 bg-slate-50/50 space-y-2 text-xs">
                        <div className="flex justify-between items-center">
                          <span className="text-slate-400 font-semibold text-2xs">{log.time}</span>
                          <span className={`px-2 py-0.5 rounded text-[9px] font-extrabold border ${statusBg}`}>
                            {log.status.replace('_', ' ')}
                          </span>
                        </div>
                        <p className="text-slate-700 leading-relaxed text-xs font-semibold">{log.action}</p>
                      </div>
                    );
                  })}
                </div>
              </Card>

              {/* Dynamic recommendation card */}
              <Card hoverEffect={false} className="border border-brand-indigo/10 bg-brand-indigo/[0.01] p-5 space-y-3.5 rounded-2xl">
                <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-brand-indigo animate-float" />
                  <span>Optimal Schedule Suggestion</span>
                </h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Based on target coffee enthusiast demographics, we recommend scheduling 1 window on Saturday mornings (09:00 AM) to capture high-traffic weekend café reviews.
                </p>
                <div className="flex justify-end pt-1">
                  <button 
                    onClick={() => {
                      if (!timeSlots.includes('09:00')) {
                        setTimeSlots([...timeSlots, '09:00'].sort());
                        alert('Added Saturday morning slot! Click Save Settings to persist.');
                      }
                    }}
                    className="text-2xs font-extrabold text-brand-indigo hover:text-brand-purple flex items-center gap-1 cursor-pointer"
                  >
                    <span>Apply Recommendation</span>
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </Card>

            </div>

          </div>
        )}
      </div>
    </DashboardShell>
  );
}
