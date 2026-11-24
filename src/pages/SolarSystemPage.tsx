import React, { useState, useEffect } from 'react';
import { CelestialBody, ExplorerProfile, NavigationRoute, NasaMediaItem } from '../types';
import { CELESTIAL_BODIES, SMALL_BODIES } from '../data/cosmicData';
import { BackButton } from '../components/BackButton';
import {
  Orbit,
  Bookmark,
  BookmarkCheck,
  Scale,
  Info,
  ChevronRight,
  X,
  BookOpen,
  ExternalLink,
  Globe2,
  PlayCircle,
  Loader2,
  Sparkles,
} from 'lucide-react';

interface SolarSystemPageProps {
  profile: ExplorerProfile;
  onToggleBookmark: (id: string) => void;
  onNavigate?: (route: NavigationRoute) => void;
  onBack?: () => void;
}

export const SolarSystemPage: React.FC<SolarSystemPageProps> = ({
  profile,
  onToggleBookmark,
  onNavigate,
  onBack,
}) => {
  const [selectedBody, setSelectedBody] = useState<CelestialBody | null>(
    CELESTIAL_BODIES.find((b) => b.id === 'earth-view') || CELESTIAL_BODIES[0]
  );
  const [eyesFocusHome, setEyesFocusHome] = useState<boolean>(true);
  const [filterType, setFilterType] = useState<string>('All');
  const [earthWeightKg, setEarthWeightKg] = useState<number>(70);
  const [detailModalOpen, setDetailModalOpen] = useState<boolean>(false);

  // Dynamic NASA Image & Video archive items for the inspected body
  const [bodyMedia, setBodyMedia] = useState<NasaMediaItem[]>([]);
  const [loadingMedia, setLoadingMedia] = useState<boolean>(false);

  const filterOptions = ['All', 'Terrestrial', 'Gas Giant', 'Ice Giant', 'Dwarf Planet', 'Star'];

  const filteredBodies = CELESTIAL_BODIES.filter((body) => {
    if (filterType === 'All') return true;
    return body.type === filterType;
  });

  const eyesUrl =
    eyesFocusHome || !selectedBody?.eyesTarget
      ? 'https://eyes.nasa.gov/apps/solar-system/#/home'
      : `https://eyes.nasa.gov/apps/solar-system/#/${selectedBody.eyesTarget}`;

  useEffect(() => {
    if (!detailModalOpen || !selectedBody) return;
    let active = true;
    setLoadingMedia(true);
    setBodyMedia([]);

    const queryTerm =
      selectedBody.name === 'Sun'
        ? 'solar dynamics observatory sun'
        : `${selectedBody.name} planet nasa`;

    fetch(`/api/nasa/media?q=${encodeURIComponent(queryTerm)}&media_type=video,image&limit=4`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (active && Array.isArray(data?.items)) {
          setBodyMedia(data.items);
        }
      })
      .catch(() => {
        // fallback handled gracefully by UI
      })
      .finally(() => {
        if (active) setLoadingMedia(false);
      });

    return () => {
      active = false;
    };
  }, [detailModalOpen, selectedBody]);

  const handleSelectBody = (body: CelestialBody) => {
    setSelectedBody(body);
    setEyesFocusHome(false);
  };

  const handleOpenDetail = (body: CelestialBody) => {
    setSelectedBody(body);
    setDetailModalOpen(true);
  };

  const calculateWeight = (body: CelestialBody): string => {
    const gMatch = body.gravity.match(/([0-9.]+)/);
    if (!gMatch) return 'N/A';
    const g = parseFloat(gMatch[1]);
    const w = (earthWeightKg * (g / 9.81)).toFixed(1);
    return `${w} kg`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-10 space-y-12">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/10 pb-8">
        <div className="space-y-2">
          {onBack && <BackButton onBack={onBack} label="Back" />}
          <div className="flex items-center gap-2 text-xs font-mono text-[#5DA9FF] uppercase tracking-widest pt-1">
            <Orbit className="w-4 h-4" />
            <span>NASA/JPL Eyes on the Solar System · Planetary Archives</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-extrabold font-headline text-white">
            Solar System Exploration
          </h1>
          <p className="text-[#94A3B8] text-sm max-w-2xl">
            Navigate real-time 3D JPL spacecraft and planetary ephemerides via NASA/JPL Eyes on the Solar System, and inspect live NASA archival videos and planetary telemetry.
          </p>
        </div>

        {/* Selected Body Quick HUD */}
        {selectedBody && (
          <div className="glass-card px-4 py-2.5 rounded-xl border border-white/10 flex items-center gap-4 text-xs font-mono shrink-0">
            <div>
              <p className="text-[#94A3B8]">SELECTED TARGET</p>
              <p className="text-white font-bold text-sm">{selectedBody.name}</p>
            </div>
            <div className="border-l border-white/10 pl-4">
              <p className="text-[#94A3B8]">SURFACE GRAVITY</p>
              <p className="text-[#5DA9FF] font-bold tabular-nums">{selectedBody.gravity}</p>
            </div>
          </div>
        )}
      </div>

      {/* Interactive NASA/JPL 3D Eyes Stage */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs font-mono text-[#5DA9FF]">
            <Globe2 className="w-4 h-4" />
            <span>NASA/JPL Eyes on the Solar System (Interactive 3D)</span>
          </div>

          {/* Target Focus & Fullscreen Link */}
          <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
            <button
              onClick={() => setEyesFocusHome(!eyesFocusHome)}
              className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-[#CBD5E1] hover:text-white whitespace-nowrap shrink-0 transition-colors"
            >
              {eyesFocusHome
                ? `Focus ${selectedBody?.name || 'Planet'}`
                : 'Reset to Solar System Home'}
            </button>
            <a
              href={eyesUrl}
              target="_blank"
              rel="noreferrer"
              className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-[#5DA9FF] hover:text-white whitespace-nowrap shrink-0 transition-colors flex items-center gap-1.5"
            >
              <span>Launch NASA Eyes Fullscreen</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        <div className="rounded-2xl overflow-hidden border border-white/15 bg-[#030612] shadow-2xl">
          <div className="relative w-full h-[520px] lg:h-[600px]">
            <iframe
              key={eyesUrl}
              src={eyesUrl}
              title="NASA/JPL Eyes on the Solar System 3D Interactive"
              className="w-full h-full border-0"
              allow="fullscreen; accelerometer; gyroscope"
              allowFullScreen
            />
          </div>
          <div className="px-4 py-2.5 bg-[#050816]/90 border-t border-white/10 flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono text-[#94A3B8]">
            <span>
              Source: NASA/JPL-Caltech Eyes on the Solar System · Target:{' '}
              <strong className="text-white">
                {eyesFocusHome ? 'Solar System Home' : selectedBody?.name}
              </strong>
            </span>
            <span>Click any planet card below to focus it in 3D or inspect NASA videos</span>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-[#050816]/70 rounded-xl border border-white/10 text-xs">
          {filterOptions.map((type) => {
            const isActive = filterType === type;
            return (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap shrink-0 transition-colors ${
                  isActive
                    ? 'bg-[#5DA9FF] text-[#050816] font-bold shadow-md'
                    : 'text-[#94A3B8] hover:text-white'
                }`}
              >
                {type}
              </button>
            );
          })}
        </div>

        <span className="text-xs font-mono text-[#94A3B8] tabular-nums">
          Showing {filteredBodies.length} of {CELESTIAL_BODIES.length} celestial bodies
        </span>
      </div>

      {/* Celestial Bodies Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBodies.map((body) => {
          const isSelected = selectedBody?.id === body.id;
          const isBookmarked = profile.bookmarkedIds.includes(body.id);

          return (
            <div
              key={body.id}
              onClick={() => handleSelectBody(body)}
              className={`glass-card-interactive rounded-2xl overflow-hidden flex flex-col justify-between cursor-pointer border ${
                isSelected
                  ? 'border-[#5DA9FF] shadow-[0_0_25px_rgba(93,169,255,0.25)]'
                  : 'border-white/10'
              }`}
            >
              {/* Card Image Area with fallback */}
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-950">
                {body.imageUrl ? (
                  <img
                    src={body.imageUrl}
                    alt={body.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        'https://images-assets.nasa.gov/image/PIA02653/PIA02653~medium.jpg';
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-900 to-indigo-950">
                    <Orbit className="w-12 h-12 text-[#5DA9FF]/40" />
                  </div>
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-[#0B1026] via-[#0B1026]/30 to-transparent" />

                {/* Clean metadata overlay */}
                <div className="absolute top-3 left-3 text-[10px] font-mono uppercase tracking-wider bg-[#050816]/85 text-[#5DA9FF] px-2.5 py-1 rounded-md border border-white/10 backdrop-blur-md">
                  {body.type}
                </div>

                {/* Bookmark Action */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleBookmark(body.id);
                  }}
                  className="absolute top-3 right-3 p-1.5 rounded-lg bg-[#050816]/70 hover:bg-[#050816] text-[#94A3B8] hover:text-[#5DA9FF] transition-colors border border-white/10 backdrop-blur-md"
                  title={isBookmarked ? 'Remove Bookmark' : 'Bookmark to Profile'}
                >
                  {isBookmarked ? (
                    <BookmarkCheck className="w-4 h-4 text-[#5DA9FF]" />
                  ) : (
                    <Bookmark className="w-4 h-4" />
                  )}
                </button>

                {/* Title & Distance */}
                <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between">
                  <div>
                    <h3 className="text-xl font-bold font-headline text-white">{body.name}</h3>
                    <p className="text-[11px] font-mono text-[#94A3B8]">{body.dist} from Sun</p>
                  </div>
                  <div
                    className="w-4 h-4 rounded-full border border-white/20 shadow-sm"
                    style={{ backgroundColor: body.color }}
                  />
                </div>
              </div>

              {/* Card Body Data */}
              <div className="p-5 space-y-4 text-xs">
                <p className="text-[#94A3B8] line-clamp-2 leading-relaxed">{body.details}</p>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/5 font-mono text-[11px]">
                  <div>
                    <span className="text-[#94A3B8] block text-[10px]">GRAVITY</span>
                    <span className="text-white font-bold tabular-nums">{body.gravity}</span>
                  </div>
                  <div>
                    <span className="text-[#94A3B8] block text-[10px]">TEMPERATURE</span>
                    <span className="text-white font-bold tabular-nums">{body.temp}</span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="px-5 pb-5 pt-0">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOpenDetail(body);
                  }}
                  className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-[#5DA9FF]/20 text-white hover:text-[#5DA9FF] border border-white/10 hover:border-[#5DA9FF]/40 text-xs font-mono uppercase tracking-wider font-semibold transition-all flex items-center justify-center gap-1.5"
                >
                  <Info className="w-3.5 h-3.5" />
                  <span>Inspect Archive & NASA Videos</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Verified NASA Asteroids & Comets Visual Catalog */}
      <div className="space-y-6 pt-6 border-t border-white/10">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-mono uppercase tracking-widest text-amber-400 flex items-center gap-1.5 mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Small Bodies Visual Archive · NASA Image Library</span>
            </p>
            <h2 className="text-2xl lg:text-3xl font-bold font-headline text-white">
              Asteroids & Comets
            </h2>
          </div>
          <span className="text-xs font-mono text-[#94A3B8] tabular-nums">
            {SMALL_BODIES.length} Verified Spacecraft & Telescopic Captures
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {SMALL_BODIES.map((sb) => (
            <div
              key={sb.id}
              className="glass-card rounded-2xl overflow-hidden border border-white/10 flex flex-col justify-between"
            >
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-950">
                <img
                  src={sb.imageUrl}
                  alt={sb.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B1026] via-[#0B1026]/20 to-transparent" />
                <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-amber-300 block">
                      {sb.category} · {sb.orbitPeriod}
                    </span>
                    <h3 className="text-lg font-bold font-headline text-white">{sb.name}</h3>
                  </div>
                </div>
              </div>

              <div className="p-5 space-y-3 text-xs">
                <p className="text-[#CBD5E1] leading-relaxed">{sb.summary}</p>
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/5 font-mono text-[11px]">
                  <div>
                    <span className="text-[#94A3B8] block text-[10px]">DIMENSIONS</span>
                    <span className="text-white font-bold">{sb.diameter}</span>
                  </div>
                  <div>
                    <span className="text-[#94A3B8] block text-[10px]">MISSION</span>
                    <span className="text-amber-300 font-bold truncate block">{sb.mission}</span>
                  </div>
                </div>
              </div>

              {sb.eyesTarget && (
                <div className="px-5 pb-4 pt-0">
                  <a
                    href={`https://eyes.nasa.gov/apps/solar-system/#/${sb.eyesTarget}`}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-2 rounded-xl bg-white/5 hover:bg-[#5DA9FF]/15 border border-white/10 text-[11px] font-mono uppercase tracking-wider text-[#5DA9FF] flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <span>Open in NASA/JPL Eyes</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Detailed Planetary Inspection Modal */}
      {detailModalOpen && selectedBody && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto glass-card rounded-2xl border border-white/20 shadow-2xl p-6 lg:p-8 space-y-6">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-white/10 pb-4">
              <div>
                <div className="flex items-center gap-2 text-xs font-mono text-[#5DA9FF] uppercase tracking-wider mb-1">
                  <span>BODY ARCHIVE RECORD</span>
                  <span className="text-white/20">·</span>
                  <span>{selectedBody.type}</span>
                </div>
                <h2 className="text-3xl font-extrabold font-headline text-white">
                  {selectedBody.name}
                </h2>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => onToggleBookmark(selectedBody.id)}
                  className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-[#94A3B8] hover:text-[#5DA9FF] transition-colors border border-white/10"
                  title="Bookmark celestial body"
                >
                  {profile.bookmarkedIds.includes(selectedBody.id) ? (
                    <BookmarkCheck className="w-5 h-5 text-[#5DA9FF]" />
                  ) : (
                    <Bookmark className="w-5 h-5" />
                  )}
                </button>
                {onNavigate && (
                  <button
                    onClick={() => {
                      setDetailModalOpen(false);
                      onNavigate('/journal');
                    }}
                    className="p-2 px-3 rounded-xl bg-white/5 hover:bg-white/10 text-[#94A3B8] hover:text-[#A78BFA] transition-colors border border-white/10 flex items-center gap-1.5 text-xs font-mono whitespace-nowrap shrink-0"
                    title="Write Journal Reflection"
                  >
                    <BookOpen className="w-4 h-4" />
                    <span className="hidden sm:inline">Reflect in Journal</span>
                  </button>
                )}
                <button
                  onClick={() => setDetailModalOpen(false)}
                  className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white transition-colors border border-white/10"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Image Preview & Core Specs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="rounded-xl overflow-hidden aspect-[4/3] bg-black border border-white/10 relative">
                <img
                  src={selectedBody.imageUrl}
                  alt={selectedBody.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      'https://images-assets.nasa.gov/image/PIA02653/PIA02653~medium.jpg';
                  }}
                />
              </div>

              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2 text-xs">
                  <p className="font-mono text-[#5DA9FF] uppercase text-[10px]">Physical Profile</p>
                  <div className="grid grid-cols-2 gap-3 font-mono">
                    <div>
                      <span className="text-[#94A3B8] block text-[10px]">Distance</span>
                      <span className="text-white font-bold tabular-nums">{selectedBody.dist}</span>
                    </div>
                    <div>
                      <span className="text-[#94A3B8] block text-[10px]">Gravity</span>
                      <span className="text-white font-bold tabular-nums">{selectedBody.gravity}</span>
                    </div>
                    <div>
                      <span className="text-[#94A3B8] block text-[10px]">Temperature</span>
                      <span className="text-white font-bold tabular-nums">{selectedBody.temp}</span>
                    </div>
                    <div>
                      <span className="text-[#94A3B8] block text-[10px]">Day Length</span>
                      <span className="text-white font-bold">{selectedBody.day || 'N/A'}</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <p className="font-mono text-[#5DA9FF] uppercase text-[10px]">Discovery Record</p>
                    <a
                      href={`https://eyes.nasa.gov/apps/solar-system/#/${selectedBody.eyesTarget || 'home'}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[11px] font-mono text-[#5DA9FF] hover:underline flex items-center gap-1"
                    >
                      <span>Open in JPL Eyes</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                  <p className="text-slate-300 font-mono text-xs">{selectedBody.discovery}</p>
                </div>
              </div>
            </div>

            {/* Live NASA Videos & Photos for this Celestial Body */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-xs font-mono uppercase text-[#5DA9FF] flex items-center gap-1.5">
                  <PlayCircle className="w-4 h-4" />
                  <span>NASA Videos & Imagery ({selectedBody.name})</span>
                </p>
                {loadingMedia && <Loader2 className="w-4 h-4 animate-spin text-[#5DA9FF]" />}
              </div>

              {bodyMedia.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {bodyMedia.map((m) => (
                    <div
                      key={m.nasaId}
                      className="rounded-xl overflow-hidden bg-black/50 border border-white/10 flex flex-col"
                    >
                      <div className="aspect-video bg-black">
                        {m.mediaType === 'video' && m.mediaUrl?.endsWith('.mp4') ? (
                          <video
                            controls
                            preload="metadata"
                            poster={m.thumbUrl}
                            className="w-full h-full object-cover"
                          >
                            <source src={m.mediaUrl} type="video/mp4" />
                          </video>
                        ) : (
                          <img
                            src={m.thumbUrl || m.mediaUrl}
                            alt={m.title}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                      <div className="p-3 space-y-1">
                        <p className="text-xs font-semibold text-white line-clamp-1">{m.title}</p>
                        <p className="text-[10px] font-mono text-[#94A3B8]">
                          {m.mediaType.toUpperCase()} · {m.center || 'NASA'} · {m.dateCreated}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Surface & Atmosphere Deep Dive */}
            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-1.5">
                <p className="font-mono text-[#5DA9FF] uppercase text-[10px]">Surface Composition</p>
                <p className="text-[#CBD5E1] leading-relaxed">{selectedBody.surface}</p>
              </div>

              <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-1.5">
                <p className="font-mono text-[#5DA9FF] uppercase text-[10px]">Atmospheric Envelope</p>
                <p className="text-[#CBD5E1] leading-relaxed">{selectedBody.atmosphere}</p>
              </div>
            </div>

            {/* Moons Archive */}
            {selectedBody.moonList && selectedBody.moonList.length > 0 && (
              <div className="space-y-3">
                <p className="text-xs font-mono uppercase text-[#94A3B8]">
                  Natural Satellites ({selectedBody.moons} total recorded)
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {selectedBody.moonList.map((moon) => (
                    <div
                      key={moon.name}
                      className="p-3 rounded-xl bg-white/5 border border-white/10 text-xs"
                    >
                      <p className="font-bold text-white font-headline">{moon.name}</p>
                      <p className="text-[#94A3B8] text-[11px] mt-1">{moon.details}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Gravity Weight Simulator */}
            <div className="p-5 rounded-2xl bg-[#050816] border border-white/10 space-y-3">
              <div className="flex items-center gap-2 text-xs font-mono text-[#5DA9FF]">
                <Scale className="w-4 h-4" />
                <span>GRAVITY MASS CALCULATOR</span>
              </div>
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <label className="text-xs text-[#94A3B8] whitespace-nowrap">Your Earth Weight:</label>
                  <input
                    type="number"
                    value={earthWeightKg}
                    onChange={(e) => setEarthWeightKg(Math.max(1, parseFloat(e.target.value) || 0))}
                    className="w-24 px-3 py-1.5 rounded-lg bg-white/10 border border-white/20 text-white font-mono text-xs focus:ring-1 focus:ring-[#5DA9FF]"
                  />
                  <span className="text-xs font-mono text-[#94A3B8]">kg</span>
                </div>

                <div className="text-right w-full sm:w-auto bg-white/5 px-4 py-2 rounded-xl border border-white/10">
                  <span className="text-[10px] font-mono text-[#94A3B8] block">
                    ON {selectedBody.name.toUpperCase()} YOU WEIGH
                  </span>
                  <span className="text-xl font-bold font-mono text-[#5DA9FF] tabular-nums">
                    {calculateWeight(selectedBody)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
