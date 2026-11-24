import React, { useState, useEffect } from 'react';
import { SpaceSound, ExplorerProfile, NasaMediaItem } from '../types';
import { SPACE_SOUNDS } from '../data/cosmicData';
import { BackButton } from '../components/BackButton';
import {
  Play,
  Pause,
  Radio,
  Bookmark,
  BookmarkCheck,
  Info,
  Waves,
  Headphones,
} from 'lucide-react';

interface SpaceSoundsPageProps {
  profile: ExplorerProfile;
  currentSound: SpaceSound | null;
  isPlaying: boolean;
  onPlaySound: (sound: SpaceSound) => void;
  onToggleBookmark: (id: string) => void;
  onBack?: () => void;
}

export const SpaceSoundsPage: React.FC<SpaceSoundsPageProps> = ({
  profile,
  currentSound,
  isPlaying,
  onPlaySound,
  onToggleBookmark,
  onBack,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [infoOpen, setInfoOpen] = useState<boolean>(false);
  const [nasaAudioTracks, setNasaAudioTracks] = useState<SpaceSound[]>([]);

  useEffect(() => {
    let active = true;
    fetch('/api/nasa/media?q=apollo+liftoff+voyager&media_type=audio&limit=6')
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (!active || !Array.isArray(data?.items)) return;
        const mapped: SpaceSound[] = (data.items as NasaMediaItem[])
          .filter((item) => Boolean(item.mediaUrl && /\.(mp3|m4a|wav)$/i.test(item.mediaUrl)))
          .map((item) => ({
            id: `nasa-audio-${item.nasaId}`,
            title: item.title,
            description: item.description || 'Official NASA Mission Audio Archive recording.',
            audioUrl: item.mediaUrl,
            date: `${item.center || 'NASA'} · ${item.dateCreated || 'Archive'}`,
            category: 'Deep Space',
            instrument: 'NASA Audio Archive',
            duration: 'Stream MP3',
          }));
        setNasaAudioTracks(mapped);
      })
      .catch(() => {
        // non-fatal
      });

    return () => {
      active = false;
    };
  }, []);

  const categories = ['All', 'Black Hole', 'Sonification', 'Planetary', 'Deep Space'];

  const filteredSounds = SPACE_SOUNDS.filter((s) => {
    if (selectedCategory === 'All') return true;
    return s.category === selectedCategory;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-10 space-y-12">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/10 pb-8">
        <div className="space-y-2">
          {onBack && <BackButton onBack={onBack} label="Back" />}
          <div className="flex items-center gap-2 text-xs font-mono text-[#F472B6] uppercase tracking-widest pt-1">
            <Radio className="w-4 h-4" />
            <span>Sonic Observatory · Cosmic Sonifications & NASA Audio</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-extrabold font-headline text-white">
            Space Sounds & Sonifications
          </h1>
          <p className="text-[#94A3B8] text-sm max-w-2xl">
            Listen to synthesized cosmic electromagnetic waves alongside real NASA mission audio streams from JPL, Kennedy Space Center, and Johnson Space Center.
          </p>
        </div>

        <button
          onClick={() => setInfoOpen(!infoOpen)}
          className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-mono flex items-center gap-2 transition-colors self-start md:self-auto shrink-0"
        >
          <Info className="w-4 h-4 text-[#5DA9FF]" />
          <span>What is Sonification?</span>
        </button>
      </div>

      {/* Educational Banner if toggled */}
      {infoOpen && (
        <div className="glass-card rounded-2xl p-6 lg:p-8 border border-white/10 space-y-4 animate-in fade-in duration-200">
          <div className="flex items-center gap-2 text-xs font-mono text-[#5DA9FF] uppercase tracking-wider">
            <Waves className="w-4 h-4" />
            <span>Physical Principles of Deep Space Acoustic Translation</span>
          </div>
          <h3 className="text-xl font-bold font-headline text-white">
            How Do We "Hear" Space When Sound Cannot Travel Through a Vacuum?
          </h3>
          <p className="text-[#CBD5E1] text-xs leading-relaxed max-w-4xl">
            While mechanical sound waves require air or liquid to propagate, celestial bodies radiate electromagnetic waves, plasma ripples, and ionized particle oscillations. Astrophysicists translate these periodic wave cycles measured by radio spectrographs and X-ray telescopes into the human hearing range (20 Hz to 20,000 Hz).
          </p>
        </div>
      )}

      {/* Category Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-[#050816]/70 rounded-xl border border-white/10 text-xs">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap shrink-0 transition-colors ${
                selectedCategory === cat
                  ? 'bg-[#F472B6] text-[#050816] font-bold shadow-md'
                  : 'text-[#94A3B8] hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <span className="text-xs font-mono text-[#94A3B8] tabular-nums">
          {filteredSounds.length} Acoustic Recordings
        </span>
      </div>

      {/* Synthesized Sonifications Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSounds.map((sound) => {
          const isThisPlaying = currentSound?.id === sound.id && isPlaying;
          const isBookmarked = profile.bookmarkedIds.includes(sound.id);

          return (
            <div
              key={sound.id}
              className={`glass-card-interactive rounded-2xl p-6 border flex flex-col justify-between transition-all ${
                isThisPlaying
                  ? 'border-[#F472B6] shadow-[0_0_30px_rgba(244,114,182,0.25)] bg-[#0E1530]'
                  : 'border-white/10'
              }`}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-[#F472B6]">
                    {sound.category}
                  </span>

                  <button
                    onClick={() => onToggleBookmark(sound.id)}
                    className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-[#94A3B8] hover:text-[#5DA9FF] transition-colors"
                    title={isBookmarked ? 'Remove Bookmark' : 'Bookmark Audio'}
                  >
                    {isBookmarked ? (
                      <BookmarkCheck className="w-4 h-4 text-[#5DA9FF]" />
                    ) : (
                      <Bookmark className="w-4 h-4" />
                    )}
                  </button>
                </div>

                <div>
                  <h3 className="text-lg font-bold font-headline text-white mb-1">{sound.title}</h3>
                  <p className="text-[11px] font-mono text-[#94A3B8]">{sound.date}</p>
                </div>

                <p className="text-xs text-[#94A3B8] leading-relaxed line-clamp-3">
                  {sound.description}
                </p>

                {sound.instrument && (
                  <div className="text-[10px] font-mono text-slate-400 bg-black/40 p-2 rounded-lg border border-white/5">
                    Sensor: {sound.instrument}
                  </div>
                )}
              </div>

              <div className="pt-6 border-t border-white/5 flex items-center justify-between mt-4">
                <button
                  onClick={() => onPlaySound(sound)}
                  className={`w-full py-2.5 px-4 rounded-xl font-mono text-xs uppercase tracking-wider font-bold transition-all flex items-center justify-center gap-2 ${
                    isThisPlaying
                      ? 'bg-[#F472B6] text-[#050816] shadow-[0_0_15px_#F472B6]'
                      : 'bg-white/10 hover:bg-white/15 text-white border border-white/10 hover:border-white/20'
                  }`}
                >
                  {isThisPlaying ? (
                    <>
                      <Pause className="w-4 h-4 fill-[#050816]" />
                      <span>Pause Sonification</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 fill-white" />
                      <span>Play Sonification</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Live NASA Audio Archives */}
      {nasaAudioTracks.length > 0 && (
        <div className="space-y-6 pt-6 border-t border-white/10">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <p className="text-xs font-mono uppercase tracking-wider text-[#5DA9FF] flex items-center gap-1.5 mb-1">
                <Headphones className="w-4 h-4" />
                <span>NASA Image & Audio Library Live Stream</span>
              </p>
              <h2 className="text-2xl font-bold font-headline text-white">
                Official NASA Mission Audio Recordings
              </h2>
            </div>
            <span className="text-xs font-mono text-[#94A3B8] tabular-nums">
              {nasaAudioTracks.length} Live MP3 Streams
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {nasaAudioTracks.map((track) => {
              const isThisPlaying = currentSound?.id === track.id && isPlaying;
              const isBookmarked = profile.bookmarkedIds.includes(track.id);

              return (
                <div
                  key={track.id}
                  className={`glass-card-interactive rounded-2xl p-6 border flex flex-col justify-between transition-all ${
                    isThisPlaying
                      ? 'border-[#5DA9FF] shadow-[0_0_25px_rgba(93,169,255,0.25)] bg-[#0E1530]'
                      : 'border-white/10'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-mono text-[#5DA9FF]">NASA MP3 ARCHIVE</span>
                      <button
                        onClick={() => onToggleBookmark(track.id)}
                        className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-[#94A3B8] hover:text-[#5DA9FF] transition-colors"
                        title={isBookmarked ? 'Remove Bookmark' : 'Bookmark Audio'}
                      >
                        {isBookmarked ? (
                          <BookmarkCheck className="w-4 h-4 text-[#5DA9FF]" />
                        ) : (
                          <Bookmark className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                    <h3 className="text-base font-bold font-headline text-white line-clamp-2">
                      {track.title}
                    </h3>
                    <p className="text-[11px] font-mono text-[#94A3B8]">{track.date}</p>
                    <p className="text-xs text-[#94A3B8] leading-relaxed line-clamp-3">
                      {track.description}
                    </p>
                  </div>

                  <div className="pt-5 border-t border-white/5 mt-4">
                    <button
                      onClick={() => onPlaySound(track)}
                      className={`w-full py-2.5 px-4 rounded-xl font-mono text-xs uppercase tracking-wider font-bold transition-all flex items-center justify-center gap-2 ${
                        isThisPlaying
                          ? 'bg-[#5DA9FF] text-[#050816]'
                          : 'bg-white/10 hover:bg-white/15 text-white border border-white/10'
                      }`}
                    >
                      {isThisPlaying ? (
                        <>
                          <Pause className="w-4 h-4 fill-[#050816]" />
                          <span>Pause NASA Audio</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4 fill-white" />
                          <span>Stream NASA Audio</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
