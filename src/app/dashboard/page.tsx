'use client';

import React, { useState } from 'react';
import { 
  Sparkles, 
  TrendingUp, 
  Users, 
  Layers, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  ArrowUpRight, 
  Plus, 
  Send, 
  BookOpen, 
  Bot, 
  RefreshCw,
  MoreVertical,
  Sliders,
  Calendar as CalendarIcon
} from 'lucide-react';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<'today' | 'upcoming'>('today');

  const stats = [
    { name: 'Total Reach', value: '24.8K', change: '+12.4%', up: true, desc: 'vs previous 7 days', icon: Users },
    { name: 'Engagement Rate', value: '5.2%', change: '+0.8%', up: true, desc: 'avg across platforms', icon: TrendingUp },
    { name: 'Active Channels', value: '3/5', change: 'Healthy', up: true, desc: 'API connections', icon: Layers },
    { name: 'AI Generation Credits', value: '142/300', change: '47% Used', up: false, desc: 'Resets in 12 days', icon: Bot }
  ];

  const todayPosts = [
    {
      id: 'post-1',
      platform: 'LinkedIn',
      time: '10:00 AM (Scheduled)',
      text: 'Creating high-performing marketing channels doesn’t require a massive budget. It requires daily consistency. Here are three simple frameworks our agency uses... 📚',
      status: 'APPROVED',
      pillar: 'Educational',
      likes: 24,
      clicks: 8
    },
    {
      id: 'post-2',
      platform: 'Instagram',
      time: '02:30 PM (Draft)',
      text: 'Behind the scenes at Acme Co! ☕ Staging our new product shoot. What do you think of the new design? Drop a comment below!',
      status: 'REVIEW',
      pillar: 'Brand Storytelling',
      likes: 0,
      clicks: 0
    },
    {
      id: 'post-3',
      platform: 'Facebook',
      time: 'Yesterday 05:00 PM (Failed)',
      text: 'Special weekend flash sale! 🎉 20% off all orders using code FLASH20. In-store and online. Limited slots available.',
      status: 'FAILED',
      error: 'Token expired. Reconnect social account.',
      pillar: 'Promotional',
      likes: 0,
      clicks: 0
    }
  ];

  const upcomingPosts = [
    {
      id: 'post-4',
      platform: 'LinkedIn',
      time: 'Tomorrow 09:00 AM',
      text: 'Consistency beats talent when talent doesn’t show up. Keep writing, designing, and optimizing. The compound effect is real.',
      status: 'SCHEDULED',
      pillar: 'Inspirational'
    },
    {
      id: 'post-5',
      platform: 'Instagram',
      time: 'Aug 18, 04:00 PM',
      text: 'Weekly round-up! 🌟 A summary of the top stories in marketing and AI. Which trends are you jumping on?',
      status: 'APPROVED',
      pillar: 'Educational'
    }
  ];

  const aiInsights = [
    {
      title: 'High-Performing Topic Hook',
      desc: 'Your posts referencing "frameworks" get 42% higher click-through-rates. We generated two new drafts in your calendar queue.',
      action: 'View Drafts'
    },
    {
      title: 'Time Window Optimization',
      desc: 'LinkedIn engagement peaks at 9:00 AM EST for your network. Auto-Pilot has adjusted your scheduling windows automatically.',
      action: 'Configure Windows'
    }
  ];

  return (
    <DashboardShell title="Workspace Overview">
      <div className="space-y-8">
        
        {/* Welcome Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight">Welcome back, John!</h2>
            <p className="text-xs text-slate-500 font-medium">Here is what is happening with Acme Coffee Shop today.</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-1.5 bg-white border-slate-200">
              <CalendarIcon className="w-4 h-4 text-slate-500" />
              <span>Aug 16, 2026</span>
            </Button>
            <Button variant="primary" size="sm" className="gap-1.5">
              <Plus className="w-4 h-4" />
              <span>Generate Ideas</span>
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.name} hoverEffect className="p-6 border border-slate-200/60 bg-white/70 backdrop-blur-md shadow-xl rounded-2xl flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">{stat.name}</span>
                  <div className="w-9 h-9 rounded-xl bg-brand-indigo/5 text-brand-indigo flex items-center justify-center">
                    <Icon className="w-4 h-4" />
                  </div>
                </div>
                <div className="mt-4 flex items-baseline gap-2">
                  <span className="text-2xl font-extrabold text-slate-900 tracking-tight">{stat.value}</span>
                  <span className={`text-xs font-bold flex items-center ${
                    stat.up ? 'text-emerald-600' : 'text-slate-600'
                  }`}>
                    {stat.change}
                  </span>
                </div>
                <p className="text-2xs text-slate-450 font-medium mt-1.5">{stat.desc}</p>
              </Card>
            );
          })}
        </div>

        {/* Charts & AI Recommendations */}
        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Mock Weekly Analytics Chart */}
          <Card hoverEffect={false} className="lg:col-span-2 p-6 border border-slate-200/60 bg-white/70 backdrop-blur-md shadow-xl rounded-2xl flex flex-col justify-between">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-sm font-extrabold text-slate-800 tracking-tight">Weekly Reach Overview</h3>
                <p className="text-2xs text-slate-400 font-semibold mt-0.5">Impressions generated across active platforms</p>
              </div>
              <div className="flex gap-3">
                <span className="inline-flex items-center gap-1.5 text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                  <span className="w-2.5 h-2.5 rounded-full bg-brand-indigo shadow-sm"></span> LinkedIn
                </span>
                <span className="inline-flex items-center gap-1.5 text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                  <span className="w-2.5 h-2.5 rounded-full bg-brand-pink shadow-sm"></span> Instagram
                </span>
              </div>
            </div>

            {/* Custom SVG Line Chart with Grid & Gradients */}
            <div className="h-60 w-full relative pt-2">
              <svg className="w-full h-full" viewBox="0 0 500 200" preserveAspectRatio="none">
                {/* Horizontal Grid lines */}
                <line x1="0" y1="40" x2="500" y2="40" stroke="#f1f5f9" strokeWidth="1" />
                <line x1="0" y1="90" x2="500" y2="90" stroke="#f1f5f9" strokeWidth="1" />
                <line x1="0" y1="140" x2="500" y2="140" stroke="#f1f5f9" strokeWidth="1" />
                
                {/* LinkedIn Area & Line */}
                <path 
                  d="M0,170 Q75,130 150,145 T300,90 T450,70 L500,70 L500,200 L0,200 Z" 
                  fill="url(#indigo-grad)" 
                  opacity="0.08"
                />
                <path 
                  d="M0,170 Q75,130 150,145 T300,90 T450,70 L500,70" 
                  fill="none" 
                  stroke="#4f46e5" 
                  strokeWidth="3.5" 
                  strokeLinecap="round"
                />

                {/* Instagram Area & Line */}
                <path 
                  d="M0,190 Q75,160 150,115 T300,105 T450,95 L500,95 L500,200 L0,200 Z" 
                  fill="url(#pink-grad)" 
                  opacity="0.05"
                />
                <path 
                  d="M0,190 Q75,160 150,115 T300,105 T450,95 L500,95" 
                  fill="none" 
                  stroke="#ec4899" 
                  strokeWidth="3" 
                  strokeLinecap="round" 
                  strokeDasharray="4 4"
                />

                {/* Gradients */}
                <defs>
                  <linearGradient id="indigo-grad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#4f46e5" />
                    <stop offset="100%" stopColor="#ffffff" />
                  </linearGradient>
                  <linearGradient id="pink-grad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#ec4899" />
                    <stop offset="100%" stopColor="#ffffff" />
                  </linearGradient>
                </defs>
              </svg>

              {/* Chart labels */}
              <div className="flex justify-between text-2xs text-slate-400 font-extrabold mt-4">
                <span>Mon</span>
                <span>Tue</span>
                <span>Wed</span>
                <span>Thu</span>
                <span>Fri</span>
                <span>Sat</span>
                <span>Sun</span>
              </div>
            </div>
          </Card>

          {/* AI Insights & Recommendations */}
          <Card className="p-6 border border-slate-200/60 bg-white/70 backdrop-blur-md shadow-xl rounded-2xl flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-brand-purple flex items-center justify-center shadow-sm">
                  <Bot className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-slate-800 tracking-tight">Auto-Pilot Insights</h3>
                  <p className="text-2xs text-slate-400 font-semibold font-mono">Powered by Brand Grounding</p>
                </div>
              </div>
              <hr className="border-slate-100" />
              
              <div className="space-y-5">
                {aiInsights.map((insight, idx) => (
                  <div key={idx} className="space-y-2">
                    <h5 className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-brand-purple" />
                      {insight.title}
                    </h5>
                    <p className="text-[11px] text-slate-500 leading-relaxed font-medium">{insight.desc}</p>
                    <button className="text-2xs font-extrabold text-brand-indigo hover:text-brand-purple flex items-center gap-1 transition-colors cursor-pointer">
                      {insight.action} <ArrowUpRight className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <Button variant="glass" size="sm" className="w-full mt-6 text-xs gap-1.5 border-slate-200">
              <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
              <span>Update Strategy</span>
            </Button>
          </Card>

        </div>

        {/* Content Queue Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Post Queue Selector & Actions */}
          <Card className="lg:col-span-2 p-6 border border-slate-200/60 bg-white/70 backdrop-blur-md shadow-xl rounded-2xl space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h3 className="text-base font-extrabold text-slate-800 tracking-tight">Content Queue</h3>
                <p className="text-2xs text-slate-400 font-semibold mt-0.5">Staged updates waiting for publishing or approval</p>
              </div>
              <div className="inline-flex rounded-xl bg-slate-100 p-1 border border-slate-200/60">
                <button
                  onClick={() => setActiveTab('today')}
                  className={`px-3 py-1.5 text-2xs font-extrabold rounded-lg transition-colors cursor-pointer ${
                    activeTab === 'today' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  Today's Scheduled ({todayPosts.length})
                </button>
                <button
                  onClick={() => setActiveTab('upcoming')}
                  className={`px-3 py-1.5 text-2xs font-extrabold rounded-lg transition-colors cursor-pointer ${
                    activeTab === 'upcoming' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  Upcoming ({upcomingPosts.length})
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {(activeTab === 'today' ? todayPosts : upcomingPosts).map((post) => {
                
                // Set Status Colors
                let statusBg = 'bg-slate-100 text-slate-650 border-slate-200';
                let statusIcon = Clock;
                if (post.status === 'APPROVED' || post.status === 'SCHEDULED') {
                  statusBg = 'bg-emerald-50 text-emerald-700 border-emerald-100';
                  statusIcon = CheckCircle2;
                } else if (post.status === 'FAILED') {
                  statusBg = 'bg-red-50 text-red-700 border-red-100';
                  statusIcon = XCircle;
                } else if (post.status === 'REVIEW') {
                  statusBg = 'bg-amber-50 text-amber-700 border-amber-100';
                  statusIcon = AlertTriangle;
                }
                const StatusIcon = statusIcon;

                return (
                  <div key={post.id} className="border border-slate-150 rounded-2xl bg-white p-5 space-y-3 hover:shadow-md transition-shadow">
                    
                    {/* Header */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="px-2.5 py-1 rounded-xl bg-slate-100 text-xs font-bold text-slate-700">
                          {post.platform}
                        </span>
                        <span className="text-2xs text-slate-400 font-semibold">{post.time}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border ${statusBg}`}>
                          <StatusIcon className="w-3 h-3" />
                          {post.status}
                        </span>
                        <button className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg cursor-pointer">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Post Text */}
                    <p className="text-xs text-slate-700 leading-relaxed font-semibold">"{post.text}"</p>
                    
                    {/* Error Notice */}
                    {'error' in post && post.error && (
                      <div className="flex items-center gap-2 text-2xs font-semibold text-red-600 bg-red-50 p-2.5 rounded-xl border border-red-100">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        <span>{post.error}</span>
                      </div>
                    )}

                    <hr className="border-slate-100" />

                    {/* Actions & Metrics */}
                    <div className="flex justify-between items-center text-2xs font-semibold text-slate-500">
                      <span>Pillar: <strong className="text-slate-700 font-bold">{post.pillar}</strong></span>
                      
                      <div className="flex items-center gap-4">
                        {post.status === 'REVIEW' && (
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" className="px-3 py-1 text-[10px]">
                              Reject
                            </Button>
                            <Button variant="primary" size="sm" className="px-3 py-1 text-[10px]">
                              Approve
                            </Button>
                          </div>
                        )}
                        {post.status === 'FAILED' && (
                          <Button variant="primary" size="sm" className="px-3 py-1 text-[10px]">
                            Reconnect & Retry
                          </Button>
                        )}
                        {post.status === 'APPROVED' && (
                          <span className="text-emerald-600 flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Ready to publish
                          </span>
                        )}
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>
          </Card>

          {/* Connected Brand Kit / Memory Overview */}
          <Card className="p-6 border border-slate-200/60 bg-white/70 backdrop-blur-md shadow-xl rounded-2xl flex flex-col justify-between">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-brand-indigo/5 text-brand-indigo flex items-center justify-center">
                    <Sliders className="w-4 h-4" />
                  </div>
                  <h3 className="text-sm font-extrabold text-slate-800 tracking-tight">Brand Kit</h3>
                </div>
                <button className="text-2xs font-extrabold text-brand-indigo hover:text-brand-purple cursor-pointer">
                  Edit Profile
                </button>
              </div>
              <hr className="border-slate-100" />

              <div className="space-y-4 text-xs font-semibold text-slate-600">
                <div className="flex justify-between">
                  <span className="text-slate-400">Industry</span>
                  <span className="text-slate-700 font-bold">Specialty Coffee Retail</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Primary Tone</span>
                  <span className="text-slate-700 font-bold">Warm, Energetic, Friendly</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Target Audience</span>
                  <span className="text-slate-700 font-bold">Local creators, Remote Workers</span>
                </div>
                
                {/* Brand Colors */}
                <div className="space-y-2 pt-2">
                  <span className="text-slate-400 block mb-1">Theme Palette</span>
                  <div className="flex gap-1.5">
                    <span className="w-6 h-6 rounded-full border border-slate-200" style={{ backgroundColor: '#4f46e5' }} title="#4f46e5"></span>
                    <span className="w-6 h-6 rounded-full border border-slate-200" style={{ backgroundColor: '#9333ea' }} title="#9333ea"></span>
                    <span className="w-6 h-6 rounded-full border border-slate-200" style={{ backgroundColor: '#f8fafc' }} title="#f8fafc"></span>
                    <span className="w-6 h-6 rounded-full border border-slate-200" style={{ backgroundColor: '#0f172a' }} title="#0f172a"></span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 border border-brand-indigo/10 rounded-2xl bg-brand-indigo/5 p-4 space-y-2">
              <h5 className="text-[10px] font-extrabold text-brand-indigo uppercase tracking-wider">Default Call To Action</h5>
              <p className="text-xs text-slate-600 italic">"Order coffee online for curbside pickup in 10 minutes or visit our downtown roastery."</p>
            </div>
          </Card>

        </div>

      </div>
    </DashboardShell>
  );
}
