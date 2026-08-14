import { useState, useEffect } from 'react';
import { useParams, Link } from '@remix-run/react';
import { entropeeStore, type BuildRecord } from '~/lib/services/entropeeStore';
import { EntropeeBadge } from '~/components/ui/EntropeeBadge';
import { useVercelDeploy } from '~/components/deploy/VercelDeploy.client';

export default function BuildPreviewPage() {
  const { id } = useParams<{ id: string }>();
  const [build, setBuild] = useState<BuildRecord | null>(null);
  const [showDeployModal, setShowDeployModal] = useState(false);
  const { isDeploying, handleVercelDeploy, isConnected } = useVercelDeploy();

  useEffect(() => {
    if (id) {
      const b = entropeeStore.getBuildById(id);
      if (b) {
        setBuild(b);
      } else {
        setBuild({
          id,
          user_id: 'user_demo_123',
          name: `Build #${id.slice(0, 6)}`,
          description: 'React • Tailwind CSS • Vite',
          prompt_history: [],
          preview_url: `/webcontainer/preview/${id}`,
          status: 'live',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });
      }
    }
  }, [id]);

  if (!build) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="flex items-center gap-3 text-sm text-[#d0c5af]">
          <div className="w-5 h-5 border-2 border-[#d4af37] border-t-transparent rounded-full animate-spin" />
          Loading build preview...
        </div>
      </div>
    );
  }

  return (
    <div className="w-screen h-screen bg-black text-white flex flex-col overflow-hidden relative selection:bg-[#d4af37]/30 selection:text-white">
      {/* Preview Header Bar */}
      <header className="h-14 bg-[#131313] border-b border-[#4d4635]/30 px-4 flex items-center justify-between z-30 shrink-0">
        <div className="flex items-center gap-4">
          <Link
            to="/dashboard"
            className="flex items-center gap-2 text-xs font-bold text-[#d0c5af] hover:text-[#f2ca50] transition-colors py-1.5 px-3 rounded-lg bg-[#201f1f] border border-[#4d4635]/40"
          >
            <div className="i-ph:arrow-left text-sm" />
            Dashboard
          </Link>

          <div className="h-4 w-px bg-[#4d4635]/40" />

          <div className="flex items-center gap-2">
            <h1 className="font-bold text-sm text-white">{build.name}</h1>
            <span className="bg-[#d4af37]/20 border border-[#d4af37]/40 text-[#f2ca50] px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">
              {build.status}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowDeployModal(true)}
            className="bg-gradient-to-r from-[#cd7f32] to-[#d4af37] text-black px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider hover:opacity-90 transition-all flex items-center gap-2 shadow-[0_0_15px_rgba(212,175,55,0.2)] active:scale-95"
          >
            <div className="i-ph:rocket-launch-bold text-sm" />
            Deploy to Vercel
          </button>
        </div>
      </header>

      {/* Main Preview Container */}
      <div className="flex-grow w-full relative bg-[#0e0e0e] overflow-hidden">
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
          <div className="w-full h-full max-w-5xl max-h-[85vh] bg-[#131313] border border-[#d4af37]/20 rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.8)] flex flex-col relative">
            <div className="h-10 bg-[#0A0A0A] border-b border-[#4d4635]/30 px-4 flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-red-500/80" />
                <span className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <span className="w-3 h-3 rounded-full bg-green-500/80" />
              </div>
              <div className="flex-grow bg-[#201f1f] rounded-md px-3 py-1 text-xs text-[#d0c5af] flex items-center justify-between font-mono">
                <span>https://{build.id.toLowerCase()}.entropee.app</span>
                <div className="i-ph:lock-simple-bold text-xs text-green-400" />
              </div>
            </div>

            <div className="flex-grow bg-black p-8 flex flex-col items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#d4af37]/10 via-transparent to-transparent pointer-events-none" />

              <div className="relative z-10 text-center max-w-md">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#dac673] to-[#d4af37] flex items-center justify-center text-black font-bold text-3xl mx-auto mb-6 shadow-[0_0_30px_rgba(212,175,55,0.3)]">
                  E
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">{build.name}</h2>
                <p className="text-sm text-[#d0c5af] mb-6">
                  {build.description || 'Production-ready app generated by Entropee.'}
                </p>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#201f1f] border border-[#d4af37]/30 text-xs font-mono text-[#f2ca50]">
                  <span className="w-2 h-2 rounded-full bg-green-400 animate-ping" />
                  Live Preview Container Active
                </div>
              </div>
            </div>
          </div>
        </div>

        <EntropeeBadge />
      </div>

      {/* Custom Vercel Deploy Modal */}
      {showDeployModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-[#131313] border border-[#d4af37]/30 rounded-2xl max-w-md w-full p-6 text-center shadow-[0_0_40px_rgba(212,175,55,0.15)] relative">
            <button
              onClick={() => setShowDeployModal(false)}
              className="absolute top-4 right-4 text-[#99907c] hover:text-white text-lg"
            >
              ✕
            </button>

            <div className="w-12 h-12 rounded-xl bg-black border border-[#d4af37]/30 flex items-center justify-center text-[#f2ca50] mx-auto mb-4">
              <div className="i-ph:triangle-bold text-2xl" />
            </div>

            <h3 className="text-lg font-bold text-white mb-1">Deploy to Vercel</h3>
            <p className="text-xs text-[#d0c5af] mb-6">
              Publish your digital build directly to production with Vercel's global edge network.
            </p>

            <div className="space-y-3">
              <button
                onClick={async () => {
                  const success = await handleVercelDeploy();
                  if (success) setShowDeployModal(false);
                }}
                disabled={isDeploying}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#dac673] to-[#d4af37] text-black font-bold text-xs uppercase tracking-wider hover:opacity-95 transition-all shadow-[0_0_20px_rgba(212,175,55,0.2)] active:scale-95"
              >
                {isDeploying ? 'Deploying to Vercel...' : 'Start Vercel Deployment'}
              </button>

              <button
                onClick={() => setShowDeployModal(false)}
                className="w-full py-2.5 px-4 rounded-xl bg-[#201f1f] text-[#d0c5af] hover:text-white font-bold text-xs uppercase tracking-wider transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

