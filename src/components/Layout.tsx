import React from 'react';
import { Award, Clock, Gift, Home, User } from 'lucide-react';
import { TranslationDictionary } from '../i18n/translations';
import { TabId } from '../types';
import { BrandLogo } from './BrandLogo';

interface LayoutProps {
  activeTab: TabId;
  onSelectTab: (tab: TabId) => void;
  onOpenAssistant: () => void;
  t: TranslationDictionary;
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({
  activeTab,
  onSelectTab,
  onOpenAssistant,
  t,
  children,
}) => {
  const navItems: { id: TabId; label: string; icon: React.ComponentType<{ className?: string; strokeWidth?: number }> }[] = [
    { id: 'home', label: t.nav.home, icon: Home },
    { id: 'points', label: t.nav.points, icon: Award },
    { id: 'rewards', label: t.nav.rewards, icon: Gift },
    { id: 'history', label: t.nav.history, icon: Clock },
    { id: 'profile', label: t.nav.profile, icon: User },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F0] text-[#1F281B]">
      {/* Top Bar: Clean 3-zone contract on desktop, compact 56px bar on mobile */}
      <header className="sticky top-0 z-30 h-14 md:h-16 bg-[#FAF7F0]/92 backdrop-blur-md border-b border-[#E7DFCC]">
        <div className="max-w-6xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4 md:gap-8">
          {/* Zone 1: Single-line Brand Wordmark */}
          <button
            type="button"
            onClick={() => onSelectTab('home')}
            className="focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#4A5D3F] rounded-xl text-left"
          >
            <BrandLogo size="md" />
          </button>

          {/* Zone 2: Desktop Primary Nav (5 single-line text links with subtle underline) */}
          <nav
            className="hidden md:flex items-center gap-7"
            aria-label="Navegación principal"
          >
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onSelectTab(item.id)}
                  className={`relative py-2 text-sm font-medium whitespace-nowrap shrink-0 transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#4A5D3F] rounded-sm ${
                    isActive
                      ? 'text-[#293622] font-semibold'
                      : 'text-[#5A6353] hover:text-[#293622]'
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <span className="absolute left-0 right-0 -bottom-[1px] h-0.5 bg-[#4A5D3F] rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Enlarged Waving Hand Virtual Assistant Trigger in Header */}
          <div className="flex items-center shrink-0">
            <button
              type="button"
              onClick={onOpenAssistant}
              aria-label={t.nav.assistantAria}
              className="animate-wave-hover inline-flex items-center gap-2 min-h-[44px] px-3.5 sm:px-4 py-1.5 rounded-2xl bg-[#4A5D3F] text-[#FAF7F0] hover:bg-[#38492F] active:scale-[0.98] transition-all shadow-xs whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4A5D3F]"
            >
              <span
                className="wave-hand text-2xl sm:text-[26px] leading-none select-none"
                role="img"
                aria-hidden="true"
              >
                👋
              </span>
              <span className="text-sm font-semibold tracking-tight">
                {t.nav.assistant}
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Canvas */}
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-24 md:pb-12">
        {children}
      </main>

      {/* Quiet Desktop Footer */}
      <footer className="hidden md:block border-t border-[#E7DFCC] bg-[#FAF7F0]">
        <div className="max-w-6xl mx-auto px-6 lg:px-8 py-6 flex items-center justify-between gap-4 text-xs text-[#5A6353]">
          <span>© 2026 Club La Ruedita</span>
          <span>{t.common.demoNote}</span>
        </div>
      </footer>

      {/* Mobile Fixed Bottom Navigation Bar (Thumb Zone, <= 15% aggregate height with top bar) */}
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#E7DFCC] pb-safe"
        aria-label="Navegación móvil"
      >
        <div className="grid grid-cols-5 h-16 max-w-lg mx-auto px-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelectTab(item.id)}
                className={`flex flex-col items-center justify-center min-h-[44px] gap-1 transition-colors focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-[#4A5D3F] ${
                  isActive ? 'text-[#4A5D3F]' : 'text-[#6B7365]'
                }`}
              >
                <Icon
                  className="w-[21px] h-[21px]"
                  strokeWidth={isActive ? 2.3 : 1.75}
                />
                <span
                  className={`text-[11px] leading-none whitespace-nowrap ${
                    isActive ? 'font-semibold text-[#293622]' : 'font-medium'
                  }`}
                >
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
};
