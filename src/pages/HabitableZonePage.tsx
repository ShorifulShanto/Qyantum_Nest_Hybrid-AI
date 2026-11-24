import React, { useState } from 'react';
import { Exoplanet, ExplorerProfile } from '../types';
import { EXOPLANETS } from '../data/cosmicData';
import { HabitableZoneSimulator } from '../components/HabitableZoneSimulator';
import { BackButton } from '../components/BackButton';
import {
  Compass,
  Bookmark,
  BookmarkCheck,
  Info,
} from 'lucide-react';

interface HabitableZonePageProps {
  profile: ExplorerProfile;
  onToggleBookmark: (id: string) => void;
  onBack?: () => void;
}

export const HabitableZonePage: React.FC<HabitableZonePageProps> = ({
  profile,
  onToggleBookmark,
  onBack,
}) => {
  const [selectedPlanet, setSelectedPlanet] = useState<Exoplanet>(EXOPLANETS[1]); // TRAPPIST-1e
  const [formulaOpen, setFormulaOpen] = useState<boolean>(false);

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-10 space-y-12">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/10 pb-8">
        <div className="space-y-2">
          {onBack && <BackButton onBack={onBack} label="Back" />}
          <div className="flex items-center gap-2 text-xs font-mono text-[#34D399] uppercase tracking-widest pt-1">
            <Compass className="w-4 h-4" />
            <span>Protocol Goldilocks · Circumstellar Habitable Zone</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-extrabold font-headline text-white">
            The Habitable Zone & Exoplanets
          </h1>
          <p className="text-[#94A3B8] text-sm max-w-2xl">
            Analyze the orbital distance from a host star where atmospheric pressure allows liquid water to pool on a rocky planet’s surface—the primary prerequisite for life as we know it.
          </p>
        </div>

        <button
          onClick={() => setFormulaOpen(!formulaOpen)}
          className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-mono flex items-center gap-2 transition-colors self-start md:self-auto"
        >
          <Info className="w-4 h-4 text-[#5DA9FF]" />
          <span>ESI Formula Breakdown</span>
        </button>
      </div>

      {/* Formula Explanation if toggled */}
      {formulaOpen && (
        <div className="glass-card rounded-2xl p-6 lg:p-8 border border-white/10 space-y-4 animate-in fade-in duration-200 text-xs">
          <p className="font-mono text-[#5DA9FF] uppercase tracking-wider text-[11px]">
            Earth Similarity Index (ESI) Mathematical Formulation
          </p>
          <p className="text-[#CBD5E1] leading-relaxed">
            The Earth Similarity Index (ESI) is a geometric mean that compares a planet’s physical parameters (mean radius, bulk density, escape velocity, and surface temperature) to Earth. An ESI of 1.0 represents Earth itself. Planets with an ESI ≥ 0.80 are classified as terrestrial analogs capable of supporting complex hydrologic cycles.
          </p>
          <div className="p-3 bg-black/40 rounded-xl font-mono text-[#34D399] border border-white/5">
            ESI = ∏ [1 - |(x_i - x_i0) / (x_i + x_i0)|^w_i]
          </div>
        </div>
      )}

      {/* Interactive Simulator Component */}
      <HabitableZoneSimulator onSelectExoplanet={(p) => setSelectedPlanet(p)} />

      {/* Exoplanet Archive Table & Catalog */}
      <div className="space-y-6">
        <div>
          <p className="text-xs font-mono text-[#5DA9FF] uppercase tracking-wider mb-1">
            Confirmed Terrestrial Analogs
          </p>
          <h2 className="text-2xl lg:text-3xl font-bold font-headline text-white">
            Exoplanet Archive Dossier
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {EXOPLANETS.map((planet) => {
            const isSelected = selectedPlanet.id === planet.id;
            const isBookmarked = profile.bookmarkedIds.includes(planet.id);

            return (
              <div
                key={planet.id}
                onClick={() => setSelectedPlanet(planet)}
                className={`glass-card-interactive rounded-2xl p-6 border flex flex-col justify-between cursor-pointer ${
                  isSelected
                    ? 'border-[#34D399] shadow-[0_0_25px_rgba(52,211,153,0.2)] bg-[#0B152A]'
                    : 'border-white/10'
                }`}
              >
                <div className="space-y-4">
                  {/* Card Header */}
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-[#34D399] bg-[#34D399]/10 px-2.5 py-1 rounded-md border border-[#34D399]/20 font-bold">
                      ESI {planet.hzIndex}
                    </span>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleBookmark(planet.id);
                      }}
                      className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-[#94A3B8] hover:text-[#5DA9FF] transition-colors"
                      title={isBookmarked ? 'Remove Bookmark' : 'Bookmark Exoplanet'}
                    >
                      {isBookmarked ? (
                        <BookmarkCheck className="w-4 h-4 text-[#5DA9FF]" />
                      ) : (
                        <Bookmark className="w-4 h-4" />
                      )}
                    </button>
                  </div>

                  {/* Planet Name & Star */}
                  <div>
                    <h3 className="text-xl font-bold font-headline text-white mb-0.5">
                      {planet.name}
                    </h3>
                    <p className="text-[11px] font-mono text-[#94A3B8]">{planet.star}</p>
                  </div>

                  {/* Notes / Biosignature */}
                  <p className="text-xs text-[#CBD5E1] leading-relaxed line-clamp-3">
                    {planet.notes}
                  </p>

                  {/* Astrophysical Specs */}
                  <div className="grid grid-cols-2 gap-2 pt-3 border-t border-white/5 font-mono text-[11px]">
                    <div>
                      <span className="text-[#94A3B8] block text-[10px]">DISTANCE</span>
                      <span className="text-white font-bold">{planet.dist}</span>
                    </div>
                    <div>
                      <span className="text-[#94A3B8] block text-[10px]">EST. TEMP</span>
                      <span className="text-white font-bold">{planet.temp}</span>
                    </div>
                    <div>
                      <span className="text-[#94A3B8] block text-[10px]">ORBIT PERIOD</span>
                      <span className="text-white font-bold">{planet.orbitalPeriodDays} days</span>
                    </div>
                    <div>
                      <span className="text-[#94A3B8] block text-[10px]">WATER POTENTIAL</span>
                      <span className="text-[#34D399] font-bold">{planet.potentialWater}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/5 mt-4">
                  <span className="text-[10px] font-mono uppercase text-[#94A3B8] block">
                    HABITABILITY RATING: {planet.habitabilityScore}/100
                  </span>
                  <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden mt-1.5">
                    <div
                      className="h-full bg-gradient-to-r from-[#5DA9FF] to-[#34D399] rounded-full"
                      style={{ width: `${planet.habitabilityScore}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
