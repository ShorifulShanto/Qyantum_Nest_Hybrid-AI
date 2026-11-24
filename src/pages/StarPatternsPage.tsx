import React, { useState } from 'react';
import { Constellation, ExplorerProfile } from '../types';
import { CONSTELLATIONS, STARGAZING_PROTOCOLS } from '../data/cosmicData';
import { StarAtlasCanvas } from '../components/StarAtlasCanvas';
import { BackButton } from '../components/BackButton';
import {
  Sparkles,
  Compass,
  Bookmark,
  BookmarkCheck,
  BookOpen,
  Calendar,
  Layers,
} from 'lucide-react';

interface StarPatternsPageProps {
  profile: ExplorerProfile;
  onToggleBookmark: (id: string) => void;
  onBack?: () => void;
}

export const StarPatternsPage: React.FC<StarPatternsPageProps> = ({
  profile,
  onToggleBookmark,
  onBack,
}) => {
  const [selectedConstellation, setSelectedConstellation] = useState<Constellation>(
    CONSTELLATIONS[0]
  );
  const [hemisphereFilter, setHemisphereFilter] = useState<string>('All');

  const filtered = CONSTELLATIONS.filter((c) => {
    if (hemisphereFilter === 'All') return true;
    return c.hemisphere.includes(hemisphereFilter);
  });

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-10 space-y-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/10 pb-8">
        <div className="space-y-2">
          {onBack && <BackButton onBack={onBack} label="Back" />}
          <div className="flex items-center gap-2 text-xs font-mono text-[#A78BFA] uppercase tracking-widest pt-1">
            <Sparkles className="w-4 h-4" />
            <span>Star Atlas Protocol · Constellations & Stellar Lore</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-extrabold font-headline text-white">
            Celestial Star Atlas
          </h1>
          <p className="text-[#94A3B8] text-sm max-w-2xl">
            Navigate ancient asterisms and celestial coordinates. Explore how civilizations across millennia mapped the night skies through myth, navigational guidance, and stellar geometry.
          </p>
        </div>

        {/* Selected Constellation Badge */}
        <div className="glass-card px-4 py-2.5 rounded-xl border border-white/10 flex items-center gap-3 text-xs font-mono">
          <div className="w-3 h-3 rounded-full bg-[#8B5CF6] shadow-[0_0_10px_#8B5CF6]" />
          <div>
            <p className="text-[#94A3B8]">ACTIVE ASTERISM</p>
            <p className="text-white font-bold text-sm">{selectedConstellation.name}</p>
          </div>
        </div>
      </div>

      {/* Main Interactive Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Interactive Star Canvas Visualizer */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between text-xs font-mono text-[#94A3B8]">
            <span>CELESTIAL SPHERE PROJECTION</span>
            <span>Hover stars for magnitude readings</span>
          </div>

          <StarAtlasCanvas constellation={selectedConstellation} />

          {/* Quick Stats Banner */}
          <div className="glass-card p-4 rounded-xl border border-white/10 flex flex-wrap items-center justify-between gap-4 text-xs font-mono">
            <div>
              <span className="text-[#94A3B8] block text-[10px]">MAJOR STARS</span>
              <span className="text-white font-bold">{selectedConstellation.majorStars.length} Key Anchor Stars</span>
            </div>
            <div>
              <span className="text-[#94A3B8] block text-[10px]">HEMISPHERE</span>
              <span className="text-[#5DA9FF] font-bold">{selectedConstellation.hemisphere}</span>
            </div>
            <div>
              <span className="text-[#94A3B8] block text-[10px]">PEAK OBSERVATION</span>
              <span className="text-[#A78BFA] font-bold">{selectedConstellation.visible.split('(')[0]}</span>
            </div>
          </div>
        </div>

        {/* Right Column: Detailed Lore & Astronomical Archives */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass-card rounded-2xl p-6 border border-white/10 shadow-xl space-y-5">
            <div className="flex items-start justify-between border-b border-white/10 pb-4">
              <div>
                <p className="text-xs font-mono text-[#A78BFA] uppercase tracking-wider">
                  {selectedConstellation.aka}
                </p>
                <h2 className="text-2xl font-bold font-headline text-white mt-0.5">
                  {selectedConstellation.name}
                </h2>
              </div>

              <button
                onClick={() => onToggleBookmark(selectedConstellation.id)}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-[#94A3B8] hover:text-[#5DA9FF] transition-colors border border-white/10"
                title="Bookmark Constellation"
              >
                {profile.bookmarkedIds.includes(selectedConstellation.id) ? (
                  <BookmarkCheck className="w-5 h-5 text-[#5DA9FF]" />
                ) : (
                  <Bookmark className="w-5 h-5" />
                )}
              </button>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <p className="text-xs font-mono uppercase text-[#94A3B8] flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-[#5DA9FF]" />
                <span>Astrophysical Details</span>
              </p>
              <p className="text-xs text-[#CBD5E1] leading-relaxed">
                {selectedConstellation.details}
              </p>
            </div>

            {/* Bright Stars List */}
            <div className="space-y-2 pt-2 border-t border-white/5">
              <p className="text-xs font-mono uppercase text-[#94A3B8] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#A78BFA]" />
                <span>Notable Stars</span>
              </p>
              <div className="flex flex-wrap gap-1.5">
                {selectedConstellation.stars.split(', ').map((star) => (
                  <span
                    key={star}
                    className="text-[11px] font-mono bg-white/5 text-[#E0E7FF] px-2.5 py-1 rounded-md border border-white/5"
                  >
                    {star}
                  </span>
                ))}
              </div>
            </div>

            {/* Cultural Mythology */}
            <div className="space-y-3 pt-2 border-t border-white/5">
              <p className="text-xs font-mono uppercase text-[#94A3B8] flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-[#34D399]" />
                <span>Cross-Cultural Mythology</span>
              </p>

              <div className="space-y-2 text-xs">
                <div className="p-3 rounded-lg bg-white/5 border border-white/5">
                  <span className="font-bold text-white block mb-0.5">Greco-Roman Tradition:</span>
                  <p className="text-[#94A3B8] text-[11px] leading-relaxed">
                    {selectedConstellation.mythologyCulture.greek}
                  </p>
                </div>

                <div className="p-3 rounded-lg bg-white/5 border border-white/5">
                  <span className="font-bold text-white block mb-0.5">Global & Indigenous Heritage:</span>
                  <p className="text-[#94A3B8] text-[11px] leading-relaxed">
                    {selectedConstellation.mythologyCulture.indigenousOrGlobal}
                  </p>
                </div>
              </div>
            </div>

            {/* Visibility Window */}
            <div className="p-3 rounded-xl bg-[#050816]/70 border border-white/10 text-xs font-mono flex items-center gap-2.5 text-[#94A3B8]">
              <Calendar className="w-4 h-4 text-[#5DA9FF] shrink-0" />
              <span>Visibility: {selectedConstellation.visible}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Constellation Selector Bar */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase tracking-wider text-[#94A3B8]">Filter Hemisphere:</span>
            <div className="flex items-center gap-1 bg-[#050816]/70 p-1 rounded-xl border border-white/10 text-xs">
              {['All', 'Northern', 'Southern', 'Equatorial'].map((h) => (
                <button
                  key={h}
                  onClick={() => setHemisphereFilter(h)}
                  className={`px-3 py-1 rounded-lg font-medium transition-colors ${
                    hemisphereFilter === h
                      ? 'bg-[#8B5CF6] text-white font-bold'
                      : 'text-[#94A3B8] hover:text-white'
                  }`}
                >
                  {h}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {filtered.map((item) => {
            const isSel = selectedConstellation.id === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setSelectedConstellation(item)}
                className={`p-4 rounded-xl border text-left transition-all ${
                  isSel
                    ? 'bg-[#8B5CF6]/20 border-[#8B5CF6] text-white shadow-[0_0_20px_rgba(139,92,246,0.25)]'
                    : 'glass-card text-[#94A3B8] hover:text-white hover:border-white/20'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <Sparkles className={`w-4 h-4 ${isSel ? 'text-[#8B5CF6]' : 'text-slate-500'}`} />
                  <span className="text-[10px] font-mono text-slate-400">{item.hemisphere.slice(0, 5)}</span>
                </div>
                <p className="font-bold text-sm font-headline truncate">{item.name}</p>
                <p className="text-[10px] text-slate-400 truncate mt-0.5">{item.aka}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Stargazing Protocols Section */}
      <div className="glass-card rounded-2xl p-6 lg:p-8 border border-white/10 shadow-xl space-y-6">
        <div className="flex items-center gap-2 text-xs font-mono text-[#5DA9FF] uppercase tracking-widest">
          <Compass className="w-4 h-4" />
          <span>Observational Methodology · Stargazing Protocol</span>
        </div>
        <h2 className="text-2xl font-bold font-headline text-white">
          Practical Stargazing Field Protocols
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {STARGAZING_PROTOCOLS.map((protocol, idx) => (
            <div
              key={protocol.title}
              className="p-5 rounded-xl bg-white/5 border border-white/10 space-y-2 text-xs"
            >
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-md bg-[#5DA9FF]/10 text-[#5DA9FF] font-mono font-bold flex items-center justify-center text-xs">
                  0{idx + 1}
                </span>
                <h3 className="font-bold text-white text-sm font-headline">{protocol.title}</h3>
              </div>
              <p className="text-[#94A3B8] leading-relaxed">{protocol.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
