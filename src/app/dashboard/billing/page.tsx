"use client";

import React, { useEffect, useState } from 'react';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { CreditCard, Check, Sparkles, Loader2 } from 'lucide-react';

export default function BillingPage() {
  const [currentPlan, setCurrentPlan] = useState('FREE');
  const [loading, setLoading] = useState(true);
  const [upgrading, setUpgrading] = useState<string | null>(null);

  const fetchSubscription = () => {
    fetch('/api/billing')
      .then(res => res.json())
      .then(data => {
        if (data.subscription) setCurrentPlan(data.subscription.plan);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchSubscription();
  }, []);

  const handleUpgrade = async (plan: string) => {
    setUpgrading(plan);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId: plan })
      });
      const data = await res.json();
      if (res.ok && data.url) {
        window.location.href = data.url;
      } else {
        console.error('Failed to create checkout session:', data.error);
        setUpgrading(null);
      }
    } catch (err) {
      console.error('Checkout error:', err);
      setUpgrading(null);
    }
  };

  const plans = [
    {
      id: 'FREE',
      name: 'Free',
      price: '$0',
      description: 'Perfect for exploring the platform.',
      features: ['1 Social Account', '3 AI Generations/mo', 'Manual Publishing']
    },
    {
      id: 'GROWTH',
      name: 'Growth',
      price: '$29',
      description: 'For creators and small businesses.',
      features: ['5 Social Accounts', '100 AI Generations/mo', 'Auto-Pilot Publishing', 'Analytics Dashboard']
    },
    {
      id: 'AGENCY',
      name: 'Agency',
      price: '$99',
      description: 'For teams managing multiple brands.',
      features: ['Unlimited Accounts', 'Unlimited AI Generations', 'Approval Workflows', 'White-label Reports']
    }
  ];

  return (
    <DashboardShell title="Billing & Subscription">
      <div className="max-w-5xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <CreditCard className="text-brand-indigo" /> Billing
          </h1>
          <p className="text-slate-500 mt-1">Manage your active subscription and upgrade your plan.</p>
        </div>

        {loading ? (
          <div className="text-center py-12">Loading...</div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {plans.map(plan => {
              const isCurrent = currentPlan === plan.id;
              
              return (
                <Card key={plan.id} className={isCurrent ? 'border-brand-indigo ring-2 ring-brand-indigo/20 relative' : ''}>
                  {isCurrent && (
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-brand-indigo text-white px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase shadow-md">
                      Current Plan
                    </div>
                  )}
                  <CardHeader>
                    <CardTitle className="text-xl">{plan.name}</CardTitle>
                    <div className="mt-2">
                      <span className="text-3xl font-bold text-slate-900">{plan.price}</span>
                      <span className="text-sm text-slate-500 font-medium">/month</span>
                    </div>
                    <p className="text-sm text-slate-500 mt-2">{plan.description}</p>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3 mb-6">
                      {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                          <Check className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button 
                      className="w-full" 
                      variant={isCurrent ? "outline" : "primary"}
                      disabled={isCurrent || upgrading === plan.id}
                      onClick={() => handleUpgrade(plan.id)}
                    >
                      {upgrading === plan.id ? <Loader2 className="w-4 h-4 animate-spin" /> : (
                        isCurrent ? 'Active' : `Upgrade to ${plan.name}`
                      )}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
