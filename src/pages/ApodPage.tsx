import React, { useState, useEffect } from 'react';
import { APODCapture } from '../types';
import { BackButton } from '../components/BackButton';
import {
  Camera,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Download,
  Shuffle,
  Info,
  Maximize2,
  X,
  Share2,
  PlayCircle,
} from 'lucide-react';

interface ApodPageProps {
  onBack?: () => void;
}

export const ApodPage: React.FC<ApodPageProps> = ({ onBack }) => {
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [apodData, setApodData] = useState<APODCapture | null>(null);
  const [recentCaptures, setRecentCaptures] = useState<APODCapture[]>([]);
  const [zoomModalOpen, setZoomModalOpen] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  const fallbackCapture: APODCapture = {
    date: '2026-11-21',
    title: 'Cosmic Reef in the Large Magellanic Cloud',
    explanation:
      'This celestial scene depicts NGC 2014 and NGC 2020, nicknamed the "Cosmic Reef" because they resemble an undersea world. Located 163,000 light-years away in the Large Magellanic Cloud, massive young stars at the center of NGC 2014 carve out bubbles of ionized gas with energetic stellar winds and ultraviolet radiation.',
    url: 'https://images-assets.nasa.gov/image/PIA02653/PIA02653~medium.jpg',
    hdurl: 'https://images-assets.nasa.gov/image/PIA02653/PIA02653~orig.jpg',
    media_type: 'image',
    copyright: 'NASA, ESA, and STScI',
  };

  useEffect(() => {
    let isCancelled = false;
    const fetchApod = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `/api/nasa/apod?date=${encodeURIComponent(selectedDate)}&recent=true`
        );
        if (res.ok) {
          const data = (await res.json()) as {
            capture?: APODCapture;
            recent?: APODCapture[];
          };
          if (!isCancelled && data.capture) {
            setApodData(data.capture);
            if (Array.isArray(data.recent) && data.recent.length > 0) {
              setRecentCaptures(data.recent);
            }
            setLoading(false);
            return;
          }
        }
        if (!isCancelled) {
          setApodData({ ...fallbackCapture, date: selectedDate });
        }
      } catch {
        if (!isCancelled) {
          setApodData({ ...fallbackCapture, date: selectedDate });
        }
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    };

    fetchApod();

    return () => {
      isCancelled = true;
    };
  }, [selectedDate]);

  const handlePrevDay = () => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() - 1);
    setSelectedDate(d.toISOString().split('T')[0]);
  };

  const handleNextDay = () => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + 1);
    const today = new Date().toISOString().split('T')[0];
    if (d.toISOString().split('T')[0] <= today) {
      setSelectedDate(d.toISOString().split('T')[0]);
    }
  };

  const handleRandomDay = () => {
    const start = new Date(2020, 0, 1).getTime();
    const end = new Date().getTime();
    const randomTime = start + Math.random() * (end - start);
    setSelectedDate(new Date(randomTime).toISOString().split('T')[0]);
  };

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-10 space-y-10">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/10 pb-8">
        <div className="space-y-2">
          {onBack && <BackButton onBack={onBack} label="Back" />}
          <div className="flex items-center gap-2 text-xs font-mono text-[#FBBF24] uppercase tracking-widest pt-1">
            <Camera className="w-4 h-4" />
            <span>NASA Open API Live · Astronomy Picture of the Day</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-extrabold font-headline text-white">
            Daily Capture (APOD)
          </h1>
          <p className="text-[#94A3B8] text-sm max-w-2xl">
            Each day a different image or video of our fascinating universe is featured directly from NASA’s archive, paired with commentary from professional astronomers.
          </p>
        </div>

        {/* Date Scrubber Controls */}
        <div className="flex items-center gap-2 bg-[#050816]/80 p-2 rounded-2xl border border-white/10 shadow-lg shrink-0">
          <button
            onClick={handlePrevDay}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white transition-colors"
            title="Previous Day"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-1.5 px-3 font-mono text-xs text-white">
            <Calendar className="w-3.5 h-3.5 text-[#5DA9FF]" />
            <input
              type="date"
              value={selectedDate}
              max={new Date().toISOString().split('T')[0]}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-transparent text-white focus:outline-none cursor-pointer font-mono text-xs"
            />
          </div>

          <button
            onClick={handleNextDay}
            disabled={selectedDate >= new Date().toISOString().split('T')[0]}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white disabled:opacity-30 transition-colors"
            title="Next Day"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          <button
            onClick={handleRandomDay}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-[#5DA9FF] transition-colors ml-1"
            title="Random Date"
          >
            <Shuffle className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Feature Display */}
      {loading ? (
        <div className="glass-card rounded-2xl p-12 text-center space-y-4">
          <div className="w-10 h-10 border-2 border-[#5DA9FF] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-mono text-[#5DA9FF] tracking-widest uppercase">
            Syncing NASA Daily Capture Archive...
          </p>
        </div>
      ) : apodData ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Media Stage (Left Column) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="glass-card rounded-2xl overflow-hidden border border-white/10 relative group bg-black shadow-2xl">
              {apodData.media_type === 'video' ? (
                <div className="aspect-video w-full">
                  {apodData.url.endsWith('.mp4') ? (
                    <video controls className="w-full h-full object-cover">
                      <source src={apodData.url} type="video/mp4" />
                    </video>
                  ) : (
                    <iframe
                      src={apodData.url}
                      title={apodData.title}
                      className="w-full h-full"
                      allowFullScreen
                    />
                  )}
                </div>
              ) : (
                <div className="relative aspect-[4/3] w-full overflow-hidden">
                  <img
                    src={apodData.url}
                    alt={apodData.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-102 cursor-pointer"
                    onClick={() => setZoomModalOpen(true)}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = fallbackCapture.url;
                    }}
                  />

                  <button
                    onClick={() => setZoomModalOpen(true)}
                    className="absolute top-4 right-4 p-2 rounded-xl bg-[#050816]/70 hover:bg-[#050816] text-white border border-white/10 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Fullscreen Zoom"
                  >
                    <Maximize2 className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            {/* Media Action Row */}
            <div className="flex items-center justify-between text-xs font-mono text-[#94A3B8]">
              <span>CAPTURE DATE: {apodData.date}</span>
              <div className="flex items-center gap-3">
                <button
                  onClick={handleCopyLink}
                  className="flex items-center gap-1.5 hover:text-white transition-colors"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>{copied ? 'Copied URL!' : 'Share Capture'}</span>
                </button>
                {(apodData.hdurl || apodData.url) && (
                  <a
                    href={apodData.hdurl || apodData.url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 text-[#5DA9FF] hover:underline"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Open HD Source</span>
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Scientific Narrative (Right Column) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="glass-card rounded-2xl p-6 lg:p-8 border border-white/10 space-y-6 shadow-2xl">
              <div className="space-y-2 border-b border-white/10 pb-4">
                <span className="text-[11px] font-mono text-[#FBBF24] uppercase tracking-wider block">
                  Archival Capture Record · {apodData.media_type.toUpperCase()}
                </span>
                <h2 className="text-2xl lg:text-3xl font-bold font-headline text-white leading-tight">
                  {apodData.title}
                </h2>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs font-mono text-[#5DA9FF] uppercase tracking-wider">
                  <Info className="w-4 h-4" />
                  <span>Astronomical Annotation</span>
                </div>
                <p className="text-sm text-[#CBD5E1] leading-relaxed font-normal">
                  {apodData.explanation}
                </p>
              </div>

              {apodData.copyright && (
                <div className="pt-4 border-t border-white/5 text-[11px] font-mono text-[#94A3B8]">
                  Image Credit & Copyright: <span className="text-white">{apodData.copyright}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : null}

      {/* Recent Captures Filmstrip */}
      {recentCaptures.length > 0 && (
        <div className="space-y-4 pt-4 border-t border-white/10">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold font-headline text-white">Recent NASA APOD Captures</h3>
            <span className="text-xs font-mono text-[#94A3B8]">Click any capture to load</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {recentCaptures.map((item) => (
              <button
                key={item.date}
                onClick={() => {
                  setApodData(item);
                  setSelectedDate(item.date);
                }}
                className={`text-left rounded-xl overflow-hidden border transition-all bg-[#0B1026] ${
                  apodData?.date === item.date
                    ? 'border-[#FBBF24] shadow-[0_0_15px_rgba(251,191,36,0.25)]'
                    : 'border-white/10 hover:border-white/30'
                }`}
              >
                <div className="aspect-[4/3] bg-black relative">
                  {item.media_type === 'image' ? (
                    <img
                      src={item.url}
                      alt={item.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = fallbackCapture.url;
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-slate-900 text-[#5DA9FF] gap-1">
                      <PlayCircle className="w-7 h-7" />
                      <span className="text-[10px] font-mono">VIDEO</span>
                    </div>
                  )}
                </div>
                <div className="p-2.5 space-y-1">
                  <p className="text-[10px] font-mono text-[#FBBF24] tabular-nums">{item.date}</p>
                  <p className="text-xs font-semibold text-white line-clamp-1">{item.title}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Fullscreen Zoom Modal */}
      {zoomModalOpen && apodData && apodData.media_type !== 'video' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl animate-in fade-in duration-200">
          <button
            onClick={() => setZoomModalOpen(false)}
            className="absolute top-6 right-6 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white z-50 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
          <img
            src={apodData.hdurl || apodData.url}
            alt={apodData.title}
            referrerPolicy="no-referrer"
            className="max-h-[90vh] max-w-[95vw] object-contain rounded-lg shadow-2xl"
          />
        </div>
      )}
    </div>
  );
};
