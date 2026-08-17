'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
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
  Bot, 
  RefreshCw,
  MoreVertical,
  Sliders,
  Calendar as CalendarIcon,
  BookOpen
} from 'lucide-react';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<'today' | 'upcoming'>('today');
  const [loading, setLoading] = useState(true);
  
  // Dynamic metrics & statistics state
  const [channelsCount, setChannelsCount] = useState('0/5');
  const [totalReach, setTotalReach] = useState('0');
  const [engagementRate, setEngagementRate] = useState('0%');
  const [creditsUsed, setCreditsUsed] = useState('0/300');
  const [creditsPercent, setCreditsPercent] = useState('0%');
  
  // Content queues
  const [todayPosts, setTodayPosts] = useState<any[]>([]);
  const [upcomingPosts, setUpcomingPosts] = useState<any[]>([]);
  
  // Analytics chart trend data
  const [trendHistory, setTrendHistory] = useState<any[]>([]);
  const [maxTrendValue, setMaxTrendValue] = useState(100);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // 1. Fetch connected social accounts
      const socialsRes = await fetch('/api/workspaces/socials');
      if (socialsRes.ok) {
        const data = await socialsRes.json();
        const count = data.accounts?.length || 0;
        setChannelsCount(`${count}/5`);
      }

      // 2. Fetch analytics summary
      const analyticsRes = await fetch('/api/analytics');
      if (analyticsRes.ok) {
        const data = await analyticsRes.json();
        
        // Format reach with K/M abbreviations
        const reachVal = data.metrics?.reach || 0;
        if (reachVal >= 1000000) {
          setTotalReach(`${(reachVal / 1000000).toFixed(1)}M`);
        } else if (reachVal >= 1000) {
          setTotalReach(`${(reachVal / 1000).toFixed(1)}K`);
        } else {
          setTotalReach(reachVal.toString());
        }

        // Calculate engagement percentage dynamically
        const impressions = data.metrics?.impressions || 0;
        const clicks = data.metrics?.clicks || 0;
        const likes = data.metrics?.likes || 0;
        const rate = impressions > 0 ? (((clicks + likes) / impressions) * 100).toFixed(1) : '0.0';
        setEngagementRate(`${rate}%`);

        // Load 7-day trend chart history
        const history = data.history || [];
        setTrendHistory(history);
        const maxVal = Math.max(...history.map((h: any) => h.value), 100);
        setMaxTrendValue(maxVal);
      }

      // 3. Fetch scheduled content queue
      const schedulesRes = await fetch('/api/content/schedule');
      if (schedulesRes.ok) {
        const data = await schedulesRes.json();
        const schedules = data.schedules || [];
        
        // Partition queue based on date (Today vs future)
        const today = new Date().toDateString();
        const todayItems: any[] = [];
        const upcomingItems: any[] = [];

        schedules.forEach((item: any) => {
          const schedDate = new Date(item.scheduledAt);
          const platform = item.variant?.platform || 'LinkedIn';
          const timeLabel = schedDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          const dateLabel = schedDate.toLocaleDateString([], { month: 'short', day: 'numeric' });

          const formattedPost = {
            id: item.id,
            platform,
            time: `${dateLabel} ${timeLabel}`,
            text: item.variant?.text || '',
            status: item.status,
            pillar: item.variant?.content?.pillar || 'General',
            error: item.status === 'FAILED' ? 'Publishing connection error. Reconnect channel.' : undefined
          };

          if (schedDate.toDateString() === today) {
            todayItems.push(formattedPost);
          } else {
            upcomingItems.push(formattedPost);
          }
        });

        setTodayPosts(todayItems);
        setUpcomingPosts(upcomingItems);
      }

      // 4. Default billing configuration
      const billingRes = await fetch('/api/billing');
      if (billingRes.ok) {
        const data = await billingRes.json();
        const used = data.creditsUsed || 0;
        const limit = data.creditsLimit || 300;
        setCreditsUsed(`${used}/${limit}`);
        setCreditsPercent(`${Math.round((used / limit) * 100)}%`);
      }
    } catch (e) {
      console.error('Failed to load dashboard metrics:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const stats = [
    { name: 'Total Reach', value: totalReach, change: '+0.0%', up: true, desc: 'vs previous 7 days', icon: Users },
    { name: 'Engagement Rate', value: engagementRate, change: '+0.0%', up: true, desc: 'avg across platforms', icon: TrendingUp },
    { name: 'Active Channels', value: channelsCount, change: 'Connected', up: true, desc: 'API integrations', icon: Layers },
    { name: 'AI Generation Credits', value: creditsUsed, change: `${creditsPercent} Used`, up: false, desc: 'Resets monthly', icon: Bot }
  ];

  // SVG Chart Coordinate Generation
  const generateSvgPoints = () => {
    if (trendHistory.length === 0) return '0,180 500,180';
    return trendHistory.map((h, idx) => {
      const x = (idx / (trendHistory.length - 1)) * 500;
      const y = 180 - (h.value / maxTrendValue) * 140;
      return `${x},${y}`;
    }).join(' ');
  };

  const generateSvgPath = () => {
    const points = generateSvgPoints();
    return `M ${points}`;
  };

  const generateSvgAreaPath = () => {
    const points = generateSvgPoints();
    return `M 0,200 L ${points} L 500,200 Z`;
  };

  return (
    <DashboardShell title="Workspace Overview">
      <div className="space-y-8">
        
        {/* Welcome Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight">Welcome back!</h2>
            <p className="text-xs text-slate-500 font-medium">Here is what is happening with your workspace today.</p>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/dashboard/calendar">
              <Button variant="outline" size="sm" className="gap-1.5 bg-white border-slate-200">
                <CalendarIcon className="w-4 h-4 text-slate-500" />
                <span>View Calendar</span>
              </Button>
            </Link>
            <Link href="/dashboard/create">
              <Button variant="primary" size="sm" className="gap-1.5">
                <Plus className="w-4 h-4" />
                <span>Create Post</span>
              </Button>
            </Link>
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
                    stat.up ? 'text-emerald-600' : 'text-slate-650'
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
          
          {/* Weekly Analytics Chart */}
          <Card hoverEffect={false} className="lg:col-span-2 p-6 border border-slate-200/60 bg-white/70 backdrop-blur-md shadow-xl rounded-2xl flex flex-col justify-between">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-sm font-extrabold text-slate-800 tracking-tight">Weekly Reach Overview</h3>
                <p className="text-2xs text-slate-400 font-semibold mt-0.5">Impressions generated across active platforms</p>
              </div>
              <div className="flex gap-3">
                <span className="inline-flex items-center gap-1.5 text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                  <span className="w-2.5 h-2.5 rounded-full bg-brand-indigo shadow-sm"></span> Impressions
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
                
                {/* Dynamic Reach Area & Line */}
                <path 
                  d={generateSvgAreaPath()} 
                  fill="url(#indigo-grad)" 
                  opacity="0.08"
                />
                <path 
                  d={generateSvgPath()} 
                  fill="none" 
                  stroke="#4f46e5" 
                  strokeWidth="3.5" 
                  strokeLinecap="round"
                />

                {/* Gradients */}
                <defs>
                  <linearGradient id="indigo-grad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#4f46e5" />
                    <stop offset="100%" stopColor="#ffffff" />
                  </linearGradient>
                </defs>
              </svg>

              {/* Chart labels */}
              <div className="flex justify-between text-2xs text-slate-400 font-extrabold mt-4">
                {trendHistory.length > 0 ? (
                  trendHistory.map((h, i) => <span key={i}>{h.date}</span>)
                ) : (
                  <>
                    <span>Day 1</span>
                    <span>Day 2</span>
                    <span>Day 3</span>
                    <span>Day 4</span>
                    <span>Day 5</span>
                    <span>Day 6</span>
                    <span>Day 7</span>
                  </>
                )}
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
                  <h3 className="text-sm font-extrabold text-slate-800 tracking-tight">Strategy Insights</h3>
                  <p className="text-2xs text-slate-400 font-semibold font-mono">Powered by Brand Grounding</p>
                </div>
              </div>
              <hr className="border-slate-100" />
              
              <div className="space-y-5">
                <div className="space-y-2">
                  <h5 className="text-xs font-bold text-slate-705 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-brand-purple animate-pulse" />
                    Interactive Strategy Engine
                  </h5>
                  <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
                    Configure your business profile goals, competitors, and target audience tags. The AI model will parse and generate a content distribution roadmap.
                  </p>
                  <Link href="/dashboard/strategy">
                    <button className="text-2xs font-extrabold text-brand-indigo hover:text-brand-purple flex items-center gap-1 transition-colors cursor-pointer mt-2">
                      Go to Strategy Panel <ArrowUpRight className="w-3 h-3" />
                    </button>
                  </Link>
                </div>
              </div>
            </div>

            <Link href="/dashboard/strategy">
              <Button variant="glass" size="sm" className="w-full mt-6 text-xs gap-1.5 border-slate-200">
                <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
                <span>Configure Strategy</span>
              </Button>
            </Link>
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

            {/* Dynamic queue contents */}
            {loading ? (
              <div className="text-center py-8 text-xs font-mono text-slate-400">Loading queue items...</div>
            ) : (activeTab === 'today' ? todayPosts : upcomingPosts).length === 0 ? (
              <div className="border border-dashed border-slate-200 rounded-2xl p-12 text-center flex flex-col items-center justify-center gap-4">
                <div className="w-12 h-12 rounded-full bg-slate-50 text-slate-400 flex items-center justify-center shadow-inner">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h5 className="text-xs font-bold text-slate-800">Your content queue is empty</h5>
                  <p className="text-2xs text-slate-400 font-medium mt-1">There are no posts scheduled for this window.</p>
                </div>
                <Link href="/dashboard/create">
                  <Button variant="outline" size="sm" className="text-2xs bg-white">
                    Create a Post
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {(activeTab === 'today' ? todayPosts : upcomingPosts).map((post) => {
                  let statusBg = 'bg-slate-100 text-slate-650 border-slate-200';
                  let statusIcon = Clock;
                  if (post.status === 'SUCCESS' || post.status === 'SCHEDULED') {
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

                      <p className="text-xs text-slate-700 leading-relaxed font-semibold">"{post.text}"</p>
                      
                      {post.error && (
                        <div className="flex items-center gap-2 text-2xs font-semibold text-red-600 bg-red-50 p-2.5 rounded-xl border border-red-100">
                          <AlertTriangle className="w-3.5 h-3.5" />
                          <span>{post.error}</span>
                        </div>
                      )}

                      <hr className="border-slate-100" />

                      <div className="flex justify-between items-center text-2xs font-semibold text-slate-500">
                        <span>Pillar: <strong className="text-slate-700 font-bold">{post.pillar}</strong></span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </Card>

          {/* Connected Brand Kit / Memory Overview */}
          <Card className="p-6 border border-slate-200/60 bg-white/70 backdrop-blur-md shadow-xl rounded-2xl flex flex-col justify-between">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-brand-indigo/5 text-brand-indigo flex items-center justify-center">
                    <Sliders className="w-4 h-4" />
                  </div>
                  <h3 className="text-sm font-extrabold text-slate-800 tracking-tight">Brand Profile</h3>
                </div>
                <Link href="/dashboard/settings">
                  <button className="text-2xs font-extrabold text-brand-indigo hover:text-brand-purple cursor-pointer">
                    Edit Profile
                  </button>
                </Link>
              </div>
              <hr className="border-slate-100" />

              <div className="space-y-4 text-xs font-semibold text-slate-600">
                <div className="flex justify-between">
                  <span className="text-slate-400">Owner</span>
                  <span className="text-slate-700 font-bold">Akhil Makwana</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Plan level</span>
                  <span className="text-slate-700 font-bold">Free Plan</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Database Engine</span>
                  <span className="text-slate-700 font-bold">Neon PostgreSQL</span>
                </div>
              </div>
            </div>

            <div className="mt-8 border border-brand-indigo/10 rounded-2xl bg-brand-indigo/5 p-4 space-y-2">
              <h5 className="text-[10px] font-extrabold text-brand-indigo uppercase tracking-wider">Database Status</h5>
              <p className="text-xs text-slate-600 italic">"Connected dynamically. All workspace parameters and audit logs map directly to production tables."</p>
            </div>
          </Card>

        </div>

      </div>
    </DashboardShell>
  );
}
