'use client';

import React from 'react';
import { Bell, Sparkles, Plus, CheckCircle2 } from 'lucide-react';
import { Button } from '../ui/Button';

interface TopbarProps {
  title?: string;
}

export function Topbar({ title = 'Dashboard' }: { title?: string }) {
  return (
    <header className="h-16 bg-white  border-b border-slate-200  px-6 flex items-center justify-between sticky top-0 z-20">
      {/* Page Title & Status */}
      <div className="flex items-center gap-4">
        <h1 className="text-lg font-bold text-slate-800 tracking-tight">{title}</h1>
        
        {/* Workspace Connection Health */}
        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-200">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>LinkedIn Connected</span>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex items-center gap-3">
        <Button variant="outline" size="sm" className="hidden md:flex gap-1.5">
          <Sparkles className="w-4 h-4 text-brand-indigo" />
          <span>Ask AI Strategy</span>
        </Button>
        
        <Button variant="primary" size="sm" className="gap-1.5">
          <Plus className="w-4 h-4" />
          <span>New Post</span>
        </Button>
        
        {/* Notification Icon */}
        <button className="relative p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-brand-pink ring-2 ring-white"></span>
        </button>
      </div>
    </header>
  );
};
