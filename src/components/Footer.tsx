import React from 'react';
import { NavigationRoute } from '../types';
import { CosmicLogo } from './CosmicLogo';

interface FooterProps {
  onNavigate: (route: NavigationRoute) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative z-20 border-t border-white/15 py-12 bg-[#050816]/95 backdrop-blur-xl text-[#CBD5E1] pb-24 md:pb-12 text-sm">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 space-y-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <CosmicLogo size={24} />
              <span className="font-headline font-bold text-lg text-white">Quantum Nest</span>
              <span className="text-white/30">·</span>
              <span className="text-xs font-mono uppercase tracking-widest text-[#5DA9FF]">
                Cosmic Observatory
              </span>
            </div>
            <p className="text-xs text-[#CBD5E1]/85 max-w-md leading-relaxed">
              Interactive astronomical gateway uniting NASA/JPL archival imagery, exoplanet habitability simulation, and hybrid on-device + cloud AI guidance.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-medium text-[#CBD5E1]">
            <button type="button" onClick={() => onNavigate('/ai-guide')} className="hover:text-white transition-colors cursor-pointer">
              AI Space Guide
            </button>
            <button type="button" onClick={() => onNavigate('/solar-system')} className="hover:text-white transition-colors cursor-pointer">
              Solar System
            </button>
            <button type="button" onClick={() => onNavigate('/star-patterns')} className="hover:text-white transition-colors cursor-pointer">
              Star Atlas
            </button>
            <button type="button" onClick={() => onNavigate('/space-sounds')} className="hover:text-white transition-colors cursor-pointer">
              Space Sounds
            </button>
            <button type="button" onClick={() => onNavigate('/search')} className="hover:text-white transition-colors cursor-pointer">
              Cosmic Search
            </button>
            <button type="button" onClick={() => onNavigate('/habitable-zone')} className="hover:text-white transition-colors cursor-pointer">
              Goldilocks
            </button>
            <button type="button" onClick={() => onNavigate('/apod')} className="hover:text-white transition-colors cursor-pointer">
              Daily Capture
            </button>
            <button type="button" onClick={() => onNavigate('/earth')} className="hover:text-white transition-colors cursor-pointer">
              Earth Insights
            </button>
            <button type="button" onClick={() => onNavigate('/journal')} className="hover:text-white transition-colors cursor-pointer">
              Cosmic Journal
            </button>
          </div>
        </div>

        <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-slate-300">
          <span>Data sourced from NASA Open APIs & JPL-Caltech Archives</span>
          <span>© {currentYear} Quantum Nest</span>
        </div>
      </div>
    </footer>
  );
};
