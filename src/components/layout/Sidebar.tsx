'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Calendar,
  Compass,
  Image,
  Link as LinkIcon,
  Cpu,
  BarChart3,
  CreditCard,
  Settings,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  Sparkles
} from 'lucide-react';

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (val: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ collapsed, setCollapsed }) => {
  const pathname = usePathname();

  const menuItems = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'AI Strategy', href: '/dashboard/strategy', icon: Compass, premium: true },
    { name: 'Calendar', href: '/dashboard/calendar', icon: Calendar },
    { name: 'Media Library', href: '/dashboard/media', icon: Image },
    { name: 'Social Accounts', href: '/dashboard/socials', icon: LinkIcon },
    { name: 'Auto-Pilot', href: '/dashboard/autopilot', icon: Cpu, premium: true },
    { name: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
    { name: 'Billing', href: '/dashboard/billing', icon: CreditCard },
    { name: 'Settings', href: '/dashboard/settings', icon: Settings },
    { name: 'Admin Console', href: '/dashboard/admin', icon: ShieldCheck }
  ];

  return (
    <aside
      className={`bg-white border-r border-slate-200/85 flex flex-col justify-between transition-all duration-300 h-screen sticky top-0 z-30 ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      <div className="flex flex-col flex-1 overflow-y-auto no-scrollbar">
        {/* Logo Section */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100">
          {!collapsed && (
            <Link href="/" className="flex items-center gap-2.5 font-bold text-lg tracking-tight">
              <span className="w-8 h-8 rounded-xl gradient-bg flex items-center justify-center text-white shadow-md">
                <Sparkles className="w-4 h-4" />
              </span>
              <span className="gradient-text font-extrabold">Antigravity</span>
            </Link>
          )}
          {collapsed && (
            <Link href="/" className="w-8 h-8 mx-auto rounded-xl gradient-bg flex items-center justify-center text-white shadow-md">
              <Sparkles className="w-4 h-4" />
            </Link>
          )}
          
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden md:flex p-1.5 rounded-lg border border-slate-200 bg-white text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition-colors shadow-sm cursor-pointer"
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  isActive
                    ? 'gradient-bg text-white shadow-md shadow-brand-indigo/10'
                    : 'text-slate-650 hover:bg-slate-100/60 hover:text-slate-900'
                }`}
                title={collapsed ? item.name : ''}
              >
                <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                {!collapsed && (
                  <span className="flex-1 truncate flex items-center justify-between">
                    {item.name}
                    {item.premium && (
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-bold ${
                        isActive ? 'bg-white/20 text-white' : 'bg-brand-indigo/10 text-brand-indigo'
                      }`}>
                        AI
                      </span>
                    )}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* User Profile Switcher / Footer */}
      <div className="p-4 border-t border-slate-150 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full gradient-bg flex items-center justify-center text-white font-semibold flex-shrink-0 shadow-sm">
          JD
        </div>
        {!collapsed && (
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-slate-850 truncate">Akhil Makwana</p>
            <p className="text-xs text-slate-500 truncate">Free Plan</p>
          </div>
        )}
      </div>
    </aside>
  );
};
