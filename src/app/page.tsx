'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Sparkles, 
  ArrowRight, 
  CheckCircle, 
  Cpu, 
  Calendar, 
  Share2, 
  BarChart, 
  ChevronDown, 
  Zap, 
  ShieldCheck, 
  Users, 
  Play 
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

export default function LandingPage() {
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'annually'>('monthly');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const pricingPlans = [
    {
      name: 'Starter',
      price: billingPeriod === 'monthly' ? 0 : 0,
      period: '/month',
      desc: 'Perfect for testing the AI generation capabilities.',
      features: [
        '1 Workspace',
        '1 Connected Social Account',
        '30 AI Post Generations / month',
        'Manual scheduling approval',
        'Basic scheduling calendar',
        '7-day analytics history'
      ],
      cta: 'Get Started Free',
      popular: false,
      id: 'plan-starter'
    },
    {
      name: 'Growth',
      price: billingPeriod === 'monthly' ? 49 : 39,
      period: '/month',
      desc: 'The complete AI assistant for small business owners.',
      features: [
        '3 Workspaces',
        '5 Connected Social Accounts',
        '300 AI Post Generations / month',
        'AI Brand Memory & Brand Kit',
        'AI Image generation (30 credits)',
        'Full Auto-Pilot rule engine',
        '30-day analytics history & insights',
        'Email & In-app notifications'
      ],
      cta: 'Start 14-day Free Trial',
      popular: true,
      id: 'plan-growth'
    },
    {
      name: 'Agency',
      price: billingPeriod === 'monthly' ? 149 : 119,
      period: '/month',
      desc: 'Scale content production for multiple client brands.',
      features: [
        'Unlimited Workspaces',
        '25 Connected Social Accounts',
        'Unlimited AI Post Generations',
        'Unlimited Brand Kits',
        'AI Image generation (150 credits)',
        'Advanced Repurposing pipeline',
        'Client approval access portal',
        'Custom analytics reports & exports',
        'Priority support'
      ],
      cta: 'Contact Sales',
      popular: false,
      id: 'plan-agency'
    }
  ];

  const faqs = [
    {
      q: 'How does the AI understand our specific brand tone?',
      a: 'During onboarding, you upload your logo, define colors, and provide key brand characteristics. Antigravity stores this in the Workspace Brand Memory, grounding all generations in your exact voice, offers, and tone while avoiding prohibited topics.'
    },
    {
      q: 'Does the Auto-Pilot publish automatically without my approval?',
      a: 'By default, all new workspaces are configured to "Approval Required". The AI will generate, schedule, and stage the posts, then notify you for approval. You can turn on "Auto-Publish" rules only for content pillars you fully trust.'
    },
    {
      q: 'Do you use official APIs to connect social accounts?',
      a: 'Yes, we connect exclusively using official social media OAuth platform APIs. We encrypt your access tokens at rest, never expose them to the browser, and fully respect each platform’s rate limits and media specifications.'
    },
    {
      q: 'Can I cancel or change my plan at any time?',
      a: 'Absolutely. You can upgrade, downgrade, or cancel your subscription directly from the Billing page in one click. If you downgrade, your drafts and historical posts will be preserved safely.'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Header */}
      <header className="glass-panel sticky top-0 z-50 border-b border-slate-200/80 px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 font-bold text-lg tracking-tight">
          <span className="w-8 h-8 rounded-xl gradient-bg flex items-center justify-center text-white shadow-md">
            <Sparkles className="w-4 h-4" />
          </span>
          <span className="gradient-text font-extrabold">Antigravity</span>
        </Link>
        <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600">
          <a href="#features" className="hover:text-slate-900 transition-colors">Features</a>
          <a href="#workflow" className="hover:text-slate-900 transition-colors">Workflow</a>
          <a href="#pricing" className="hover:text-slate-900 transition-colors">Pricing</a>
          <a href="#faq" className="hover:text-slate-900 transition-colors">FAQ</a>
        </nav>
        <div className="flex items-center gap-3">
          <Link href="/dashboard">
            <Button variant="outline" size="sm">Log In</Button>
          </Link>
          <Link href="/dashboard">
            <Button variant="primary" size="sm" className="hidden sm:inline-flex">Start Free</Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative px-6 pt-20 pb-28 md:pt-28 md:pb-36 overflow-hidden max-w-7xl mx-auto w-full">
        {/* Decorative Blur Backgrounds */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-brand-indigo/10 blur-[100px] -z-10 animate-pulse-glow"></div>
        <div className="absolute top-1/3 left-1/3 w-[300px] h-[300px] rounded-full bg-brand-purple/10 blur-[80px] -z-10"></div>

        <div className="grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 flex flex-col items-start text-left space-y-6">
            {/* Tagline */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-indigo/10 border border-brand-indigo/20 text-brand-indigo text-xs font-semibold">
              <Zap className="w-3.5 h-3.5" />
              <span>Meet your new AI Social Media Employee</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] text-slate-900">
              Automate your social presence <span className="gradient-text">on Auto-Pilot</span>
            </h1>
            
            <p className="text-lg text-slate-600 max-w-xl">
              Antigravity learns your business, creates tailored strategies, generates beautiful creatives, drafts body copy, and schedules posts through official APIs. Stop spending hours on social—let AI do it.
            </p>

            <div className="flex flex-wrap gap-4 w-full sm:w-auto">
              <Link href="/dashboard" className="w-full sm:w-auto">
                <Button variant="primary" size="lg" className="w-full sm:w-auto gap-2 group">
                  <span>Start Auto-Pilot Free</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <a href="#demo" className="w-full sm:w-auto">
                <Button variant="glass" size="lg" className="w-full sm:w-auto gap-2">
                  <Play className="w-4 h-4 text-brand-indigo fill-current" />
                  <span>See How It Works</span>
                </Button>
              </a>
            </div>

            {/* Micro-metrics */}
            <div className="flex flex-wrap gap-6 pt-4 text-xs font-semibold text-slate-500">
              <span className="flex items-center gap-1.5"><CheckCircle className="w-4 h-4 text-emerald-500" /> No Credit Card Required</span>
              <span className="flex items-center gap-1.5"><CheckCircle className="w-4 h-4 text-emerald-500" /> Connect in 60 Seconds</span>
              <span className="flex items-center gap-1.5"><CheckCircle className="w-4 h-4 text-emerald-500" /> Official API Publishing</span>
            </div>
          </div>

          {/* Graphic / Interactive Mockup */}
          <div className="lg:col-span-5 relative w-full">
            <div className="absolute inset-0 bg-gradient-to-tr from-brand-indigo/20 to-brand-purple/20 rounded-3xl blur-[20px] -z-10"></div>
            
            {/* Dashboard Mockup Card */}
            <Card className="shadow-2xl border border-slate-200/50 bg-white/90 p-5 space-y-4 max-w-md mx-auto">
              {/* Card Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full gradient-bg flex items-center justify-center text-white font-bold text-xs shadow-sm">
                    JD
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800">Acme Coffee Shop</h4>
                    <span className="text-[10px] text-slate-500 font-medium">Auto-Pilot Active</span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 bg-brand-indigo/10 px-2 py-0.5 rounded-full border border-brand-indigo/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-indigo animate-pulse"></span>
                  <span className="text-[10px] font-bold text-brand-indigo">AI Generating</span>
                </div>
              </div>

              {/* Generated Post Preview */}
              <div className="border border-slate-100 rounded-xl bg-slate-50/50 p-4 space-y-3">
                <div className="flex items-center justify-between text-[10px] text-slate-500 font-semibold">
                  <span>POST FOR LINKEDIN</span>
                  <span className="text-brand-purple">Tone: Warm & Professional</span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed">
                  "Start your Monday with our signature cold brew! ☕ Crafted over 24 hours for a silky smooth finish. Perfect fuel to smash your goals this week. Stop by or order online. #Productivity #LocalCoffee"
                </p>
                {/* Mock Image Creative */}
                <div className="h-44 rounded-lg bg-slate-200 overflow-hidden relative flex items-center justify-center text-slate-500 text-xs font-medium">
                  <div className="absolute inset-0 gradient-bg opacity-15"></div>
                  <Sparkles className="w-8 h-8 text-brand-indigo mb-2 animate-float absolute" />
                  <span className="z-10 bg-white/80 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-semibold border border-white/60">
                    AI Generated Image
                  </span>
                </div>
              </div>

              {/* Approval controls */}
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1 text-xs py-2">
                  Regenerate
                </Button>
                <Button variant="primary" size="sm" className="flex-1 text-xs py-2">
                  Approve & Schedule
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="bg-slate-100/50 border-y border-slate-200/60 py-24 px-6">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="text-center max-w-2xl mx-auto space-y-4">
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 md:text-4xl">
              End-to-End Content Operations
            </h2>
            <p className="text-slate-600 text-base">
              A comprehensive system designed to reduce manual social media labor while improving consistency, reach, and brand image.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card hoverEffect className="p-6 flex flex-col space-y-4">
              <div className="w-10 h-10 rounded-xl bg-brand-indigo/10 text-brand-indigo flex items-center justify-center font-bold">
                <Cpu className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-800">Brand Memory</h3>
              <p className="text-xs text-slate-500 leading-relaxed flex-1">
                Store details about your industry, audience, signature offers, guidelines, and tone rules. The generator grounds all content in this context.
              </p>
            </Card>

            <Card hoverEffect className="p-6 flex flex-col space-y-4">
              <div className="w-10 h-10 rounded-xl bg-brand-purple/10 text-brand-purple flex items-center justify-center font-bold">
                <Calendar className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-800">Interactive Calendar</h3>
              <p className="text-xs text-slate-500 leading-relaxed flex-1">
                Visual monthly and weekly drag-and-drop planning. Rearrange schedules effortlessly, manage approval workflows, and review scheduled drafts.
              </p>
            </Card>

            <Card hoverEffect className="p-6 flex flex-col space-y-4">
              <div className="w-10 h-10 rounded-xl bg-pink-500/10 text-brand-pink flex items-center justify-center font-bold">
                <Share2 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-800">Official APIs</h3>
              <p className="text-xs text-slate-500 leading-relaxed flex-1">
                Connect and post directly to LinkedIn, Facebook, Instagram, and more without scraping. Safe, secure authentication and zero token exposure.
              </p>
            </Card>

            <Card hoverEffect className="p-6 flex flex-col space-y-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-bold">
                <BarChart className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-800">AI Analytics Insights</h3>
              <p className="text-xs text-slate-500 leading-relaxed flex-1">
                Understand what performs and why. Our AI automatically extracts engagement patterns and recommends action-oriented content experiments.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Auto-Pilot Workflow */}
      <section id="workflow" className="py-24 px-6 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-2xl mx-auto space-y-4 mb-20">
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 md:text-4xl">
            The Auto-Pilot Publishing Pipeline
          </h2>
          <p className="text-slate-600 text-base">
            Configure once, let the engine orchestrate strategy, generation, scheduling, and analysis.
          </p>
        </div>

        <div className="grid md:grid-cols-5 gap-6 relative">
          {/* Step 1 */}
          <div className="flex flex-col items-center text-center space-y-4">
            <span className="w-12 h-12 rounded-full gradient-bg flex items-center justify-center text-white font-extrabold shadow-md">1</span>
            <h4 className="font-bold text-slate-800 text-sm">Create Strategy</h4>
            <p className="text-xs text-slate-500 max-w-[200px]">AI plans content pillars and a suggested weekly frequency based on target audience.</p>
          </div>
          
          {/* Step 2 */}
          <div className="flex flex-col items-center text-center space-y-4">
            <span className="w-12 h-12 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-extrabold">2</span>
            <h4 className="font-bold text-slate-800 text-sm">Generate Material</h4>
            <p className="text-xs text-slate-500 max-w-[200px]">AI produces drafts, hashtags, calls-to-action, image prompts, and resized assets.</p>
          </div>

          {/* Step 3 */}
          <div className="flex flex-col items-center text-center space-y-4">
            <span className="w-12 h-12 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-extrabold">3</span>
            <h4 className="font-bold text-slate-800 text-sm">Review & Refine</h4>
            <p className="text-xs text-slate-500 max-w-[200px]">Users receive instant alerts. Preview posts in realistic layout mockups, edit, or regenerate.</p>
          </div>

          {/* Step 4 */}
          <div className="flex flex-col items-center text-center space-y-4">
            <span className="w-12 h-12 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-extrabold">4</span>
            <h4 className="font-bold text-slate-800 text-sm">Safe Publish</h4>
            <p className="text-xs text-slate-500 max-w-[200px]">Approved posts queue into a robust retry worker and publish at optimal high-traffic times.</p>
          </div>

          {/* Step 5 */}
          <div className="flex flex-col items-center text-center space-y-4">
            <span className="w-12 h-12 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-extrabold">5</span>
            <h4 className="font-bold text-slate-800 text-sm">Auto-Optimize</h4>
            <p className="text-xs text-slate-500 max-w-[200px]">AI processes audience feedback, refines future strategy recommendations, and repeat.</p>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="bg-slate-100/50 border-t border-slate-200/60 py-24 px-6">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="text-center max-w-2xl mx-auto space-y-4">
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 md:text-4xl">
              Transparent, Value-Based Pricing
            </h2>
            <p className="text-slate-600 text-base">
              Choose a tier that matches your content creation and client brand management scope.
            </p>

            {/* Billing Toggle */}
            <div className="inline-flex items-center gap-1.5 p-1 rounded-xl bg-slate-200/80 mt-4 border border-slate-200">
              <button 
                onClick={() => setBillingPeriod('monthly')}
                className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                  billingPeriod === 'monthly' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-600'
                }`}
              >
                Monthly
              </button>
              <button 
                onClick={() => setBillingPeriod('annually')}
                className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                  billingPeriod === 'annually' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-600'
                }`}
              >
                Annually (Save 20%)
              </button>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {pricingPlans.map((plan) => (
              <Card 
                key={plan.name} 
                hoverEffect={plan.popular}
                className={`p-8 relative flex flex-col justify-between ${
                  plan.popular ? 'border-2 border-brand-indigo ring-4 ring-brand-indigo/5 bg-white scale-[1.03] shadow-lg' : 'border border-slate-200 bg-white/70'
                }`}
              >
                {plan.popular && (
                  <span className="absolute top-0 right-6 -translate-y-1/2 gradient-bg text-white text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
                    Most Popular
                  </span>
                )}
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-extrabold text-slate-900">{plan.name}</h3>
                    <p className="text-xs text-slate-500 mt-1.5 min-h-[32px]">{plan.desc}</p>
                  </div>

                  <div className="flex items-baseline">
                    <span className="text-4xl font-extrabold text-slate-900">${plan.price}</span>
                    <span className="text-slate-500 text-sm font-semibold ml-1">{plan.period}</span>
                  </div>

                  <hr className="border-slate-100" />

                  <ul className="space-y-3.5">
                    {plan.features.map((feat) => (
                      <li key={feat} className="flex items-start gap-2.5 text-xs font-medium text-slate-600">
                        <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-8">
                  <Link href="/dashboard">
                    <Button 
                      id={plan.id}
                      variant={plan.popular ? 'primary' : 'outline'} 
                      className="w-full text-xs font-bold"
                    >
                      {plan.cta}
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-24 px-6 max-w-4xl mx-auto w-full">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 md:text-4xl">
            Frequently Asked Questions
          </h2>
          <p className="text-slate-600 text-base">
            Everything you need to know about the platform capabilities and security.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isExpanded = expandedFaq === idx;
            return (
              <div 
                key={idx} 
                className="border border-slate-200 rounded-2xl bg-white overflow-hidden transition-all duration-200"
              >
                <button
                  onClick={() => setExpandedFaq(isExpanded ? null : idx)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left font-bold text-slate-800 hover:text-slate-950 text-sm focus:outline-none cursor-pointer"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isExpanded ? 'rotate-180 text-slate-600' : ''}`} />
                </button>
                
                {isExpanded && (
                  <div className="px-6 pb-5 text-xs leading-relaxed text-slate-600 border-t border-slate-50 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 px-6 py-12 border-t border-slate-800 mt-auto">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-8 mb-8 text-xs">
          <div className="space-y-4">
            <span className="flex items-center gap-2 font-bold text-white text-sm">
              <Sparkles className="w-5 h-5 text-brand-indigo" />
              <span>Antigravity</span>
            </span>
            <p className="leading-relaxed">
              Autonomous AI social content operations built for creators, marketers, and small business owners.
            </p>
          </div>
          <div>
            <h5 className="font-bold text-white mb-3">Product</h5>
            <ul className="space-y-2">
              <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
              <li><a href="#pricing" className="hover:text-white transition-colors">Pricing</a></li>
              <li><a href="#faq" className="hover:text-white transition-colors">FAQ</a></li>
            </ul>
          </div>
          <div>
            <h5 className="font-bold text-white mb-3">Security</h5>
            <ul className="space-y-2 flex flex-col">
              <li className="flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> OAuth API Protection</li>
              <li className="flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Strict Tenant Isolation</li>
              <li className="flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Data Export Controls</li>
            </ul>
          </div>
          <div>
            <h5 className="font-bold text-white mb-3">Legal</h5>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
            </ul>
          </div>
        </div>
        <hr className="border-slate-800 mb-8" />
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-2xs text-slate-500">
          <span>&copy; {new Date().getFullYear()} Antigravity Inc. All rights reserved.</span>
          <span className="flex items-center gap-1">Made with ❤️ for modern content builders.</span>
        </div>
      </footer>
    </div>
  );
}
