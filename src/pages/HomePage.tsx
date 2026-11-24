import React, { useState, useEffect } from 'react';
import { NavigationRoute, ExplorerProfile, NasaMediaItem } from '../types';
import { GalaxyHeroCanvas } from '../components/GalaxyHeroCanvas';
import { HERO_ASSETS } from '../data/cosmicData';
import {
  Orbit,
  Sparkles,
  Volume2,
  Search,
  Camera,
  Compass,
  ArrowRight,
  Globe2,
  BookOpen,
  PlayCircle,
  ExternalLink,
  Cpu,
} from 'lucide-react';

interface HomePageProps {
  onNavigate: (route: NavigationRoute) => void;
  profile: ExplorerProfile;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate, profile }) => {
  const [featuredMedia, setFeaturedMedia] = useState<NasaMediaItem[]>([]);

  useEffect(() => {
    let active = true;
    fetch('/api/nasa/media?q=solar+system+nebula&media_type=video&limit=3')
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (active && Array.isArray(data?.items)) {
          setFeaturedMedia(data.items);
        }
      })
      .catch(() => {
        // non-fatal
      });
    return () => {
      active = false;
    };
  }, []);

  const missions = [
    {
      name: 'Solar System',
      href: '/solar-system' as NavigationRoute,
      icon: Orbit,
      desc: 'NASA/JPL 3D Eyes on the Solar System, planetary telemetry, and verified small-body archives.',
      tag: '3D Eyes · 11 Worlds',
      color: '#38BDF8',
    },
    {
      name: 'Star Atlas',
      href: '/star-patterns' as NavigationRoute,
      icon: Sparkles,
      desc: 'Constellations, stellar myths across ancient civilizations, and observational protocols.',
      tag: 'Celestial Map',
      color: '#A78BFA',
    },
    {
      name: 'Space Sounds',
      href: '/space-sounds' as NavigationRoute,
      icon: Volume2,
      desc: 'NASA mission audio recordings, pulsar signals, and deep-space sonifications.',
      tag: 'Sonic Observatory',
      color: '#F472B6',
    },
    {
      name: 'Cosmic Search',
      href: '/search' as NavigationRoute,
      icon: Search,
      desc: 'Live NeoWs asteroids, comets, DONKI space weather, NASA media, and archival briefs.',
      tag: 'Live NASA Telemetry',
      color: '#5DA9FF',
    },
    {
      name: 'Daily Capture',
      href: '/apod' as NavigationRoute,
      icon: Camera,
      desc: 'Astronomy Picture of the Day curated directly from NASA Open APIs.',
      tag: 'NASA APOD',
      color: '#FBBF24',
    },
    {
      name: 'Goldilocks',
      href: '/habitable-zone' as NavigationRoute,
      icon: Compass,
      desc: 'Habitable zone analysis, Earth Similarity Index (ESI), and exoplanet atmospheres.',
      tag: 'Exoplanet Archive',
      color: '#34D399',
    },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Animated Real-Time Spiral Galaxy Hero Background */}
      <GalaxyHeroCanvas />

      {/* Main Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 lg:px-8 py-14 lg:py-22 space-y-20">
        {/* Hero Section */}
        <div className="max-w-3xl space-y-6">
          {/* Clean Unboxed Kicker Metadata */}
          <div className="flex flex-wrap items-center gap-2.5 text-xs font-mono uppercase tracking-[0.18em]">
            <span className="text-[#5DA9FF] font-bold">Deep Space Observatory</span>
            <span className="text-white/25" aria-hidden="true">·</span>
            <span className="text-[#CBD5E1]">{profile.displayName || 'Guest Explorer'}</span>
          </div>

          {/* Main Headline */}
          <h1 className="font-headline text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.06] text-balance drop-shadow-[0_10px_30px_rgba(0,0,0,0.85)]">
            Quantum Nest <br />
            <span className="cosmic-gradient-text">Cosmic Insights</span>
          </h1>

          {/* Subtitle Prose */}
          <p className="text-lg lg:text-xl text-[#CBD5E1] leading-relaxed max-w-2xl font-normal">
            A calm, intelligent gateway to the universe. Explore verified NASA planetary archives, real-time 2D geodynamics, and hybrid AI cosmic intelligence.
          </p>

          {/* Quick Action Strip */}
          <div className="pt-2 flex flex-wrap items-center gap-3.5">
            <button
              type="button"
              onClick={() => onNavigate('/ai-guide')}
              className="px-6 py-3 rounded-xl cosmic-gradient text-white font-bold text-xs uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_0_25px_rgba(93,169,255,0.4)] flex items-center gap-2 cursor-pointer"
            >
              <Cpu className="w-4 h-4" />
              <span>Open AI Space Guide</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => onNavigate('/solar-system')}
              className="px-5 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium text-xs uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer"
            >
              <Orbit className="w-4 h-4 text-[#5DA9FF]" />
              <span>Solar System</span>
            </button>

            <button
              type="button"
              onClick={() => onNavigate('/earth')}
              className="px-5 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium text-xs uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer"
            >
              <Globe2 className="w-4 h-4 text-[#38BDF8]" />
              <span>2D Earth Insights</span>
            </button>

            <button
              type="button"
              onClick={() => onNavigate('/journal')}
              className="px-5 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium text-xs uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer"
            >
              <BookOpen className="w-4 h-4 text-[#A78BFA]" />
              <span>Cosmic Journal</span>
            </button>
          </div>
        </div>

        {/* Missions Grid (The 6 core missions) */}
        <div>
          <div className="flex items-center justify-between mb-8">
            <div>
              <p className="text-xs font-mono uppercase tracking-widest text-[#5DA9FF] mb-1">
                Archival Modules
              </p>
              <h2 className="text-2xl lg:text-3xl font-bold font-headline text-white">
                Launch Mission Portals
              </h2>
            </div>
            <span className="text-xs font-mono text-[#94A3B8] hidden sm:inline tabular-nums">
              6 Active Gateways
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {missions.map((mission) => {
              const Icon = mission.icon;
              return (
                <button
                  type="button"
                  key={mission.href}
                  onClick={() => onNavigate(mission.href)}
                  className="glass-card-interactive group rounded-2xl overflow-hidden cursor-pointer flex flex-col justify-between text-left"
                >
                  <div className="p-6 space-y-4">
                    <div className="flex items-center justify-between gap-2">
                      <div
                        className="w-11 h-11 rounded-xl flex items-center justify-center border transition-all"
                        style={{
                          backgroundColor: `${mission.color}15`,
                          borderColor: `${mission.color}40`,
                        }}
                      >
                        <Icon className="w-5 h-5" style={{ color: mission.color }} />
                      </div>
                      <span className="text-[11px] font-mono text-[#94A3B8]">
                        {mission.tag}
                      </span>
                    </div>

                    <div>
                      <h3 className="font-headline text-xl font-bold text-white group-hover:text-[#5DA9FF] transition-colors mb-1.5">
                        {mission.name}
                      </h3>
                      <p className="text-[#94A3B8] text-xs leading-relaxed font-normal">
                        {mission.desc}
                      </p>
                    </div>
                  </div>

                  <div className="px-6 pb-5 pt-3 border-t border-white/5 flex items-center justify-between text-xs font-mono uppercase tracking-wider text-[#5DA9FF] group-hover:text-white transition-colors">
                    <span className="font-bold text-[11px]">Launch Mission</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Live NASA Video Archive Strip */}
        {featuredMedia.length > 0 && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-xs font-mono uppercase tracking-widest text-[#38BDF8] mb-1">
                  NASA Image & Video Library
                </p>
                <h2 className="text-2xl lg:text-3xl font-bold font-headline text-white">
                  Featured NASA Mission Videos
                </h2>
              </div>
              <a
                href="https://eyes.nasa.gov/apps/solar-system/#/home"
                target="_blank"
                rel="noreferrer"
                className="text-xs font-mono text-[#5DA9FF] hover:text-white flex items-center gap-1.5 transition-colors"
              >
                <span>Open NASA/JPL Eyes 3D</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featuredMedia.map((item) => (
                <div
                  key={item.nasaId}
                  className="glass-card rounded-2xl overflow-hidden border border-white/10 flex flex-col justify-between"
                >
                  <div className="aspect-video bg-black relative">
                    {item.mediaUrl && item.mediaUrl.endsWith('.mp4') ? (
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
                        src={item.thumbUrl || HERO_ASSETS.heroDeepCosmos}
                        alt={item.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <div className="p-4 space-y-2">
                    <div className="flex items-center gap-2 text-[11px] font-mono text-[#94A3B8]">
                      <PlayCircle className="w-3.5 h-3.5 text-[#5DA9FF] shrink-0" />
                      <span>{item.center || 'NASA'}</span>
                      <span aria-hidden="true">·</span>
                      <span>{item.dateCreated || 'Archive'}</span>
                    </div>
                    <h3 className="text-sm font-bold font-headline text-white line-clamp-1">
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

        {/* Observatory Telemetry Bar */}
        <div className="glass-card rounded-2xl p-6 lg:p-8 border border-white/10 shadow-2xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center sm:text-left">
            <div className="space-y-1">
              <p className="text-[11px] font-mono text-[#94A3B8] uppercase">Archived Worlds</p>
              <p className="text-3xl font-extrabold font-mono text-white tabular-nums">17+</p>
              <p className="text-xs text-[#94A3B8]">Planets, Asteroids & Comets</p>
            </div>

            <div className="space-y-1">
              <p className="text-[11px] font-mono text-[#94A3B8] uppercase">Acoustic Sonifications</p>
              <p className="text-3xl font-extrabold font-mono text-[#5DA9FF] tabular-nums">6 Feeds</p>
              <p className="text-xs text-[#94A3B8]">Synthesized Cosmic Audio</p>
            </div>

            <div className="space-y-1">
              <p className="text-[11px] font-mono text-[#94A3B8] uppercase">Habitable Exoplanets</p>
              <p className="text-3xl font-extrabold font-mono text-emerald-400 tabular-nums">8 Worlds</p>
              <p className="text-xs text-[#94A3B8]">Goldilocks Zone Verified</p>
            </div>

            <div className="space-y-1">
              <p className="text-[11px] font-mono text-[#94A3B8] uppercase">Observer Rank</p>
              <p className="text-2xl font-bold font-headline text-[#A78BFA] truncate">
                {profile.rank}
              </p>
              <p className="text-xs text-[#94A3B8]">ID: {profile.id}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
