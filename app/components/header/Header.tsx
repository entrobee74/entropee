import { useStore } from '@nanostores/react';
import { ClientOnly } from 'remix-utils/client-only';
import { chatStore } from '~/lib/stores/chat';
import { classNames } from '~/utils/classNames';
import { HeaderActionButtons } from './HeaderActionButtons.client';
import { ChatDescription } from '~/lib/persistence/ChatDescription.client';
import { Link } from '@remix-run/react';

export function Header() {
  const chat = useStore(chatStore);

  return (
    <header
      className={classNames('flex items-center px-4 border-b h-[var(--header-height)] justify-between', {
        'border-transparent': !chat.started,
        'border-bolt-elements-borderColor': chat.started,
      })}
    >
      <div className="flex items-center gap-4 text-bolt-elements-textPrimary">
        <a href="/" className="text-2xl font-semibold text-accent flex items-center">
          <img src="/logo-light-styled.png" alt="Entropee" className="w-[90px] inline-block dark:hidden" />
          <img src="/logo-dark-styled.png" alt="Entropee" className="w-[90px] inline-block hidden dark:block" />
        </a>

        {/* Entropee Header Navigation */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-semibold uppercase tracking-wider ml-4">
          <Link to="/dashboard" className="text-[#d0c5af] hover:text-[#f2ca50] transition-colors">
            Dashboard
          </Link>
          <Link to="/connectors" className="text-[#d0c5af] hover:text-[#f2ca50] transition-colors">
            Connectors
          </Link>
          <Link to="/pricing" className="text-[#d0c5af] hover:text-[#f2ca50] transition-colors">
            Pricing
          </Link>
          <Link to="/hack" className="text-[#f2ca50] hover:text-[#dac673] transition-colors flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#f2ca50] animate-pulse" />
            Hack AI
          </Link>
        </nav>
      </div>

      {chat.started && (
        <>
          <span className="flex-1 px-4 truncate text-center text-bolt-elements-textPrimary">
            <ClientOnly>{() => <ChatDescription />}</ClientOnly>
          </span>
          <ClientOnly>
            {() => (
              <div className="">
                <HeaderActionButtons chatStarted={chat.started} />
              </div>
            )}
          </ClientOnly>
        </>
      )}
    </header>
  );
}

