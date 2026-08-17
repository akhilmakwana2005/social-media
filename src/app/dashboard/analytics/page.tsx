'use client';

import React, { useEffect, useState } from 'react';
import { 
  BarChart3, 
  Users, 
  Eye, 
  ThumbsUp, 
  MessageCircle, 
  Share2, 
  MousePointerClick, 
  Sparkles, 
  TrendingUp, 
  Filter, 
  ChevronRight,
  TrendingDown
} from 'lucide-react';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

interface AnalyticsMetric {
  impressions: number;
  reach: number;
  likes: number;
  comments: number;
  shares: number;
  clicks: number;
}

interface TopPost {
  id: string;
  platform: string;
  text: string;
  publishedAt: string;
  impressions: number;
  likes: number;
  comments: number;
  shares: number;
  clicks: number;
}

interface HistoryTrend {
  date: string;
  value: number;
}

export default function AnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState<AnalyticsMetric>({
    impressions: 0,
    reach: 0,
    likes: 0,
    comments: 0,
    shares: 0,
    clicks: 0
  });
  const [topPosts, setTopPosts] = useState<TopPost[]>([]);
  const [history, setHistory] = useState<HistoryTrend[]>([]);
  const [selectedPlatform, setSelectedPlatform] = useState<string>('ALL');

  useEffect(() => {
    fetch('/api/analytics')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setMetrics(data.metrics);
          setTopPosts(data.topPosts);
          setHistory(data.history);
        }
      })
      .catch(err => console.error('Failed to load analytics', err))
      .finally(() => setLoading(false));
  }, []);

  // Filter posts based on selected platform
  const filteredPosts = selectedPlatform === 'ALL' 
    ? topPosts 
    : topPosts.filter(p => p.platform.toUpperCase() === selectedPlatform);

  // Dynamically calculate metrics based on filter selection
  const filteredMetrics = selectedPlatform === 'ALL' 
    ? metrics 
    : filteredPosts.reduce((acc, p) => {
        acc.impressions += p.impressions;
        acc.reach += Math.round(p.impressions * 0.75); // derived reach ratio
        acc.likes += p.likes;
        acc.comments += p.comments;
        acc.shares += p.shares;
        acc.clicks += p.clicks;
        return acc;
      }, { impressions: 0, reach: 0, likes: 0, comments: 0, shares: 0, clicks: 0 });

  // Calculate Dynamic Engagement Rate: (Engagement / Impressions) * 100
  const totalEngagement = filteredMetrics.likes + filteredMetrics.comments + filteredMetrics.shares + filteredMetrics.clicks;
  const engagementRate = filteredMetrics.impressions > 0 
    ? ((totalEngagement / filteredMetrics.impressions) * 100).toFixed(2)
    : '0.00';

  const statCards = [
    { title: 'Total Impressions', value: filteredMetrics.impressions, icon: Eye, color: 'bg-blue-500/10 text-blue-600', desc: 'Content views generated' },
    { title: 'Unique Reach', value: filteredMetrics.reach, icon: Users, color: 'bg-indigo-500/10 text-brand-indigo', desc: 'Distinct accounts reached' },
    { title: 'Engagement Rate', value: `${engagementRate}%`, icon: TrendingUp, color: 'bg-purple-500/10 text-brand-purple', desc: 'Interactions per view' },
    { title: 'Link Clicks', value: filteredMetrics.clicks, icon: MousePointerClick, color: 'bg-pink-500/10 text-brand-pink', desc: 'Actions on custom links' }
  ];

  // SVG Chart Helper
  const maxHistoryValue = history.length > 0 ? Math.max(...history.map(h => h.value)) : 10000;
  const points = history.map((h, i) => {
    const x = (i / 6) * 500;
    const y = 180 - (h.value / maxHistoryValue) * 140; // leaving margin top and bottom
    return `${x},${y}`;
  }).join(' ');

  return (
    <DashboardShell title="Performance Analytics">
      <div className="space-y-8">
        
        {/* Header Options */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white/40 p-5 rounded-2xl border border-slate-200/50 backdrop-blur-md">
          <div className="space-y-1">
            <h2 className="text-sm font-extrabold text-slate-800 tracking-tight flex items-center gap-1.5">
              <BarChart3 className="w-4 h-4 text-brand-indigo" />
              <span>Workspace Report Panel</span>
            </h2>
            <p className="text-xs text-slate-500">Track and refine your content campaigns using precise database snapshots.</p>
          </div>
          
          {/* Platform Filters */}
          <div className="flex flex-wrap gap-1.5 p-1 rounded-xl bg-slate-100 border border-slate-200/50 w-full md:w-auto justify-start">
            {['ALL', 'LINKEDIN', 'INSTAGRAM'].map((plat) => (
              <button
                key={plat}
                onClick={() => setSelectedPlatform(plat)}
                className={`px-3 py-1.5 text-2xs font-extrabold rounded-lg transition-all duration-200 cursor-pointer ${
                  selectedPlatform === plat
                    ? 'bg-white text-slate-850 shadow-sm scale-102 border border-slate-200/10'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {plat === 'ALL' ? 'All Platforms' : plat.charAt(0) + plat.slice(1).toLowerCase()}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(n => (
              <Card key={n} hoverEffect={false} className="h-32 animate-pulse bg-white/50 border-slate-200/55 p-6 flex flex-col justify-between">
                <div className="w-20 h-4 bg-slate-200 rounded"></div>
                <div className="w-28 h-8 bg-slate-200 rounded mt-2"></div>
              </Card>
            ))}
          </div>
        ) : (
          <>
            {/* Stats Cards */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {statCards.map((stat) => {
                const Icon = stat.icon;
                return (
                  <Card key={stat.title} hoverEffect className="p-6 border border-slate-200/60 bg-white/70 backdrop-blur-md shadow-xl flex flex-col justify-between rounded-2xl">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">{stat.title}</span>
                      <div className={`w-8 h-8 rounded-xl ${stat.color} flex items-center justify-center shadow-sm`}>
                        <Icon className="w-4 h-4" />
                      </div>
                    </div>
                    <div className="mt-4 flex items-baseline gap-2">
                      <span className="text-2xl font-extrabold text-slate-900 tracking-tight">
                        {typeof stat.value === 'number' ? stat.value.toLocaleString() : stat.value}
                      </span>
                    </div>
                    <p className="text-2xs text-slate-450 font-medium mt-1.5">{stat.desc}</p>
                  </Card>
                );
              })}
            </div>

            {/* Graphs & Charts Grid */}
            <div className="grid lg:grid-cols-3 gap-8">
              
              {/* SVG Analytics Line Graph */}
              <Card hoverEffect={false} className="lg:col-span-2 p-6 border border-slate-200/60 bg-white/70 backdrop-blur-md shadow-xl rounded-2xl flex flex-col justify-between">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="text-sm font-extrabold text-slate-800 tracking-tight">Daily Performance Trend</h3>
                    <p className="text-2xs text-slate-400 font-semibold mt-0.5">Content impressions over the last 7 days</p>
                  </div>
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100 flex items-center gap-1 shadow-2xs">
                    <TrendingUp className="w-3.5 h-3.5" /> +18.4% reach
                  </span>
                </div>

                {/* SVG Graph View */}
                {history.length > 0 && (
                  <div className="h-60 w-full relative pt-2">
                    <svg className="w-full h-full" viewBox="0 0 500 180" preserveAspectRatio="none">
                      {/* Grid Lines */}
                      <line x1="0" y1="40" x2="500" y2="40" stroke="#f1f5f9" strokeWidth="1" />
                      <line x1="0" y1="90" x2="500" y2="90" stroke="#f1f5f9" strokeWidth="1" />
                      <line x1="0" y1="140" x2="500" y2="140" stroke="#f1f5f9" strokeWidth="1" />

                      {/* Area Under Curve */}
                      <path 
                        d={`M0,180 L${points} L500,180 Z`}
                        fill="url(#area-gradient)" 
                        opacity="0.12"
                      />

                      {/* Trending Line Curve */}
                      <path 
                        d={`M${points}`}
                        fill="none" 
                        stroke="url(#line-gradient)" 
                        strokeWidth="3.5" 
                        strokeLinecap="round"
                      />

                      {/* Interactive dots representing days */}
                      {history.map((h, i) => {
                        const x = (i / 6) * 500;
                        const y = 180 - (h.value / maxHistoryValue) * 140;
                        return (
                          <g key={i} className="group/dot cursor-pointer">
                            <circle 
                              cx={x} 
                              cy={y} 
                              r="4" 
                              className="fill-brand-indigo stroke-white stroke-2 shadow-md transition-all group-hover/dot:r-6" 
                            />
                            <circle 
                              cx={x} 
                              cy={y} 
                              r="10" 
                              className="fill-brand-indigo/10 opacity-0 group-hover/dot:opacity-100 transition-opacity" 
                            />
                          </g>
                        );
                      })}

                      {/* Definitions */}
                      <defs>
                        <linearGradient id="line-gradient" x1="0" y1="0" x2="1" y2="0">
                          <stop offset="0%" stopColor="#4f46e5" />
                          <stop offset="50%" stopColor="#9333ea" />
                          <stop offset="100%" stopColor="#ec4899" />
                        </linearGradient>
                        <linearGradient id="area-gradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#4f46e5" />
                          <stop offset="100%" stopColor="#f8fafc" />
                        </linearGradient>
                      </defs>
                    </svg>

                    {/* Chart Labels */}
                    <div className="flex justify-between text-2xs text-slate-400 font-extrabold mt-4">
                      {history.map((h) => (
                        <span key={h.date}>{h.date}</span>
                      ))}
                    </div>
                  </div>
                )}
              </Card>

              {/* AI Recommendations Panel */}
              <Card hoverEffect={false} className="p-6 border border-slate-200/60 bg-white/70 backdrop-blur-md shadow-xl rounded-2xl flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-brand-purple flex items-center justify-center shadow-sm">
                      <Sparkles className="w-4 h-4 animate-float" />
                    </div>
                    <div>
                      <h3 className="text-sm font-extrabold text-slate-800 tracking-tight">AI Content Optimization</h3>
                      <p className="text-2xs text-slate-400 font-semibold font-mono">Performance Recommendations</p>
                    </div>
                  </div>
                  <hr className="border-slate-100" />
                  
                  <div className="space-y-4 text-xs font-semibold text-slate-600">
                    <div className="space-y-2">
                      <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">Best Platform</span>
                      <div className="flex justify-between bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                        <span>Instagram (Reels)</span>
                        <span className="text-emerald-600">+45% reach</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">Optimal Days</span>
                      <div className="flex justify-between bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                        <span>Tuesdays & Thursdays</span>
                        <span className="text-slate-700 font-bold">11:15 AM / 19:30</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">Top Content Pillar</span>
                      <div className="flex justify-between bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                        <span>Roasting Craftsmanship</span>
                        <span className="text-brand-indigo font-bold">4.8K Views avg</span>
                      </div>
                    </div>
                  </div>
                </div>

                <Button variant="glass" size="sm" className="w-full mt-6 text-xs gap-1.5 border-slate-200">
                  <span>Generate Detailed PDF Report</span>
                </Button>
              </Card>

            </div>

            {/* Top Performing Posts List */}
            <div className="space-y-4">
              <h3 className="text-base font-extrabold text-slate-800 tracking-tight">Top Performing Content</h3>
              
              <div className="space-y-4">
                {filteredPosts.length === 0 ? (
                  <Card hoverEffect={false} className="p-8 text-center text-slate-400 italic text-xs border border-slate-200/60 bg-white/70 rounded-2xl shadow-xl">
                    No published posts recorded for this platform filter.
                  </Card>
                ) : (
                  filteredPosts.map((post) => (
                    <Card key={post.id} hoverEffect className="p-5 border border-slate-200/60 bg-white/70 backdrop-blur-md shadow-xl rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="space-y-2.5 flex-1 min-w-0">
                        <div className="flex items-center gap-3">
                          <span className="px-2.5 py-0.5 rounded bg-slate-150 text-slate-600 text-[10px] font-extrabold uppercase border border-slate-200/40">
                            {post.platform}
                          </span>
                          <span className="text-2xs text-slate-400 font-semibold">{post.publishedAt}</span>
                        </div>
                        <p className="text-xs text-slate-700 leading-relaxed font-semibold truncate max-w-xl">
                          "{post.text}"
                        </p>
                      </div>

                      {/* Metrics columns */}
                      <div className="flex flex-wrap gap-6 items-center text-xs font-bold text-slate-700">
                        <div className="text-center px-1">
                          <span className="text-slate-400 text-2xs block mb-0.5">Views</span>
                          <span>{post.impressions.toLocaleString()}</span>
                        </div>
                        <div className="text-center px-1">
                          <span className="text-slate-400 text-2xs block mb-0.5">Likes</span>
                          <span>{post.likes}</span>
                        </div>
                        <div className="text-center px-1">
                          <span className="text-slate-400 text-2xs block mb-0.5">Comments</span>
                          <span>{post.comments}</span>
                        </div>
                        <div className="text-center px-1">
                          <span className="text-slate-400 text-2xs block mb-0.5">Clicks</span>
                          <span>{post.clicks}</span>
                        </div>
                        
                        <Button variant="outline" size="sm" className="h-8 w-8 p-0 rounded-lg bg-white border-slate-200">
                          <ChevronRight className="w-4 h-4 text-slate-500" />
                        </Button>
                      </div>
                    </Card>
                  ))
                )}
              </div>
            </div>
          </>
        )}

      </div>
    </DashboardShell>
  );
}
