import { useState } from 'react';
import { useNavigate, Link } from '@remix-run/react';
import { authService } from '~/lib/services/auth';
import type { UserPlan } from '~/lib/services/entropeeStore';

export default function SignupPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedPlan, setSelectedPlan] = useState<UserPlan>('free');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please provide both email and password.');
      return;
    }
    try {
      authService.signup(email, email.split('@')[0], selectedPlan);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Failed to create account.');
    }
  };

  const handleOAuth = (provider: 'google' | 'github') => {
    authService.loginWithOAuth(provider);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-black text-[#e5e2e1] font-sans flex flex-col justify-center items-center px-4 relative overflow-hidden">
      {/* Ambient background rays */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#d4af37]/10 via-black to-black pointer-events-none" />

      <div className="relative z-10 w-full max-w-md bg-[#131313]/80 backdrop-blur-xl border border-[#d4af37]/20 rounded-xl p-8 shadow-[0_0_30px_rgba(212,175,55,0.1)]">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-3 mb-3 group">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#dac673] to-[#d4af37] flex items-center justify-center text-black font-bold text-xl shadow-[0_0_15px_rgba(212,175,55,0.3)]">
              E
            </div>
            <span className="text-2xl font-bold tracking-tighter text-[#f2ca50]">Entropee</span>
          </Link>
          <h1 className="text-2xl font-bold text-white tracking-tight">Start Your 5-Day Free Trial</h1>
          <p className="text-sm text-[#d0c5af] mt-1">Full access to digital craftsmanship. No credit card required.</p>
        </div>

        {error && (
          <div className="mb-6 p-3 rounded bg-red-500/10 border border-red-500/30 text-red-400 text-sm text-center">
            {error}
          </div>
        )}

        {/* OAuth Buttons */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <button
            type="button"
            onClick={() => handleOAuth('google')}
            className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-[#201f1f] hover:bg-[#2a2a2a] border border-[#4d4635]/50 text-sm font-medium transition-all active:scale-95"
          >
            <div className="i-ph:google-logo-duotone text-lg text-[#f2ca50]" />
            Google
          </button>
          <button
            type="button"
            onClick={() => handleOAuth('github')}
            className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-[#201f1f] hover:bg-[#2a2a2a] border border-[#4d4635]/50 text-sm font-medium transition-all active:scale-95"
          >
            <div className="i-ph:github-logo-duotone text-lg text-[#f2ca50]" />
            GitHub
          </button>
        </div>

        <div className="relative flex items-center justify-center mb-6">
          <div className="border-t border-[#4d4635]/40 w-full" />
          <span className="bg-[#131313] px-3 text-xs text-[#99907c] uppercase tracking-wider font-semibold absolute">
            Or continue with
          </span>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase text-[#d0c5af] tracking-wider mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@domain.com"
              className="w-full bg-[#201f1f] border border-[#4d4635]/50 focus:border-[#f2ca50] rounded-lg px-4 py-2.5 text-white placeholder-[#99907c] focus:outline-none focus:ring-1 focus:ring-[#f2ca50] text-sm transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-[#d0c5af] tracking-wider mb-1.5">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-[#201f1f] border border-[#4d4635]/50 focus:border-[#f2ca50] rounded-lg px-4 py-2.5 text-white placeholder-[#99907c] focus:outline-none focus:ring-1 focus:ring-[#f2ca50] text-sm transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-[#d0c5af] tracking-wider mb-1.5">
              Initial Plan Tier
            </label>
            <select
              value={selectedPlan}
              onChange={(e) => setSelectedPlan(e.target.value as UserPlan)}
              className="w-full bg-[#201f1f] border border-[#4d4635]/50 focus:border-[#f2ca50] rounded-lg px-4 py-2.5 text-white focus:outline-none text-sm transition-all cursor-pointer"
            >
              <option value="free">Free Trial (3 builds)</option>
              <option value="pro">Pro Trial ($20/mo after trial)</option>
              <option value="premium">Premium Trial ($50/mo after trial - Hack AI)</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full mt-2 py-3 px-4 rounded-lg bg-gradient-to-r from-[#dac673] to-[#d4af37] text-black font-bold uppercase text-xs tracking-wider hover:opacity-95 transition-all shadow-[0_0_20px_rgba(212,175,55,0.2)] active:scale-95"
          >
            Create Account & Start Trial
          </button>
        </form>

        <p className="text-center text-xs text-[#99907c] mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-[#f2ca50] font-semibold hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
