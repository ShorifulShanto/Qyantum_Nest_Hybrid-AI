import React, { useState } from 'react';
import { NavigationRoute, ExplorerProfile } from '../types';
import { CosmicLogo } from './CosmicLogo';
import {
  Compass,
  Volume2,
  Search,
  Camera,
  Globe2,
  Orbit,
  User,
  Menu,
  X,
  Sparkles,
  BookOpen,
  Cpu,
} from 'lucide-react';

interface NavbarProps {
  currentRoute: NavigationRoute;
  onNavigate: (route: NavigationRoute) => void;
  profile: ExplorerProfile;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentRoute,
  onNavigate,
  profile,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  const primaryDesktopLinks: { label: string; route: NavigationRoute }[] = [
    { label: 'Solar System', route: '/solar-system' },
    { label: 'Star Atlas', route: '/star-patterns' },
    { label: 'Sounds', route: '/space-sounds' },
    { label: 'Search', route: '/search' },
    { label: 'Earth', route: '/earth' },
    { label: 'Journal', route: '/journal' },
  ];

  const allDrawerLinks: { label: string; route: NavigationRoute; icon: React.ElementType }[] = [
    { label: 'AI Space Guide', route: '/ai-guide', icon: Cpu },
    { label: 'Solar System', route: '/solar-system', icon: Orbit },
    { label: 'Star Atlas', route: '/star-patterns', icon: Sparkles },
    { label: 'Space Sounds', route: '/space-sounds', icon: Volume2 },
    { label: 'Cosmic Search', route: '/search', icon: Search },
    { label: 'Goldilocks', route: '/habitable-zone', icon: Compass },
    { label: 'Daily Capture', route: '/apod', icon: Camera },
    { label: 'Earth Insights', route: '/earth', icon: Globe2 },
    { label: 'Cosmic Journal', route: '/journal', icon: BookOpen },
  ];

  const isAiGuideActive = currentRoute === '/ai-guide';

  return (
    <>
      {/* Desktop & Tablet Top Navigation (3-Zone Contract) */}
      <header className="sticky top-0 z-40 w-full glass-nav px-4 lg:px-8 py-3.5 transition-all">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-6">
          {/* Zone 1: Brand Wordmark */}
          <button
            type="button"
            onClick={() => onNavigate('/')}
            className="flex items-center gap-2.5 text-left group shrink-0 cursor-pointer"
          >
            <CosmicLogo size={32} />
            <span className="text-xl font-bold font-headline tracking-tight text-white group-hover:text-[#5DA9FF] transition-colors whitespace-nowrap">
              Quantum Nest
            </span>
          </button>

          {/* Zone 2: Clean Single-Line Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-[#94A3B8]">
            {primaryDesktopLinks.map((link) => {
              const isActive = currentRoute === link.route;
              return (
                <button
                  key={link.route}
                  type="button"
                  onClick={() => onNavigate(link.route)}
                  className={`whitespace-nowrap shrink-0 transition-colors py-1 relative cursor-pointer ${
                    isActive ? 'text-white font-semibold' : 'hover:text-white'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#5DA9FF] rounded-full shadow-[0_0_8px_#5DA9FF]" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Full-Page AI Guide CTA & Explorer Profile */}
          <div className="flex items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={() => onNavigate('/ai-guide')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border text-xs font-mono font-bold transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                isAiGuideActive
                  ? 'bg-emerald-400 text-[#050816] border-emerald-300 shadow-[0_0_18px_rgba(52,211,153,0.4)]'
                  : 'bg-emerald-500/15 hover:bg-emerald-500/25 border-emerald-500/40 text-emerald-300'
              }`}
              title="Open Full-Page Hybrid AI Space Guide"
            >
              <Cpu className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">AI Space Guide</span>
            </button>

            <button
              type="button"
              onClick={() => onNavigate('/profile')}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium text-white transition-all hover:border-[#5DA9FF]/40 whitespace-nowrap shrink-0 cursor-pointer"
            >
              <User className="w-3.5 h-3.5 text-[#5DA9FF]" />
              <span className="hidden sm:inline font-mono uppercase tracking-wider text-[11px] text-[#5DA9FF]">
                {profile.displayName || 'Explorer'}
              </span>
            </button>

            {/* Mobile & Compact Drawer Toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg bg-white/5 border border-white/10 text-white cursor-pointer"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-3 pt-3 border-t border-white/10 grid grid-cols-2 gap-2 animate-in fade-in slide-in-from-top-2 duration-200">
            {allDrawerLinks.map((link) => {
              const Icon = link.icon;
              const isActive = currentRoute === link.route;
              return (
                <button
                  key={link.route}
                  type="button"
                  onClick={() => {
                    onNavigate(link.route);
                    setMobileMenuOpen(false);
                  }}
                  className={`flex items-center gap-2 p-2.5 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-[#5DA9FF]/15 text-[#5DA9FF] border border-[#5DA9FF]/30'
                      : 'bg-white/5 text-[#94A3B8] hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4 text-[#5DA9FF]" />
                  <span>{link.label}</span>
                </button>
              );
            })}
          </div>
        )}
      </header>

      {/* Mobile Bottom Navigation Dock */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-40 bg-[#050816]/90 backdrop-blur-xl border-t border-white/10 px-3 py-2 md:hidden"
        aria-label="Mobile Bottom Navigation"
      >
        <div className="flex items-center justify-around max-w-md mx-auto">
          {[
            { label: 'Home', route: '/' as NavigationRoute, icon: Sparkles },
            { label: 'Solar', route: '/solar-system' as NavigationRoute, icon: Orbit },
            { label: 'AI Guide', route: '/ai-guide' as NavigationRoute, icon: Cpu },
            { label: 'Search', route: '/search' as NavigationRoute, icon: Search },
            { label: 'Earth', route: '/earth' as NavigationRoute, icon: Globe2 },
            { label: 'Profile', route: '/profile' as NavigationRoute, icon: User },
          ].map((item) => {
            const Icon = item.icon;
            const isActive = currentRoute === item.route;
            return (
              <button
                key={item.route}
                type="button"
                onClick={() => onNavigate(item.route)}
                className={`flex flex-col items-center gap-1 py-1 px-2 rounded-lg transition-colors cursor-pointer ${
                  isActive ? 'text-[#5DA9FF]' : 'text-[#94A3B8] hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-[10px] font-medium uppercase tracking-tight">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
};
