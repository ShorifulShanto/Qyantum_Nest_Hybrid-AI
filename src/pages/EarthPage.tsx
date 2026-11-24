import React, { useState, useEffect } from 'react';
import { EpicImageItem, NasaMediaItem } from '../types';
import { BackButton } from '../components/BackButton';
import { EarthOrbitCanvas } from '../components/EarthOrbitCanvas';
import {
  Globe2,
  Shield,
  Thermometer,
  Droplets,
  Wind,
  Activity,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  PlayCircle,
} from 'lucide-react';

interface EarthPageProps {
  onBack?: () => void;
}

export const EarthPage: React.FC<EarthPageProps> = ({ onBack }) => {
  const [epicFrames, setEpicFrames] = useState<EpicImageItem[]>([
    {
      identifier: '20261121004555',
      caption: 'NASA EPIC camera onboard the NOAA DSCOVR spacecraft at Lagrange Point L1',
      date: '2026-11-21 00:45 UTC',
      imageUrl: 'https://epic.gsfc.nasa.gov/archive/natural/2026/11/21/jpg/epic_1b_20261121004555.jpg',
      centroid: { lat: -16.72, lon: 156.91 },
      dscovrDistanceKm: 1412890,
    },
  ]);
  const [activeFrameIdx, setActiveFrameIdx] = useState<number>(0);
  const [earthMedia, setEarthMedia] = useState<NasaMediaItem[]>([]);

  useEffect(() => {
    let active = true;
    fetch('/api/nasa/epic')
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (active && Array.isArray(data?.frames) && data.frames.length > 0) {
          setEpicFrames(data.frames);
          setActiveFrameIdx(0);
        }
      })
      .catch(() => {
        // keep initial verified frame
      });

    fetch('/api/nasa/media?q=earth+from+iss&media_type=video,image&limit=4')
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (active && Array.isArray(data?.items)) {
          setEarthMedia(data.items);
        }
      })
      .catch(() => {
        // non-fatal
      });

    return () => {
      active = false;
    };
  }, []);

  const currentFrame = epicFrames[activeFrameIdx] || epicFrames[0];

  const atmosphericGases = [
    { name: 'Nitrogen (N₂)', pct: '78.08%', color: '#38BDF8', desc: 'Inert atmospheric backbone preventing rapid combustion.' },
    { name: 'Oxygen (O₂)', pct: '20.95%', color: '#34D399', desc: 'Maintained by aerobic photosynthetic biosphere activity.' },
    { name: 'Argon (Ar)', pct: '0.93%', color: '#A78BFA', desc: 'Noble gas accumulated from radioactive potassium-40 decay.' },
    { name: 'Carbon Dioxide & Trace (CO₂)', pct: '0.04%', color: '#FBBF24', desc: 'Crucial greenhouse gas regulating planetary thermal equilibrium.' },
  ];

  const waterDistribution = [
    { source: 'Saline Oceans', pct: '97.2%', volume: '1.338 billion km³' },
    { source: 'Glaciers & Ice Sheets', pct: '2.15%', volume: '29.3 million km³' },
    { source: 'Subsurface Groundwater', pct: '0.62%', volume: '8.4 million km³' },
    { source: 'Surface Lakes & Rivers', pct: '0.03%', volume: '190,000 km³' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-10 space-y-12">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/10 pb-8">
        <div className="space-y-2">
          {onBack && <BackButton onBack={onBack} label="Back" />}
          <div className="flex items-center gap-2 text-xs font-mono text-[#38BDF8] uppercase tracking-widest pt-1">
            <Globe2 className="w-4 h-4" />
            <span>Planetary Health & Geodynamics · NASA DSCOVR EPIC</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-extrabold font-headline text-white">
            Earth Insights
          </h1>
          <p className="text-[#94A3B8] text-sm max-w-2xl">
            Live sunlit full-disk observations from NASA’s EPIC camera aboard DSCOVR at the Sun-Earth L1 Lagrange point, paired with geodynamic and atmospheric telemetry.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <div className="glass-card px-4 py-2 rounded-xl border border-white/10 text-xs font-mono">
            <span className="text-[#94A3B8] block text-[10px]">AXIAL TILT</span>
            <span className="text-white font-bold tabular-nums">23.44°</span>
          </div>
          <div className="glass-card px-4 py-2 rounded-xl border border-white/10 text-xs font-mono">
            <span className="text-[#94A3B8] block text-[10px]">ROTATION</span>
            <span className="text-[#38BDF8] font-bold tabular-nums">23h 56m 04s</span>
          </div>
          <a
            href="https://eyes.nasa.gov/apps/solar-system/#/earth"
            target="_blank"
            rel="noreferrer"
            className="px-3.5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-[#38BDF8] flex items-center gap-1.5 whitespace-nowrap shrink-0 transition-colors"
          >
            <span>Earth in JPL 3D Eyes</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Interactive 2D Earth Geodynamic & Magnetosphere Animation */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-xs font-mono text-[#38BDF8] uppercase tracking-wider mb-1">
              Interactive 2D Planetary Model
            </p>
            <h2 className="text-2xl font-bold font-headline text-white">
              2D Earth Rotation, Solar Wind & Orbital Simulation
            </h2>
          </div>
          <span className="text-xs font-mono text-[#94A3B8]">
            Toggle magnetosphere, solar wind, and ISS/Lunar orbits below
          </span>
        </div>
        <EarthOrbitCanvas />
      </div>

      {/* Hero Visual Section: Live DSCOVR EPIC Full-Disk & Core Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left: Live NASA DSCOVR EPIC Visual + Frame Scrubber */}
        <div className="lg:col-span-6 relative aspect-square rounded-3xl overflow-hidden glass-card border border-white/15 shadow-[0_0_50px_rgba(56,189,248,0.15)] group bg-black">
          <img
            src={currentFrame.imageUrl}
            alt={`Earth from DSCOVR EPIC - ${currentFrame.date}`}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                'https://epic.gsfc.nasa.gov/archive/natural/2026/11/21/jpg/epic_1b_20261121004555.jpg';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050816] via-[#050816]/25 to-transparent opacity-90" />

          <div className="absolute bottom-5 left-5 right-5 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="text-[11px] font-mono text-[#38BDF8] tabular-nums">
                NASA DSCOVR EPIC · {currentFrame.date}
              </div>
              {epicFrames.length > 1 && (
                <div className="flex items-center gap-1.5 bg-[#050816]/85 border border-white/15 rounded-lg px-2 py-1">
                  <button
                    onClick={() =>
                      setActiveFrameIdx((i) => (i - 1 + epicFrames.length) % epicFrames.length)
                    }
                    className="p-1 hover:text-white text-[#94A3B8]"
                    title="Previous Capture"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-[11px] font-mono text-white tabular-nums px-1">
                    {activeFrameIdx + 1} / {epicFrames.length}
                  </span>
                  <button
                    onClick={() => setActiveFrameIdx((i) => (i + 1) % epicFrames.length)}
                    className="p-1 hover:text-white text-[#94A3B8]"
                    title="Next Capture"
                  >
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
            <h3 className="text-2xl font-bold font-headline text-white">
              Sunlit Earth from Lagrange Point L1
            </h3>
            <p className="text-xs text-[#CBD5E1] font-mono tabular-nums">
              Sub-solar coordinates: {currentFrame.centroid.lat}°, {currentFrame.centroid.lon}°
              {currentFrame.dscovrDistanceKm
                ? ` · Distance: ${currentFrame.dscovrDistanceKm.toLocaleString()} km`
                : ''}
            </p>
          </div>
        </div>

        {/* Right: Key Planetary Telemetry Metrics */}
        <div className="lg:col-span-6 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="glass-card p-5 rounded-2xl border border-white/10 space-y-2">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                <Thermometer className="w-5 h-5" />
              </div>
              <p className="text-xs font-mono text-[#94A3B8] uppercase">Global Mean Temp</p>
              <p className="text-3xl font-extrabold font-mono text-white tabular-nums">14.9°C</p>
              <p className="text-xs text-[#94A3B8]">
                Maintained by natural greenhouse gas heat retention.
              </p>
            </div>

            <div className="glass-card p-5 rounded-2xl border border-white/10 space-y-2">
              <div className="w-10 h-10 rounded-xl bg-[#5DA9FF]/10 border border-[#5DA9FF]/20 flex items-center justify-center text-[#5DA9FF]">
                <Shield className="w-5 h-5" />
              </div>
              <p className="text-xs font-mono text-[#94A3B8] uppercase">Geomagnetic Shield</p>
              <p className="text-3xl font-extrabold font-mono text-emerald-400 tabular-nums">Active</p>
              <p className="text-xs text-[#94A3B8]">
                Molten outer iron core geodynamo shielding solar wind.
              </p>
            </div>

            <div className="glass-card p-5 rounded-2xl border border-white/10 space-y-2">
              <div className="w-10 h-10 rounded-xl bg-[#34D399]/10 border border-[#34D399]/20 flex items-center justify-center text-[#34D399]">
                <Droplets className="w-5 h-5" />
              </div>
              <p className="text-xs font-mono text-[#94A3B8] uppercase">Hydrosphere Coverage</p>
              <p className="text-3xl font-extrabold font-mono text-white tabular-nums">70.8%</p>
              <p className="text-xs text-[#94A3B8]">361 million km² liquid ocean surface area.</p>
            </div>

            <div className="glass-card p-5 rounded-2xl border border-white/10 space-y-2">
              <div className="w-10 h-10 rounded-xl bg-[#A78BFA]/10 border border-[#A78BFA]/20 flex items-center justify-center text-[#A78BFA]">
                <Activity className="w-5 h-5" />
              </div>
              <p className="text-xs font-mono text-[#94A3B8] uppercase">Surface Pressure</p>
              <p className="text-3xl font-extrabold font-mono text-white tabular-nums">1013.25 hPa</p>
              <p className="text-xs text-[#94A3B8]">Standard mean sea level atmospheric pressure.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Live NASA Earth Observation Videos & Imagery */}
      {earthMedia.length > 0 && (
        <div className="space-y-4">
          <div>
            <p className="text-xs font-mono text-[#38BDF8] uppercase tracking-wider mb-1">
              ISS & Earth Science Media Feed
            </p>
            <h2 className="text-2xl font-bold font-headline text-white">
              Orbital Earth Videos & Imagery
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {earthMedia.map((item) => (
              <div
                key={item.nasaId}
                className="glass-card rounded-2xl overflow-hidden border border-white/10 flex flex-col justify-between"
              >
                <div className="aspect-video bg-black">
                  {item.mediaType === 'video' && item.mediaUrl?.endsWith('.mp4') ? (
                    <video
                      controls
                      preload="metadata"
                      poster={item.thumbUrl}
                      className="w-full h-full object-cover"
                    >
                      <source src={item.mediaUrl} type="video/mp4" />
                    </video>
                  ) : (
                    <img
                      src={item.thumbUrl || item.mediaUrl}
                      alt={item.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                <div className="p-4 space-y-1.5">
                  <div className="flex items-center gap-1.5 text-[10px] font-mono text-[#38BDF8]">
                    <PlayCircle className="w-3.5 h-3.5" />
                    <span>{item.mediaType.toUpperCase()}</span>
                    <span>·</span>
                    <span>{item.dateCreated}</span>
                  </div>
                  <h3 className="text-xs font-bold text-white line-clamp-2">{item.title}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Atmospheric Composition Breakdown */}
      <div className="glass-card rounded-2xl p-6 lg:p-8 border border-white/10 space-y-6 shadow-2xl">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-[#38BDF8] uppercase tracking-wider mb-1">
              <Wind className="w-4 h-4" />
              <span>Chemical Spectrometry</span>
            </div>
            <h2 className="text-2xl font-bold font-headline text-white">
              Atmospheric Composition (Dry Air at Sea Level)
            </h2>
          </div>
          <span className="text-xs font-mono text-[#94A3B8] hidden sm:inline">
            Troposphere to Exosphere
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {atmosphericGases.map((gas) => (
            <div
              key={gas.name}
              className="p-5 rounded-xl bg-white/5 border border-white/10 space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-[#94A3B8]">{gas.name}</span>
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: gas.color }} />
              </div>
              <p className="text-3xl font-extrabold font-mono text-white tabular-nums">{gas.pct}</p>
              <p className="text-xs text-[#94A3B8] leading-relaxed">{gas.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Hydrosphere & Water Distribution */}
      <div className="glass-card rounded-2xl p-6 lg:p-8 border border-white/10 space-y-6 shadow-2xl">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-[#34D399] uppercase tracking-wider mb-1">
              <Droplets className="w-4 h-4" />
              <span>Global Hydrological Cycle</span>
            </div>
            <h2 className="text-2xl font-bold font-headline text-white">
              Hydrosphere Water Distribution
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {waterDistribution.map((item) => (
            <div
              key={item.source}
              className="p-5 rounded-xl bg-white/5 border border-white/10 space-y-2"
            >
              <p className="text-xs font-mono text-[#94A3B8] uppercase">{item.source}</p>
              <p className="text-2xl font-extrabold font-mono text-[#38BDF8] tabular-nums">
                {item.pct}
              </p>
              <p className="text-xs text-[#94A3B8] font-mono tabular-nums">{item.volume}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Historical Apollo 8 Earthrise Banner */}
      <div className="relative rounded-3xl overflow-hidden glass-card border border-white/15 p-8 lg:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="space-y-4 max-w-xl z-10">
          <span className="text-xs font-mono text-[#A78BFA] uppercase tracking-wider">
            Apollo 8 Mission · 1968
          </span>
          <h2 className="text-3xl font-extrabold font-headline text-white">
            "We came all this way to explore the Moon, and the most important thing is that we discovered the Earth."
          </h2>
          <p className="text-xs text-[#CBD5E1] leading-relaxed">
            Bill Anders’ famous Earthrise photograph reshaped humanity's perception of our fragile, borderless oasis suspended in the cosmic void.
          </p>
        </div>

        <div className="w-full md:w-80 aspect-[4/3] rounded-2xl overflow-hidden border border-white/10 shrink-0 shadow-2xl bg-black">
          <img
            src="https://images-assets.nasa.gov/image/GSFC_20171208_Archive_e001282/GSFC_20171208_Archive_e001282~small.jpg"
            alt="Apollo 8 Earthrise NASA Visualization"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
};
