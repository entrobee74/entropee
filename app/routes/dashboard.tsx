import { useState, useEffect } from 'react';
import { Link, useNavigate } from '@remix-run/react';
import { entropeeStore, type BuildRecord, type UserRecord } from '~/lib/services/entropeeStore';
import { getTrialStatus } from '~/lib/utils/featureFlags';

export default function DashboardPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState<UserRecord | null>(null);
  const [builds, setBuilds] = useState<BuildRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('recent');

  useEffect(() => {
    const currentUser = entropeeStore.getCurrentUser();
    setUser(currentUser);
    const userBuilds = entropeeStore.getBuilds(currentUser.id);
    setBuilds(userBuilds);
  }, []);

  const handleNewBuild = () => {
    navigate('/');
  };

  // Filter & Search
  const filteredBuilds = builds.filter((b) => {
    const matchesSearch = b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (b.description && b.description.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || b.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Sorting
  const sortedBuilds = [...filteredBuilds].sort((a, b) => {
    if (sortBy === 'recent') {
      return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
    }
    if (sortBy === 'name') {
      return a.name.localeCompare(b.name);
    }
    return a.status.localeCompare(b.status);
  });

  // Group by Timeframe: Today, This Week, Earlier
  const now = new Date().getTime();
  const oneDay = 24 * 60 * 60 * 1000;
  const oneWeek = 7 * oneDay;

  const todayBuilds = sortedBuilds.filter(b => (now - new Date(b.updated_at).getTime()) <= oneDay);
  const weekBuilds = sortedBuilds.filter(b => {
    const diff = now - new Date(b.updated_at).getTime();
    return diff > oneDay && diff <= oneWeek;
  });
  const earlierBuilds = sortedBuilds.filter(b => (now - new Date(b.updated_at).getTime()) > oneWeek);

  const trialStatus = user ? getTrialStatus(user) : null;

  return (
    <div className="min-h-screen bg-black text-[#e5e2e1] font-sans flex flex-col selection:bg-[#d4af37]/30 selection:text-white">
      {/* Top Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-[#131313]/80 backdrop-blur-xl border-b border-[#4d4635]/30 shadow-[0_0_20px_rgba(212,175,55,0.08)]">
        <div className="flex justify-between items-center px-6 py-4 max-w-7xl mx-auto">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#dac673] to-[#d4af37] flex items-center justify-center text-black font-bold text-lg shadow-[0_0_15px_rgba(212,175,55,0.3)]">
              E
            </div>
            <span className="font-bold text-2xl text-[#f2ca50] tracking-tighter">Entropee</span>
          </Link>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium">
            <Link to="/dashboard" className="text-[#f2ca50] font-bold border-b-2 border-[#f2ca50] pb-1">
              Dashboard
            </Link>
            <Link to="/connectors" className="text-[#d0c5af] hover:text-[#f2ca50] transition-colors">
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

          <button
            onClick={handleNewBuild}
            className="bg-gradient-to-r from-[#cd7f32] to-[#d4af37] text-black px-5 py-2 rounded-lg font-bold text-xs uppercase tracking-wider hover:opacity-90 transition-all active:scale-95 flex items-center gap-2 shadow-[0_0_15px_rgba(212,175,55,0.2)]"
          >
            <div className="i-ph:plus-bold text-sm" />
            New Build
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-grow pt-28 px-6 max-w-7xl mx-auto w-full pb-20">
        {/* Trial Status Banner */}
        {trialStatus && trialStatus.isTrialing && (
          <div className="mb-8 p-4 rounded-xl bg-gradient-to-r from-[#d4af37]/20 via-[#201f1f] to-[#131313] border border-[#d4af37]/30 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#d4af37]/20 border border-[#d4af37]/40 flex items-center justify-center text-[#f2ca50]">
                <div className="i-ph:clock-duotone text-xl" />
              </div>
              <div>
                <h4 className="font-bold text-white text-sm">
                  {user?.plan.toUpperCase()} Trial Active — {trialStatus.daysRemaining} Days Remaining
                </h4>
                <p className="text-xs text-[#d0c5af]">
                  Enjoy full feature access. Upgrade anytime to lock in priority build speeds.
                </p>
              </div>
            </div>
            <Link
              to="/pricing"
              className="px-4 py-2 rounded-lg bg-[#d4af37] text-black text-xs font-bold uppercase tracking-wider hover:bg-[#dac673] transition-all active:scale-95"
            >
              Upgrade Plan
            </Link>
          </div>
        )}

        {/* Header & Controls */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">Build History</h1>
            <p className="text-sm text-[#d0c5af] mt-1">Manage your active and archived digital creations.</p>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            {/* Search */}
            <div className="relative w-full md:w-64 bg-[#0A0A0A] border border-[#d4af37]/20 rounded-lg focus-within:border-[#f2ca50] transition-colors">
              <div className="i-ph:magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-[#d0c5af] text-sm" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search builds..."
                className="w-full bg-transparent border-none text-white pl-9 pr-4 py-2 text-sm focus:outline-none placeholder-[#99907c]"
              />
            </div>

            {/* Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-[#0A0A0A] border border-[#d4af37]/20 rounded-lg text-white py-2 px-3 text-sm focus:border-[#f2ca50] focus:outline-none cursor-pointer"
            >
              <option value="all">All Statuses</option>
              <option value="live">Live</option>
              <option value="draft">Draft</option>
              <option value="archived">Archived</option>
            </select>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-[#0A0A0A] border border-[#d4af37]/20 rounded-lg text-white py-2 px-3 text-sm focus:border-[#f2ca50] focus:outline-none cursor-pointer"
            >
              <option value="recent">Recently Edited</option>
              <option value="name">Name (A-Z)</option>
              <option value="status">Status</option>
            </select>
          </div>
        </div>

        {/* Build History Sections */}
        {sortedBuilds.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-[#4d4635]/50 rounded-2xl bg-[#0A0A0A]/50">
            <div className="i-ph:cube-duotone text-5xl text-[#d4af37]/50 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-white mb-1">No builds found</h3>
            <p className="text-sm text-[#d0c5af] mb-6 max-w-sm mx-auto">
              Start your first vibecoding session and watch your digital ideas come to life.
            </p>
            <button
              onClick={handleNewBuild}
              className="px-6 py-2.5 rounded-lg bg-[#d4af37] text-black font-bold text-xs uppercase tracking-wider hover:opacity-90 transition-all"
            >
              Start New Build
            </button>
          </div>
        ) : (
          <div className="space-y-10">
            {/* Today */}
            {todayBuilds.length > 0 && (
              <BuildSection title="Today" builds={todayBuilds} />
            )}

            {/* This Week */}
            {weekBuilds.length > 0 && (
              <BuildSection title="This Week" builds={weekBuilds} />
            )}

            {/* Earlier */}
            {earlierBuilds.length > 0 && (
              <BuildSection title="Earlier" builds={earlierBuilds} />
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="w-full py-8 bg-[#0e0e0e] border-t border-[#4d4635]/20 mt-auto">
        <div className="flex flex-col md:flex-row justify-between items-center px-6 gap-4 max-w-7xl mx-auto text-xs text-[#99907c]">
          <div>© 2026 Entropee. Digital Craftsmanship.</div>
          <div className="flex gap-6">
            <Link to="/connectors" className="hover:text-[#f2ca50] transition-colors">Connectors</Link>
            <Link to="/pricing" className="hover:text-[#f2ca50] transition-colors">Pricing</Link>
            <Link to="/hack" className="hover:text-[#f2ca50] transition-colors">Hack AI</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

function BuildSection({ title, builds }: { title: string; builds: BuildRecord[] }) {
  return (
    <div>
      <h2 className="text-xs font-bold uppercase tracking-wider text-[#d4af37] mb-4 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-[#d4af37]" />
        {title} ({builds.length})
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {builds.map((build) => (
          <BuildCard key={build.id} build={build} />
        ))}
      </div>
    </div>
  );
}

function BuildCard({ build }: { build: BuildRecord }) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'live':
        return (
          <span className="bg-[#d4af37]/20 border border-[#d4af37]/40 text-[#f2ca50] px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#f2ca50] animate-pulse" />
            Live
          </span>
        );
      case 'draft':
        return (
          <span className="bg-[#353534]/60 border border-[#4d4635] text-[#d0c5af] px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">
            Draft
          </span>
        );
      default:
        return (
          <span className="bg-[#201f1f] border border-[#4d4635]/40 text-[#99907c] px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">
            Archived
          </span>
        );
    }
  };

  return (
    <Link
      to={`/build/${build.id}/preview`}
      className="group bg-[#0A0A0A] border border-[#d4af37]/15 rounded-xl overflow-hidden flex flex-col hover:border-[#d4af37]/50 hover:shadow-[0_0_20px_rgba(212,175,55,0.1)] transition-all duration-300 relative"
    >
      {/* Thumbnail area */}
      <div className="h-44 bg-[#171717] relative overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-transparent to-black/80 z-10" />
        <div className="i-ph:code-duotone text-6xl text-[#d4af37]/20 group-hover:scale-110 group-hover:text-[#d4af37]/40 transition-all duration-500" />
        <div className="absolute top-3 left-3 z-20">{getStatusBadge(build.status)}</div>
      </div>

      {/* Info */}
      <div className="p-5 flex-grow flex flex-col justify-between bg-[#131313]/60 backdrop-blur-md">
        <div>
          <h3 className="font-bold text-white text-base group-hover:text-[#f2ca50] transition-colors mb-1">
            {build.name}
          </h3>
          <p className="text-xs text-[#d0c5af] line-clamp-1">{build.description || 'React • Tailwind'}</p>
        </div>

        <div className="mt-4 pt-3 border-t border-[#4d4635]/20 flex justify-between items-center text-xs text-[#99907c]">
          <span>Edited {new Date(build.updated_at).toLocaleDateString()}</span>
          <div className="i-ph:arrow-right text-[#f2ca50] opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </div>
    </Link>
  );
}
