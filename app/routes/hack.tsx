import { useState, useEffect } from 'react';
import { Link } from '@remix-run/react';
import { entropeeStore, type UserRecord } from '~/lib/services/entropeeStore';
import { hasFeature } from '~/lib/utils/featureFlags';
import { getActiveConnectorTools, type ConnectorToolDefinition } from '~/lib/services/connectorTools';
import { Chat } from '~/components/chat/Chat.client';

export default function HackAiPage() {
  const [user, setUser] = useState<UserRecord | null>(null);
  const [activeTools, setActiveTools] = useState<ConnectorToolDefinition[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const currentUser = entropeeStore.getCurrentUser();
    setUser(currentUser);
    const tools = getActiveConnectorTools(currentUser.id);
    setActiveTools(tools);
  }, []);

  const isPremiumUser = user ? hasFeature(user, 'hack_ai') : false;

  if (!mounted) return null;

  return (
    <div className="w-screen h-screen bg-black text-white flex flex-col overflow-hidden relative selection:bg-[#d4af37]/30 selection:text-white">
      {/* Top Header Bar */}
      <header className="h-14 bg-[#131313] border-b border-[#4d4635]/30 px-6 flex items-center justify-between z-40 shrink-0">
        <div className="flex items-center gap-4">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#dac673] to-[#d4af37] flex items-center justify-center text-black font-bold text-base shadow-[0_0_15px_rgba(212,175,55,0.3)]">
              E
            </div>
            <span className="font-bold text-xl text-[#f2ca50] tracking-tighter">Entropee</span>
          </Link>

          <div className="h-4 w-px bg-[#4d4635]/40" />

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#d4af37] flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#f2ca50] animate-pulse" />
              Hack AI Studio
            </span>
            <span className="px-2 py-0.5 rounded bg-[#d4af37]/20 border border-[#d4af37]/40 text-[#f2ca50] text-[10px] font-bold uppercase tracking-wider">
              Premium Exclusive
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Active Connector Indicators */}
          {activeTools.length > 0 && (
            <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-[#0A0A0A] border border-[#d4af37]/30 text-xs font-mono text-[#d0c5af]">
              <div className="i-ph:plug-bold text-[#f2ca50]" />
              <span>Tools Active:</span>
              <span className="text-[#f2ca50] font-bold">
                {Array.from(new Set(activeTools.map((t) => t.provider))).join(', ').toUpperCase()}
              </span>
            </div>
          )}

          <Link
            to="/dashboard"
            className="text-xs font-bold text-[#d0c5af] hover:text-[#f2ca50] transition-colors py-1.5 px-3 rounded-lg bg-[#201f1f] border border-[#4d4635]/40"
          >
            Dashboard
          </Link>
        </div>
      </header>

      {/* Main Workspace Area */}
      <div className="flex-grow w-full relative bg-[#0e0e0e] overflow-hidden">
        {isPremiumUser ? (
          <div className="w-full h-full relative">
            <Chat />
          </div>
        ) : (
          /* Locked Upsell Overlay for Non-Premium Users */
          <div className="absolute inset-0 bg-black/95 backdrop-blur-xl z-50 flex items-center justify-center p-6 text-center">
            <div className="max-w-lg w-full bg-[#131313] border border-[#d4af37]/40 rounded-2xl p-8 shadow-[0_0_50px_rgba(212,175,55,0.15)] relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#dac673] via-[#d4af37] to-[#cd7f32]" />

              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#dac673] to-[#d4af37] flex items-center justify-center text-black font-bold text-3xl mx-auto mb-6 shadow-[0_0_30px_rgba(212,175,55,0.3)]">
                ⚡
              </div>

              <h2 className="text-2xl font-bold text-white tracking-tight mb-2">
                Unlock <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#dac673] to-[#d4af37]">Hack AI</span>
              </h2>

              <p className="text-xs text-[#d0c5af] mb-6 leading-relaxed">
                Hack AI is Entropee's premium AI vibecoding assistant. It executes real-time tool calls against your connected apps (GitHub, Slack, Notion, Google Drive) during code generation.
              </p>

              <div className="bg-[#0A0A0A] border border-[#4d4635]/40 rounded-xl p-4 mb-6 text-left space-y-2.5 text-xs text-[#e5e2e1]">
                <div className="flex items-center gap-2 text-[#f2ca50] font-bold uppercase text-[10px] tracking-wider mb-1">
                  <div className="i-ph:sparkle-fill" /> Premium Exclusive Features
                </div>
                <div className="flex items-center gap-2">
                  <div className="i-ph:check-bold text-[#f2ca50]" />
                  <span>Real-time function calling & connected app integration</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="i-ph:check-bold text-[#f2ca50]" />
                  <span>Priority compute generation speeds</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="i-ph:check-bold text-[#f2ca50]" />
                  <span>Unlimited active vibecoding builds</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  to="/pricing"
                  className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-[#dac673] to-[#d4af37] text-black font-bold text-xs uppercase tracking-wider hover:opacity-95 transition-all shadow-[0_0_20px_rgba(212,175,55,0.2)] active:scale-95 text-center"
                >
                  Upgrade to Premium ($50/mo)
                </Link>
                <Link
                  to="/dashboard"
                  className="py-3 px-4 rounded-xl bg-[#201f1f] border border-[#4d4635]/40 text-[#d0c5af] hover:text-white text-xs font-bold uppercase tracking-wider transition-all text-center"
                >
                  Back to Dashboard
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
