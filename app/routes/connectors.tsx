import { useState, useEffect } from 'react';
import { Link } from '@remix-run/react';
import { entropeeStore, type ConnectorRecord, type ConnectorProvider } from '~/lib/services/entropeeStore';

interface AppProviderInfo {
  id: ConnectorProvider;
  name: string;
  category: string;
  description: string;
  iconClass: string;
}

const PROVIDERS: AppProviderInfo[] = [
  {
    id: 'github',
    name: 'GitHub',
    category: 'Source Control & CI/CD',
    description: 'Import repositories, create pull requests, and commit code directly.',
    iconClass: 'i-ph:github-logo-duotone',
  },
  {
    id: 'slack',
    name: 'Slack',
    category: 'Communication',
    description: 'Post live build alerts, deployment status, and error logs to your channels.',
    iconClass: 'i-ph:slack-logo-duotone',
  },
  {
    id: 'notion',
    name: 'Notion',
    category: 'Knowledge & Workspace',
    description: 'Pull specs, user stories, and documentation into your vibecoding context.',
    iconClass: 'i-ph:notebook-duotone',
  },
  {
    id: 'google_drive',
    name: 'Google Drive',
    category: 'Cloud Storage',
    description: 'Access design assets, API schemas, and document specifications.',
    iconClass: 'i-ph:google-drive-logo-duotone',
  },
];

export default function ConnectorsPage() {
  const [connectors, setConnectors] = useState<ConnectorRecord[]>([]);

  useEffect(() => {
    setConnectors(entropeeStore.getConnectors());
  }, []);

  const handleToggle = (provider: ConnectorProvider) => {
    const updated = entropeeStore.toggleConnector(provider);
    setConnectors(entropeeStore.getConnectors());
  };

  const getConnectorState = (provider: ConnectorProvider) => {
    return connectors.find((c) => c.provider === provider && c.status === 'connected');
  };

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
            <Link to="/connectors" className="text-[#f2ca50] font-bold border-b-2 border-[#f2ca50] pb-1">
              Connectors
            </Link>
            <Link to="/pricing" className="text-[#d0c5af] hover:text-[#f2ca50] transition-colors">
              Pricing
            </Link>
            <Link to="/hack" className="text-[#d0c5af] hover:text-[#f2ca50] transition-colors flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#f2ca50] animate-pulse" />
              Hack AI
            </Link>
          </div>

          <Link
            to="/dashboard"
            className="bg-gradient-to-r from-[#cd7f32] to-[#d4af37] text-black px-5 py-2 rounded-lg font-bold text-xs uppercase tracking-wider hover:opacity-90 transition-all active:scale-95 shadow-[0_0_15px_rgba(212,175,55,0.2)]"
          >
            Dashboard
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-grow pt-28 px-6 max-w-7xl mx-auto w-full pb-20">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">App Connectors</h1>
            <p className="text-sm text-[#d0c5af] mt-1">
              Connect third-party apps to expose live real-time tools to your Hack AI sessions.
            </p>
          </div>

          <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#0A0A0A] border border-[#d4af37]/30 text-xs font-mono text-[#f2ca50]">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            {connectors.filter((c) => c.status === 'connected').length} Connected Apps Active
          </div>
        </div>

        {/* Connectors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {PROVIDERS.map((app) => {
            const activeState = getConnectorState(app.id);
            const isConnected = !!activeState;

            return (
              <div
                key={app.id}
                className={`rounded-2xl p-6 bg-[#0A0A0A] border transition-all duration-300 flex flex-col justify-between ${
                  isConnected
                    ? 'border-[#d4af37]/50 shadow-[0_0_20px_rgba(212,175,55,0.1)]'
                    : 'border-[#4d4635]/30 hover:border-[#d4af37]/30'
                }`}
              >
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-[#201f1f] border border-[#4d4635]/40 flex items-center justify-center text-[#f2ca50]">
                        <div className={`${app.iconClass} text-2xl`} />
                      </div>
                      <div>
                        <h3 className="font-bold text-white text-base">{app.name}</h3>
                        <span className="text-[11px] text-[#99907c] uppercase tracking-wider font-semibold">
                          {app.category}
                        </span>
                      </div>
                    </div>

                    {isConnected ? (
                      <span className="bg-green-500/20 border border-green-500/30 text-green-400 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                        Connected
                      </span>
                    ) : (
                      <span className="bg-[#201f1f] border border-[#4d4635]/40 text-[#99907c] px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                        Disconnected
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-[#d0c5af] mb-6">{app.description}</p>
                </div>

                <div className="pt-4 border-t border-[#4d4635]/20 flex justify-between items-center">
                  <span className="text-[11px] text-[#99907c]">
                    {isConnected ? `Synced ${new Date(activeState.last_synced_at).toLocaleTimeString()}` : 'Not connected'}
                  </span>

                  <button
                    onClick={() => handleToggle(app.id)}
                    className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all active:scale-95 flex items-center gap-2 ${
                      isConnected
                        ? 'bg-[#201f1f] text-red-400 border border-red-500/30 hover:bg-red-500/10'
                        : 'bg-gradient-to-r from-[#dac673] to-[#d4af37] text-black hover:opacity-95 shadow-[0_0_15px_rgba(212,175,55,0.2)]'
                    }`}
                  >
                    {isConnected ? 'Disconnect' : 'Connect OAuth'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Hack AI Runtime Notice */}
        <div className="mt-12 p-6 rounded-2xl bg-gradient-to-r from-[#d4af37]/10 via-[#131313] to-[#0A0A0A] border border-[#d4af37]/30 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="i-ph:cpu-duotone text-4xl text-[#f2ca50] shrink-0" />
            <div>
              <h3 className="font-bold text-white text-base">Connected App Tool Registry</h3>
              <p className="text-xs text-[#d0c5af]">
                Active connections are exposed to Hack AI. During a session, the AI can search repos, post Slack alerts, or read Notion documentation in real time.
              </p>
            </div>
          </div>
          <Link
            to="/hack"
            className="px-6 py-2.5 rounded-lg bg-[#d4af37] text-black font-bold text-xs uppercase tracking-wider hover:bg-[#dac673] transition-all shrink-0 active:scale-95"
          >
            Launch Hack AI Session
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-8 bg-[#0e0e0e] border-t border-[#4d4635]/20 mt-auto">
        <div className="flex flex-col md:flex-row justify-between items-center px-6 gap-4 max-w-7xl mx-auto text-xs text-[#99907c]">
          <div>© 2026 Entropee. Digital Craftsmanship.</div>
          <div className="flex gap-6">
            <Link to="/dashboard" className="hover:text-[#f2ca50] transition-colors">Dashboard</Link>
            <Link to="/pricing" className="hover:text-[#f2ca50] transition-colors">Pricing</Link>
            <Link to="/hack" className="hover:text-[#f2ca50] transition-colors">Hack AI</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
