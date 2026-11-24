import React, { useState, useEffect } from 'react';
import { Search, Sparkles, AlertTriangle, Zap, Loader2, Film, PlayCircle, ExternalLink } from 'lucide-react';
import { NearEarthObject, SpaceWeatherEvent, NasaMediaItem } from '../types';
import { SMALL_BODIES } from '../data/cosmicData';
import { BackButton } from '../components/BackButton';

interface CosmicSearchPageProps {
  onBack?: () => void;
}

export const CosmicSearchPage: React.FC<CosmicSearchPageProps> = ({ onBack }) => {
  const [query, setQuery] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [mediaLoading, setMediaLoading] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'all' | 'analysis' | 'media' | 'asteroids' | 'weather'>(
    'all'
  );

  const [analysisText, setAnalysisText] = useState<string | null>(
    'The cosmos contains an estimated 2 trillion galaxies across the observable universe. Deep space observations from the James Webb Space Telescope (JWST) have revealed ancient protogalaxies dating back to just 300 million years following the Big Bang, expanding our understanding of stellar birth, cosmic dust synthesis, and black hole seeds.'
  );

  const [mediaItems, setMediaItems] = useState<NasaMediaItem[]>([]);
  const [asteroids, setAsteroids] = useState<NearEarthObject[]>([]);
  const [weatherEvents, setWeatherEvents] = useState<SpaceWeatherEvent[]>([]);

  // Initial load of live NASA NeoWs, DONKI, and NASA Image & Video Library
  useEffect(() => {
    let active = true;

    fetch('/api/nasa/asteroids')
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (active && Array.isArray(data?.asteroids)) {
          setAsteroids(data.asteroids);
        }
      })
      .catch(() => {
        // non-fatal
      });

    fetch('/api/nasa/weather')
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (active && Array.isArray(data?.events)) {
          setWeatherEvents(data.events);
        }
      })
      .catch(() => {
        // non-fatal
      });

    setMediaLoading(true);
    fetch('/api/nasa/media?q=james+webb+nebula&media_type=video,image&limit=6')
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (active && Array.isArray(data?.items)) {
          setMediaItems(data.items);
        }
      })
      .catch(() => {
        // non-fatal
      })
      .finally(() => {
        if (active) setMediaLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const quickQueries = [
    'Black Holes & Singularity',
    'Near-Earth Asteroids',
    'James Webb Deep Field',
    'Solar Flares & Space Weather',
    'TRAPPIST-1 Exoplanets',
    'Voyager 1 Interstellar',
  ];

  const handleSearch = async (targetQuery?: string) => {
    const q = targetQuery !== undefined ? targetQuery : query;
    if (!q.trim()) return;

    setLoading(true);
    setMediaLoading(true);

    try {
      const [searchRes, mediaRes] = await Promise.allSettled([
        fetch('/api/cosmic-search', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query: q }),
        }),
        fetch(`/api/nasa/media?q=${encodeURIComponent(q)}&media_type=video,image&limit=6`),
      ]);

      if (searchRes.status === 'fulfilled' && searchRes.value.ok) {
        const data = await searchRes.value.json();
        if (data.analysis) setAnalysisText(data.analysis);
      } else {
        generateFallbackResponse(q);
      }

      if (mediaRes.status === 'fulfilled' && mediaRes.value.ok) {
        const mData = await mediaRes.value.json();
        if (Array.isArray(mData?.items)) {
          setMediaItems(mData.items);
        }
      }
    } catch {
      generateFallbackResponse(q);
    } finally {
      setLoading(false);
      setMediaLoading(false);
    }
  };

  const generateFallbackResponse = (q: string) => {
    const lower = q.toLowerCase();
    if (lower.includes('black hole')) {
      setAnalysisText(
        `Black holes are regions of spacetime where gravity is so strong that nothing—not even particles or light—can escape. Supermassive black holes, such as Sagittarius A* at the center of the Milky Way (4.1 million solar masses) and M87* (6.5 billion solar masses), shape galaxy evolution through relativistic jet outflows and accretion discs.`
      );
    } else if (lower.includes('asteroid') || lower.includes('meteor')) {
      setAnalysisText(
        `Near-Earth Objects (NEOs) are comets and asteroids whose orbits bring them within 1.3 AU of the Sun. NASA's Center for Near-Earth Object Studies (CNEOS) continually tracks over 34,000 cataloged asteroids via optical and radar surveys.`
      );
    } else if (lower.includes('solar') || lower.includes('flare') || lower.includes('weather')) {
      setAnalysisText(
        `Space weather tracks variations across the heliosphere between the Sun and Earth. Solar flares emit X-rays and extreme UV radiation at light speed, while Coronal Mass Ejections (CMEs) carry magnetized plasma across interplanetary space.`
      );
    } else {
      setAnalysisText(
        `Deep space archival query for "${q}": Multi-wavelength NASA observatories catalog spectroscopic redshifts, stellar nucleosynthesis, and planetary surface composition across the solar system and deep extragalactic fields.`
      );
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-10 space-y-12">
      {onBack && (
        <div>
          <BackButton onBack={onBack} label="Back" />
        </div>
      )}

      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 text-xs font-mono text-[#5DA9FF] uppercase tracking-widest">
          <Search className="w-3.5 h-3.5" />
          <span>NASA Live Open APIs · NeoWs · DONKI · Media Library</span>
        </div>
        <h1 className="text-4xl lg:text-5xl font-extrabold font-headline text-white">
          Cosmic Search & Telemetry
        </h1>
        <p className="text-[#94A3B8] text-sm leading-relaxed">
          Query NASA’s live Image & Video Library, real-time Near-Earth Asteroid close approaches, and CCMC DONKI space weather alerts.
        </p>

        {/* Search Input Box */}
        <div className="pt-4 max-w-2xl mx-auto">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSearch();
            }}
            className="relative flex items-center"
          >
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search NASA archives e.g. 'Saturn rings', 'JWST', 'Mars Rover'..."
              className="w-full px-5 py-4 pl-12 rounded-2xl glass-card border border-white/20 text-white placeholder-slate-400 text-sm focus:outline-none focus:border-[#5DA9FF] focus:ring-2 focus:ring-[#5DA9FF]/20 transition-all shadow-xl font-medium"
            />
            <Search className="absolute left-4 w-5 h-5 text-[#5DA9FF]" />
            <button
              type="submit"
              disabled={loading}
              className="absolute right-2 px-5 py-2.5 rounded-xl cosmic-gradient text-white text-xs font-mono font-bold uppercase tracking-wider hover:scale-105 active:scale-95 transition-all shadow-md flex items-center gap-1.5 disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <span>Scan</span>}
            </button>
          </form>

          {/* Quick Query Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-3">
            {quickQueries.map((item) => (
              <button
                key={item}
                onClick={() => {
                  setQuery(item);
                  handleSearch(item);
                }}
                className="text-[11px] font-mono text-[#94A3B8] hover:text-white bg-white/5 hover:bg-white/10 px-2.5 py-1 rounded-lg border border-white/5 transition-colors"
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2 border-b border-white/10 pb-4">
        {[
          { key: 'all', label: 'All Telemetry' },
          { key: 'media', label: 'NASA Videos & Images' },
          { key: 'asteroids', label: 'Asteroids (NeoWs)' },
          { key: 'weather', label: 'Space Weather (DONKI)' },
          { key: 'analysis', label: 'Archival Analysis' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as typeof activeTab)}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-medium whitespace-nowrap shrink-0 transition-colors ${
              activeTab === tab.key
                ? 'bg-[#5DA9FF] text-[#050816] font-bold shadow-md'
                : 'text-[#94A3B8] hover:text-white hover:bg-white/5'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Results Content */}
      <div className="space-y-10">
        {/* Deep Space Intelligence Card */}
        {(activeTab === 'all' || activeTab === 'analysis') && analysisText && (
          <div className="glass-card rounded-2xl p-6 lg:p-8 border border-white/10 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2 text-xs font-mono text-[#5DA9FF] uppercase tracking-wider">
                <Sparkles className="w-4 h-4 text-[#5DA9FF]" />
                <span>Deep Space Intelligence Synthesis</span>
              </div>
              <span className="text-[11px] font-mono text-[#94A3B8]">Verified Archival Brief</span>
            </div>

            <p className="text-white text-base leading-relaxed font-normal whitespace-pre-wrap">
              {analysisText}
            </p>
          </div>
        )}

        {/* NASA Videos & Images Library Results */}
        {(activeTab === 'all' || activeTab === 'media') && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Film className="w-5 h-5 text-[#5DA9FF]" />
                <h2 className="text-xl font-bold font-headline text-white">
                  NASA Video & Image Library
                </h2>
              </div>
              <span className="text-xs font-mono text-[#94A3B8] tabular-nums">
                {mediaLoading ? 'Loading NASA assets...' : `${mediaItems.length} NASA Records`}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mediaItems.map((item) => (
                <div
                  key={item.nasaId}
                  className="glass-card rounded-2xl overflow-hidden border border-white/10 flex flex-col justify-between"
                >
                  <div className="aspect-video bg-black relative">
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
                  <div className="p-5 space-y-2">
                    <div className="flex items-center gap-2 text-[11px] font-mono text-[#94A3B8]">
                      <PlayCircle className="w-3.5 h-3.5 text-[#5DA9FF]" />
                      <span>{item.mediaType.toUpperCase()}</span>
                      <span>·</span>
                      <span>{item.center || 'NASA'}</span>
                      <span>·</span>
                      <span>{item.dateCreated}</span>
                    </div>
                    <h3 className="text-sm font-bold font-headline text-white line-clamp-2">
                      {item.title}
                    </h3>
                    <p className="text-xs text-[#94A3B8] line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Live Asteroid Tracker (NeoWs) */}
        {(activeTab === 'all' || activeTab === 'asteroids') && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-400" />
                <h2 className="text-xl font-bold font-headline text-white">
                  Live Near-Earth Asteroid Tracker (NASA NeoWs)
                </h2>
              </div>
              <span className="text-xs font-mono text-[#94A3B8] tabular-nums">
                {asteroids.length} Live Objects
              </span>
            </div>

            {asteroids.length === 0 ? (
              <div className="glass-card rounded-xl p-6 border border-white/10 text-xs font-mono text-[#94A3B8]">
                Loading live NASA NeoWs asteroid approach telemetry...
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {asteroids.map((neo) => (
                  <div
                    key={neo.id}
                    className="glass-card rounded-2xl p-6 border border-white/10 space-y-4 flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono text-[#94A3B8]">ASTEROID</span>
                        <span
                          className={`text-[11px] font-mono font-bold uppercase ${
                            neo.hazardous ? 'text-rose-300' : 'text-emerald-300'
                          }`}
                        >
                          {neo.hazardous ? 'Potentially Hazardous' : 'Safe Trajectory'}
                        </span>
                      </div>

                      <h3 className="text-lg font-bold font-headline text-white">{neo.name}</h3>

                      <div className="space-y-2 text-xs font-mono pt-2 border-t border-white/5 tabular-nums">
                        <div className="flex justify-between text-[#94A3B8]">
                          <span>Relative Speed:</span>
                          <span className="text-white font-bold">{neo.speed}</span>
                        </div>
                        <div className="flex justify-between text-[#94A3B8]">
                          <span>Miss Distance:</span>
                          <span className="text-[#5DA9FF] font-bold">{neo.distance}</span>
                        </div>
                        <div className="flex justify-between text-[#94A3B8]">
                          <span>Est. Diameter:</span>
                          <span className="text-white font-bold">{neo.size}</span>
                        </div>
                        <div className="flex justify-between text-[#94A3B8]">
                          <span>Approach:</span>
                          <span className="text-amber-300 font-bold">{neo.closeApproachDate}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Curated NASA Asteroid & Comet Photography */}
            <div className="pt-4 space-y-3">
              <div className="flex items-center justify-between text-xs font-mono text-[#94A3B8]">
                <span className="uppercase tracking-wider text-amber-300">
                  Verified Asteroid & Comet Missions
                </span>
                <span>NASA Image Library</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {SMALL_BODIES.map((item) => (
                  <div
                    key={item.id}
                    className="glass-card rounded-2xl overflow-hidden border border-white/10 flex flex-col justify-between"
                  >
                    <div className="aspect-[16/10] bg-black relative">
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-4 space-y-2">
                      <div className="flex items-center justify-between text-[11px] font-mono text-amber-300">
                        <span>{item.category.toUpperCase()}</span>
                        <span className="text-[#94A3B8]">{item.diameter}</span>
                      </div>
                      <h3 className="text-sm font-bold font-headline text-white">{item.name}</h3>
                      <p className="text-xs text-[#94A3B8] line-clamp-2">{item.summary}</p>
                      {item.eyesTarget && (
                        <a
                          href={`https://eyes.nasa.gov/apps/solar-system/#/${item.eyesTarget}`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-[11px] font-mono text-[#5DA9FF] hover:underline pt-1"
                        >
                          <span>Inspect in JPL Eyes</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Live Space Weather Notifications (DONKI) */}
        {(activeTab === 'all' || activeTab === 'weather') && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-[#5DA9FF]" />
                <h2 className="text-xl font-bold font-headline text-white">
                  Live Space Weather Alerts (NASA DONKI)
                </h2>
              </div>
              <span className="text-xs font-mono text-[#94A3B8]">CCMC Live Feed</span>
            </div>

            {weatherEvents.length === 0 ? (
              <div className="glass-card rounded-xl p-6 border border-white/10 text-xs font-mono text-[#94A3B8]">
                Loading NASA CCMC DONKI space weather alerts...
              </div>
            ) : (
              <div className="space-y-3">
                {weatherEvents.map((evt) => (
                  <div
                    key={evt.id}
                    className="glass-card rounded-xl p-5 border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-bold font-headline text-white">
                          {evt.type}
                        </span>
                        <span className="text-white/20">·</span>
                        <span className="text-[11px] font-mono text-[#94A3B8] tabular-nums">
                          {evt.date}
                        </span>
                      </div>
                      <p className="text-xs text-[#CBD5E1] leading-relaxed max-w-3xl">
                        {evt.message}
                      </p>
                    </div>

                    <span
                      className={`text-[11px] font-mono uppercase font-bold shrink-0 ${
                        evt.severity === 'Severe' || evt.severity === 'High'
                          ? 'text-rose-300'
                          : evt.severity === 'Moderate'
                          ? 'text-amber-300'
                          : 'text-emerald-300'
                      }`}
                    >
                      {evt.severity} Severity
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
