import { useState, useEffect } from 'react';
import { Link, useNavigate } from '@remix-run/react';
import { entropeeStore, type UserRecord, type UserPlan } from '~/lib/services/entropeeStore';
import { hasFeature } from '~/lib/utils/featureFlags';

export default function PricingPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState<UserRecord | null>(null);
  const [upgradingPlan, setUpgradingPlan] = useState<UserPlan | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  useEffect(() => {
    setUser(entropeeStore.getCurrentUser());
  }, []);

  const handleSelectPlan = async (plan: UserPlan) => {
    setUpgradingPlan(plan);
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan, userId: user?.id }),
      });
      const data = (await response.json()) as any;

      if (data.success) {
        setUser(data.user);
        setNotification(`Successfully switched to the ${plan.toUpperCase()} plan!`);
        setTimeout(() => setNotification(null), 4000);
      }
    } catch {
      // Local store fallback
      if (user) {
        const updated = entropeeStore.updateUserPlan(user.id, plan);
        if (updated) {
          setUser(updated);
          setNotification(`Switched to the ${plan.toUpperCase()} plan!`);
          setTimeout(() => setNotification(null), 4000);
        }
      }
    } finally {
      setUpgradingPlan(null);
    }
  };

  const hasHackAi = user ? hasFeature(user, 'hack_ai') : false;

  return (
    <div className="min-h-screen bg-black text-[#e5e2e1] font-sans flex flex-col selection:bg-[#d4af37]/30 selection:text-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-[#131313]/80 backdrop-blur-xl border-b border-[#4d4635]/30 shadow-[0_0_20px_rgba(212,175,55,0.08)]">
        <div className="flex justify-between items-center px-6 py-4 max-w-7xl mx-auto">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#dac673] to-[#d4af37] flex items-center justify-center text-black font-bold text-lg shadow-[0_0_15px_rgba(212,175,55,0.3)]">
              E
            </div>
            <span className="font-bold text-2xl text-[#f2ca50] tracking-tighter">Entropee</span>
          </Link>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium">
            <Link to="/dashboard" className="text-[#d0c5af] hover:text-[#f2ca50] transition-colors">
              Dashboard
            </Link>
            <Link to="/connectors" className="text-[#d0c5af] hover:text-[#f2ca50] transition-colors">
              Connectors
            </Link>
            <Link to="/pricing" className="text-[#f2ca50] font-bold border-b-2 border-[#f2ca50] pb-1">
              Pricing
            </Link>
            <Link to="/hack" className="text-[#d0c5af] hover:text-[#f2ca50] transition-colors flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#f2ca50] animate-pulse" />
              Hack AI
            </Link>
          </div>

          <Link
            to="/signup"
            className="bg-gradient-to-r from-[#cd7f32] to-[#d4af37] text-black px-5 py-2 rounded-lg font-bold text-xs uppercase tracking-wider hover:opacity-90 transition-all active:scale-95 shadow-[0_0_15px_rgba(212,175,55,0.2)]"
          >
            Start Free Trial
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-grow pt-28 px-6 max-w-7xl mx-auto w-full pb-20">
        {notification && (
          <div className="mb-8 p-4 rounded-xl bg-gradient-to-r from-green-500/20 to-[#131313] border border-green-500/40 text-green-300 text-sm font-semibold text-center flex items-center justify-center gap-2">
            <div className="i-ph:check-circle-bold text-lg text-green-400" />
            {notification}
          </div>
        )}

        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#d4af37]/10 border border-[#d4af37]/30 text-[#f2ca50] text-xs font-semibold uppercase tracking-wider mb-4">
            5-Day Free Trial On All Plans
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-white tracking-tight mb-4">
            Crafted for <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#dac673] to-[#d4af37]">Vibecoders</span>
          </h1>
          <p className="text-base text-[#d0c5af]">
            Transparent pricing designed for pure digital creation. Unlock Hack AI and connected app tools for production speed.
          </p>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Free Plan */}
          <PricingCard
            name="Free"
            price="$0"
            period="/month"
            description="Essential tools to start building and previewing digital ideas."
            features={[
              '5-day trial',
              '3 active builds',
              'Live preview',
              'Basic connectors (read-only)',
              'Community support',
            ]}
            disabledFeatures={['No Hack AI assistant', 'No Vercel deployment']}
            isCurrent={user?.plan === 'free'}
            buttonText={user?.plan === 'free' ? 'Current Plan' : 'Select Free'}
            onSelect={() => handleSelectPlan('free')}
            isLoading={upgradingPlan === 'free'}
          />

          {/* Pro Plan */}
          <PricingCard
            name="Pro"
            price="$20"
            period="/month"
            description="For creators building production apps with deployment tools."
            features={[
              '5-day trial',
              'Unlimited active builds',
              'Live preview',
              'All connectors (read + write)',
              'Deploy to Vercel integration',
              'Priority email support',
            ]}
            disabledFeatures={['No Hack AI assistant']}
            isCurrent={user?.plan === 'pro'}
            buttonText={user?.plan === 'pro' ? 'Current Plan' : 'Upgrade to Pro'}
            onSelect={() => handleSelectPlan('pro')}
            isLoading={upgradingPlan === 'pro'}
          />

          {/* Premium Plan (Featured) */}
          <PricingCard
            name="Premium"
            price="$50"
            period="/month"
            description="Full power with Hack AI vibecoding assistant and real-time app tools."
            features={[
              '5-day trial',
              'Everything in Pro',
              '⚡ Hack AI (AI vibecoding assistant)',
              'Real-time connected app tools',
              'Priority generation speed',
              'Dedicated support channel',
            ]}
            highlighted
            isCurrent={user?.plan === 'premium'}
            buttonText={user?.plan === 'premium' ? 'Current Plan' : 'Upgrade to Premium'}
            onSelect={() => handleSelectPlan('premium')}
            isLoading={upgradingPlan === 'premium'}
          />
        </div>

        {/* Feature Comparison Notice */}
        <div className="mt-16 p-6 rounded-2xl bg-[#0A0A0A] border border-[#d4af37]/20 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#dac673] to-[#d4af37] flex items-center justify-center text-black font-bold text-2xl shrink-0">
              ⚡
            </div>
            <div>
              <h3 className="font-bold text-white text-base">Looking for Hack AI?</h3>
              <p className="text-xs text-[#d0c5af]">
                Hack AI is exclusively available on the Premium plan. It gives your AI vibecoding session real-time access to your connected apps like GitHub, Slack, and Notion.
              </p>
            </div>
          </div>
          <Link
            to={hasHackAi ? '/hack' : '/pricing'}
            onClick={() => {
              if (!hasHackAi) handleSelectPlan('premium');
            }}
            className="px-6 py-3 rounded-lg bg-[#d4af37] text-black font-bold text-xs uppercase tracking-wider hover:bg-[#dac673] transition-all shrink-0 active:scale-95"
          >
            {hasHackAi ? 'Launch Hack AI' : 'Unlock Hack AI Now'}
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-8 bg-[#0e0e0e] border-t border-[#4d4635]/20 mt-auto">
        <div className="flex flex-col md:flex-row justify-between items-center px-6 gap-4 max-w-7xl mx-auto text-xs text-[#99907c]">
          <div>© 2026 Entropee. Digital Craftsmanship.</div>
          <div className="flex gap-6">
            <Link to="/connectors" className="hover:text-[#f2ca50] transition-colors">Connectors</Link>
            <Link to="/dashboard" className="hover:text-[#f2ca50] transition-colors">Dashboard</Link>
            <Link to="/hack" className="hover:text-[#f2ca50] transition-colors">Hack AI</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

function PricingCard({
  name,
  price,
  period,
  description,
  features,
  disabledFeatures = [],
  highlighted = false,
  isCurrent = false,
  buttonText,
  onSelect,
  isLoading = false,
}: {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  disabledFeatures?: string[];
  highlighted?: boolean;
  isCurrent?: boolean;
  buttonText: string;
  onSelect: () => void;
  isLoading?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl p-8 flex flex-col justify-between transition-all duration-300 relative ${
        highlighted
          ? 'bg-gradient-to-b from-[#171717] via-[#131313] to-[#0A0A0A] border-2 border-[#d4af37] shadow-[0_0_35px_rgba(212,175,55,0.2)]'
          : 'bg-[#0A0A0A] border border-[#4d4635]/40 hover:border-[#d4af37]/40'
      }`}
    >
      {highlighted && (
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-[#dac673] to-[#d4af37] text-black text-[10px] font-bold uppercase tracking-wider shadow-md">
          Most Popular / Key Differentiator
        </div>
      )}

      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-white">{name}</h3>
          {isCurrent && (
            <span className="px-2.5 py-0.5 rounded bg-green-500/20 text-green-400 text-[10px] font-bold uppercase tracking-wider border border-green-500/30">
              Active Plan
            </span>
          )}
        </div>

        <div className="mb-4">
          <span className="text-4xl font-extrabold text-white">{price}</span>
          <span className="text-xs text-[#99907c]">{period}</span>
        </div>

        <p className="text-xs text-[#d0c5af] mb-6 min-h-[36px]">{description}</p>

        <div className="border-t border-[#4d4635]/30 my-6" />

        <ul className="space-y-3 mb-8 text-xs text-[#e5e2e1]">
          {features.map((feat, idx) => (
            <li key={idx} className="flex items-center gap-2.5">
              <div className="i-ph:check-bold text-[#f2ca50] text-sm shrink-0" />
              <span>{feat}</span>
            </li>
          ))}
          {disabledFeatures.map((feat, idx) => (
            <li key={idx} className="flex items-center gap-2.5 text-[#99907c] line-through">
              <div className="i-ph:x-bold text-red-400/60 text-sm shrink-0" />
              <span>{feat}</span>
            </li>
          ))}
        </ul>
      </div>

      <button
        onClick={onSelect}
        disabled={isCurrent || isLoading}
        className={`w-full py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-wider transition-all active:scale-95 ${
          highlighted
            ? 'bg-gradient-to-r from-[#dac673] to-[#d4af37] text-black hover:opacity-95 shadow-[0_0_20px_rgba(212,175,55,0.2)]'
            : isCurrent
            ? 'bg-[#201f1f] text-[#99907c] border border-[#4d4635]/30 cursor-default'
            : 'bg-[#201f1f] text-white hover:bg-[#2a2a2a] border border-[#4d4635]/50'
        }`}
      >
        {isLoading ? 'Processing...' : buttonText}
      </button>
    </div>
  );
}
