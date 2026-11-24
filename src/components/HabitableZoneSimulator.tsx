import React, { useState } from 'react';
import { Exoplanet } from '../types';
import { EXOPLANETS } from '../data/cosmicData';
import { Compass, Flame, Droplets, Snowflake } from 'lucide-react';

interface HabitableZoneSimulatorProps {
  onSelectExoplanet?: (planet: Exoplanet) => void;
}

export const HabitableZoneSimulator: React.FC<HabitableZoneSimulatorProps> = ({
  onSelectExoplanet,
}) => {
  const [selectedPlanetId, setSelectedPlanetId] = useState<string>('trappist-1e');
  const [starClass, setStarClass] = useState<'M' | 'K' | 'G' | 'F'>('M');
  const [customDistanceAU, setCustomDistanceAU] = useState<number>(0.029);

  const selectedPlanet = EXOPLANETS.find((p) => p.id === selectedPlanetId) || EXOPLANETS[0];

  // Stellar luminosity and Habitable Zone calculation in AU
  const starParams = {
    M: { name: 'M-Dwarf (Red Dwarf)', temp: 3000, lum: 0.005, color: '#EF4444', hzInner: 0.04, hzOuter: 0.12 },
    K: { name: 'K-Dwarf (Orange Dwarf)', temp: 4500, lum: 0.25, color: '#F97316', hzInner: 0.45, hzOuter: 0.95 },
    G: { name: 'G-Type (Yellow Dwarf - Sun)', temp: 5800, lum: 1.0, color: '#FBBF24', hzInner: 0.95, hzOuter: 1.45 },
    F: { name: 'F-Type (Hot White-Yellow)', temp: 7200, lum: 3.5, color: '#E0E7FF', hzInner: 1.6, hzOuter: 2.7 },
  }[starClass];

  // Determine zone of current orbital distance
  let currentZone: 'Too Hot' | 'Optimal Habitable' | 'Too Cold' = 'Optimal Habitable';
  if (customDistanceAU < starParams.hzInner) {
    currentZone = 'Too Hot';
  } else if (customDistanceAU > starParams.hzOuter) {
    currentZone = 'Too Cold';
  }

  // Calculated surface equilibrium temperature
  // T_eq = T_star * (R_star / 2D)^0.5 * (1 - albedo)^0.25
  const eqTempKelvin = Math.round(
    278 * Math.pow(starParams.lum, 0.25) * Math.pow(1 / Math.max(0.01, customDistanceAU), 0.5)
  );
  const eqTempCelsius = eqTempKelvin - 273;

  // Real-time ESI approximation based on temperature delta from 288K
  const esiScore = Math.max(
    0.1,
    Math.min(0.99, 1 - Math.abs(eqTempKelvin - 288) / 288 * 0.7)
  ).toFixed(2);

  const handleSelectPlanetPreset = (planet: Exoplanet) => {
    setSelectedPlanetId(planet.id);
    setStarClass(planet.starType);
    setCustomDistanceAU(planet.semiMajorAxisAU);
    onSelectExoplanet?.(planet);
  };

  return (
    <div className="w-full glass-card rounded-2xl p-6 lg:p-8 border border-white/10 shadow-2xl space-y-8">
      {/* Header & Protocol Overview */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#5DA9FF] uppercase tracking-widest mb-1.5">
            <Compass className="w-4 h-4" />
            <span>PROTOCOL GOLDILOCKS · CIRCUMSTELLAR ORBIT MODEL</span>
          </div>
          <h2 className="text-2xl lg:text-3xl font-bold font-headline text-white">
            Habitable Zone Dynamic Simulator
          </h2>
        </div>

        {/* Star Spectral Selector */}
        <div className="flex items-center gap-1.5 bg-[#050816]/70 p-1.5 rounded-xl border border-white/10 text-xs">
          {(['M', 'K', 'G', 'F'] as const).map((s) => (
            <button
              key={s}
              onClick={() => {
                setStarClass(s);
                if (s === 'M') setCustomDistanceAU(0.06);
                else if (s === 'K') setCustomDistanceAU(0.65);
                else if (s === 'G') setCustomDistanceAU(1.0);
                else setCustomDistanceAU(2.1);
              }}
              className={`px-3 py-1.5 rounded-lg font-mono font-medium transition-colors ${
                starClass === s
                  ? 'bg-[#5DA9FF] text-[#050816] font-bold shadow-md'
                  : 'text-[#94A3B8] hover:text-white'
              }`}
            >
              Class {s}
            </button>
          ))}
        </div>
      </div>

      {/* Orbit Visualization Band */}
      <div className="relative bg-[#050816] rounded-2xl p-6 border border-white/10 overflow-hidden">
        {/* Stellar details banner */}
        <div className="flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-[#94A3B8] mb-6">
          <div className="flex items-center gap-2">
            <span
              className="w-3.5 h-3.5 rounded-full inline-block shadow-md"
              style={{ backgroundColor: starParams.color }}
            />
            <span className="text-white font-medium">{starParams.name}</span>
            <span className="text-white/20">|</span>
            <span>T_eff: {starParams.temp} K</span>
            <span className="text-white/20">|</span>
            <span>Luminosity: {starParams.lum} L☉</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 text-rose-400">
              <Flame className="w-3.5 h-3.5" /> Too Hot
            </span>
            <span className="flex items-center gap-1 text-emerald-400 font-semibold">
              <Droplets className="w-3.5 h-3.5" /> Optimal (Liquid H₂O)
            </span>
            <span className="flex items-center gap-1 text-cyan-400">
              <Snowflake className="w-3.5 h-3.5" /> Too Cold
            </span>
          </div>
        </div>

        {/* Orbit Distance Bar Representation */}
        <div className="relative h-20 w-full rounded-xl bg-slate-950/80 border border-white/10 flex items-center px-4 overflow-hidden">
          {/* Star Node at left */}
          <div
            className="w-8 h-8 rounded-full shrink-0 shadow-lg relative z-10"
            style={{
              backgroundColor: starParams.color,
              boxShadow: `0 0 25px ${starParams.color}`,
            }}
          />

          {/* Zones Track */}
          <div className="relative flex-1 h-10 ml-4 rounded-lg overflow-hidden flex">
            {/* Zone 1: Too Hot (Inner boundary) */}
            <div
              className="h-full bg-gradient-to-r from-rose-950/60 to-rose-900/30 border-r border-rose-500/30 flex items-center justify-center text-[10px] font-mono text-rose-300 font-bold tracking-wider"
              style={{ width: '28%' }}
            >
              TOO HOT
            </div>

            {/* Zone 2: Habitable Goldilocks Zone */}
            <div
              className="h-full bg-gradient-to-r from-emerald-950/70 via-emerald-900/50 to-emerald-950/70 border-r border-emerald-400/40 flex items-center justify-center text-[11px] font-mono text-emerald-300 font-bold tracking-widest shadow-inner"
              style={{ width: '42%' }}
            >
              GOLDILOCKS ZONE
            </div>

            {/* Zone 3: Too Cold (Outer boundary) */}
            <div
              className="h-full bg-gradient-to-r from-cyan-950/40 to-slate-900/60 flex items-center justify-center text-[10px] font-mono text-cyan-300 font-bold tracking-wider"
              style={{ width: '30%' }}
            >
              TOO COLD (FROST LINE)
            </div>

            {/* Current Planet Indicator on the bar */}
            {(() => {
              // Calculate percent on bar based on current AU vs star outer AU
              const maxDisplayAU = starParams.hzOuter * 1.5;
              const pct = Math.min(95, Math.max(5, (customDistanceAU / maxDisplayAU) * 100));
              return (
                <div
                  className="absolute top-0 bottom-0 w-2.5 bg-white shadow-[0_0_15px_#FFFFFF] rounded transition-all duration-150 flex flex-col items-center justify-center pointer-events-none"
                  style={{ left: `${pct}%`, transform: 'translateX(-50%)' }}
                >
                  <div className="absolute -top-6 bg-[#5DA9FF] text-[#050816] text-[10px] font-mono font-bold px-2 py-0.5 rounded shadow">
                    {customDistanceAU.toFixed(3)} AU
                  </div>
                </div>
              );
            })()}
          </div>
        </div>

        {/* Orbit Distance Slider */}
        <div className="mt-6 flex flex-col sm:flex-row items-center gap-4">
          <label className="text-xs font-mono text-[#94A3B8] whitespace-nowrap">
            Orbital Distance (Semi-Major Axis):
          </label>
          <input
            type="range"
            min={starClass === 'M' ? 0.01 : 0.1}
            max={starClass === 'M' ? 0.25 : starClass === 'K' ? 1.8 : 3.5}
            step={starClass === 'M' ? 0.002 : 0.02}
            value={customDistanceAU}
            onChange={(e) => setCustomDistanceAU(parseFloat(e.target.value))}
            className="w-full accent-[#5DA9FF] h-2 bg-slate-800 rounded-lg cursor-pointer"
          />
          <span className="font-mono text-sm font-bold text-white min-w-[70px] text-right tabular-nums">
            {customDistanceAU.toFixed(3)} AU
          </span>
        </div>
      </div>

      {/* Live Telemetry KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-1">
          <p className="text-[11px] font-mono text-[#94A3B8] uppercase">Zone Classification</p>
          <div className="flex items-center gap-2">
            <span
              className={`text-lg font-bold font-headline ${
                currentZone === 'Optimal Habitable'
                  ? 'text-emerald-400'
                  : currentZone === 'Too Hot'
                  ? 'text-rose-400'
                  : 'text-cyan-400'
              }`}
            >
              {currentZone}
            </span>
          </div>
          <p className="text-xs text-[#94A3B8]">
            {currentZone === 'Optimal Habitable'
              ? 'Liquid surface water thermodynamically supported.'
              : currentZone === 'Too Hot'
              ? 'Runaway greenhouse vapor dissipation risk.'
              : 'Permanent glacial freezing of volatiles.'}
          </p>
        </div>

        <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-1">
          <p className="text-[11px] font-mono text-[#94A3B8] uppercase">Equilibrium Temp</p>
          <p className="text-2xl font-bold font-mono text-white tabular-nums">
            {eqTempCelsius}°C <span className="text-xs text-[#94A3B8] font-normal font-sans">({eqTempKelvin} K)</span>
          </p>
          <p className="text-xs text-[#94A3B8]">Earth baseline: 14.9°C (288 K)</p>
        </div>

        <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-1">
          <p className="text-[11px] font-mono text-[#94A3B8] uppercase">Earth Similarity (ESI)</p>
          <p className="text-2xl font-bold font-mono text-[#5DA9FF] tabular-nums">{esiScore}</p>
          <p className="text-xs text-[#94A3B8]">Scale: 0.00 (Void) to 1.00 (Exact Earth)</p>
        </div>

        <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-1">
          <p className="text-[11px] font-mono text-[#94A3B8] uppercase">Water Phase Status</p>
          <p className="text-lg font-bold font-headline text-[#F8FAFC]">
            {currentZone === 'Optimal Habitable' ? 'Liquid Hydrosphere' : currentZone === 'Too Hot' ? 'Superheated Steam' : 'Solid Cryosphere'}
          </p>
          <p className="text-xs text-[#94A3B8]">Based on 1 atm equivalent pressure</p>
        </div>
      </div>

      {/* Confirmed Exoplanet Quick Presets */}
      <div>
        <p className="text-xs font-mono text-[#94A3B8] uppercase tracking-wider mb-3">
          Load Confirmed Exoplanet Parameters:
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
          {EXOPLANETS.map((planet) => {
            const isSel = selectedPlanet.id === planet.id;
            return (
              <button
                key={planet.id}
                onClick={() => handleSelectPlanetPreset(planet)}
                className={`p-3 rounded-xl border text-left transition-all ${
                  isSel
                    ? 'bg-[#5DA9FF]/15 border-[#5DA9FF] text-white shadow-[0_0_15px_rgba(93,169,255,0.2)]'
                    : 'bg-white/5 border-white/10 text-[#94A3B8] hover:text-white hover:bg-white/10'
                }`}
              >
                <p className="font-bold text-xs font-headline truncate">{planet.name}</p>
                <p className="text-[10px] font-mono text-[#5DA9FF] mt-0.5">ESI {planet.hzIndex}</p>
                <p className="text-[10px] text-slate-400 mt-0.5">{planet.dist}</p>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
