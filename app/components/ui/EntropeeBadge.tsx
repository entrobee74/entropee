import { Link } from '@remix-run/react';

interface EntropeeBadgeProps {
  className?: string;
}

export function EntropeeBadge({ className = '' }: EntropeeBadgeProps) {
  return (
    <Link
      to="/"
      target="_blank"
      rel="noopener noreferrer"
      className={`fixed bottom-4 right-4 z-50 flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/90 backdrop-blur-md border border-[#d4af37]/40 shadow-[0_0_15px_rgba(212,175,55,0.25)] hover:border-[#f2ca50] hover:shadow-[0_0_25px_rgba(212,175,55,0.4)] transition-all duration-300 group text-xs font-medium text-white ${className}`}
    >
      <div className="w-5 h-5 rounded-full bg-gradient-to-br from-[#dac673] to-[#d4af37] flex items-center justify-center text-black font-bold text-[10px] group-hover:scale-105 transition-transform">
        E
      </div>
      <span>Built with <strong className="text-[#f2ca50]">Entropee</strong></span>
      <div className="i-ph:arrow-square-out text-xs text-[#d4af37] group-hover:translate-x-0.5 transition-transform" />
    </Link>
  );
}
