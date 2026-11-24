import React, { useState } from 'react';
import { ExplorerProfile, NavigationRoute, JournalEntry, AchievementBadge } from '../types';
import { CELESTIAL_BODIES, SPACE_SOUNDS, EXOPLANETS, CONSTELLATIONS } from '../data/cosmicData';
import { calculateBadges } from '../services/badgeService';
import { BackButton } from '../components/BackButton';
import {
  User,
  Award,
  Bookmark,
  Radio,
  Compass,
  Edit2,
  Check,
  X,
  Orbit,
  Sparkles,
  ArrowRight,
  BookOpen,
  Zap,
  Globe,
  Lock,
} from 'lucide-react';

interface ProfilePageProps {
  profile: ExplorerProfile;
  journalEntries: JournalEntry[];
  onUpdateProfile: (updated: Partial<ExplorerProfile>) => void;
  onNavigate: (route: NavigationRoute) => void;
  onBack?: () => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({
  profile,
  journalEntries,
  onUpdateProfile,
  onNavigate,
  onBack,
}) => {
  const [editing, setEditing] = useState<boolean>(false);
  const [callsign, setCallsign] = useState<string>(profile.displayName);
  const [badgeCategory, setBadgeCategory] = useState<string>('All');

  const badges = calculateBadges(profile, journalEntries);
  const unlockedBadgesCount = badges.filter((b) => b.isUnlocked).length;

  const filteredBadges = badges.filter((b) => {
    if (badgeCategory === 'All') return true;
    return b.category.toLowerCase() === badgeCategory.toLowerCase();
  });

  const handleSave = () => {
    onUpdateProfile({
      displayName: callsign.trim() || 'Explorer',
    });
    setEditing(false);
  };

  // Find bookmarked objects
  const bookmarkedBodies = CELESTIAL_BODIES.filter((b) =>
    profile.bookmarkedIds.includes(b.id)
  );
  const bookmarkedSounds = SPACE_SOUNDS.filter((s) =>
    profile.bookmarkedIds.includes(s.id)
  );
  const bookmarkedPlanets = EXOPLANETS.filter((p) =>
    profile.bookmarkedIds.includes(p.id)
  );
  const bookmarkedConstellations = CONSTELLATIONS.filter((c) =>
    profile.bookmarkedIds.includes(c.id)
  );

  const renderBadgeIcon = (iconName: AchievementBadge['iconName']) => {
    switch (iconName) {
      case 'zap':
        return <Zap className="w-5 h-5 text-amber-300" />;
      case 'compass':
        return <Compass className="w-5 h-5 text-[#34D399]" />;
      case 'bookmark':
        return <Bookmark className="w-5 h-5 text-[#5DA9FF]" />;
      case 'book':
        return <BookOpen className="w-5 h-5 text-[#A78BFA]" />;
      case 'orbit':
        return <Orbit className="w-5 h-5 text-[#38BDF8]" />;
      case 'radio':
        return <Radio className="w-5 h-5 text-[#F472B6]" />;
      case 'globe':
        return <Globe className="w-5 h-5 text-[#6EE7B7]" />;
      case 'sparkles':
        return <Sparkles className="w-5 h-5 text-yellow-300" />;
      default:
        return <Award className="w-5 h-5 text-[#5DA9FF]" />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-10 space-y-12">
      {onBack && (
        <div>
          <BackButton onBack={onBack} label="Back" />
        </div>
      )}

      {/* Header Profile Identity Card */}
      <div className="glass-card rounded-3xl p-6 lg:p-10 border border-white/10 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#5DA9FF]/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-8">
          {/* Avatar Icon */}
          <div className="relative">
            <div className="w-24 h-24 lg:w-28 lg:h-28 rounded-2xl cosmic-gradient p-1 flex items-center justify-center text-white shadow-[0_0_35px_rgba(93,169,255,0.4)]">
              <User className="w-12 h-12 stroke-[1.5]" />
            </div>
            <div className="absolute -bottom-2 -right-2 bg-[#5DA9FF] text-[#050816] p-1.5 rounded-lg font-mono text-[10px] font-bold shadow">
              LVL {profile.rankLevel}
            </div>
          </div>

          {/* Details & Callsign Edit */}
          <div className="flex-1 text-center md:text-left space-y-3">
            <div className="flex flex-col sm:flex-row items-center gap-3">
              {editing ? (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={callsign}
                    onChange={(e) => setCallsign(e.target.value)}
                    className="px-3 py-1.5 rounded-lg bg-white/10 border border-[#5DA9FF] text-white text-xl font-bold font-headline focus:outline-none"
                    placeholder="Explorer Callsign"
                  />
                  <button
                    onClick={handleSave}
                    className="p-2 rounded-lg bg-[#5DA9FF] text-[#050816] hover:bg-[#5DA9FF]/90 transition-colors"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      setCallsign(profile.displayName);
                      setEditing(false);
                    }}
                    className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <h1 className="text-3xl lg:text-4xl font-extrabold font-headline text-white">
                    {profile.displayName}
                  </h1>
                  <button
                    onClick={() => setEditing(true)}
                    className="p-1.5 rounded-lg hover:bg-white/10 text-[#94A3B8] hover:text-[#5DA9FF] transition-colors"
                    title="Edit Callsign"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs font-mono text-[#94A3B8]">
              <span className="text-[#5DA9FF] font-semibold">{profile.rank}</span>
              <span className="text-white/20">·</span>
              <span>ID: {profile.id}</span>
              <span className="text-white/20">·</span>
              <span>Joined: {profile.joinedDate}</span>
            </div>

            <p className="text-xs text-[#CBD5E1] font-mono">{profile.email}</p>
          </div>

          {/* Explorer Progress Scoreboard */}
          <div className="flex sm:flex-col gap-4 border-t sm:border-t-0 sm:border-l border-white/10 pt-4 sm:pt-0 sm:pl-8 text-right">
            <div>
              <span className="text-[10px] font-mono text-[#94A3B8] uppercase block">
                Missions Launched
              </span>
              <span className="text-2xl font-extrabold font-mono text-white tabular-nums">
                {profile.missionsLaunched}
              </span>
            </div>
            <div>
              <span className="text-[10px] font-mono text-[#94A3B8] uppercase block">
                Badges Unlocked
              </span>
              <span className="text-2xl font-extrabold font-mono text-[#5DA9FF] tabular-nums">
                {unlockedBadgesCount} / {badges.length}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Achievement Badges Section */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 border-b border-white/10 pb-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-[#5DA9FF] uppercase tracking-wider mb-1">
              <Award className="w-4 h-4 text-[#5DA9FF]" />
              <span>Explorer Honors · Achievement Badges</span>
            </div>
            <h2 className="text-2xl lg:text-3xl font-bold font-headline text-white">
              Mission Achievements & Accolades
            </h2>
          </div>

          {/* Badge Filter Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-[#050816]/70 rounded-xl border border-white/10 text-xs">
            {['All', 'Missions', 'Bookmarks', 'Journal'].map((cat) => (
              <button
                key={cat}
                onClick={() => setBadgeCategory(cat)}
                className={`px-3 py-1.5 rounded-lg font-mono font-medium transition-colors ${
                  badgeCategory === cat
                    ? 'bg-[#5DA9FF] text-[#050816] font-bold shadow-md'
                    : 'text-[#94A3B8] hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Badges Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredBadges.map((badge) => {
            const pct = Math.min(100, Math.round((badge.currentValue / badge.targetValue) * 100));

            return (
              <div
                key={badge.id}
                className={`rounded-2xl p-5 border flex flex-col justify-between transition-all relative overflow-hidden ${
                  badge.isUnlocked
                    ? 'glass-card-interactive border-white/15 shadow-[0_0_25px_rgba(93,169,255,0.15)]'
                    : 'bg-[#0B1026]/40 border-white/5 opacity-70'
                }`}
              >
                {badge.isUnlocked && (
                  <div className="absolute -top-12 -right-12 w-28 h-28 bg-[#5DA9FF]/10 rounded-full blur-xl pointer-events-none" />
                )}

                <div className="space-y-3 relative z-10">
                  {/* Badge Header: Insignia + Tier */}
                  <div className="flex items-center justify-between">
                    <div
                      className={`w-11 h-11 rounded-xl flex items-center justify-center border shadow-md ${
                        badge.isUnlocked
                          ? 'bg-gradient-to-br from-white/10 to-white/5 border-white/20'
                          : 'bg-black/30 border-white/5'
                      }`}
                    >
                      {badge.isUnlocked ? (
                        renderBadgeIcon(badge.iconName)
                      ) : (
                        <Lock className="w-4 h-4 text-slate-500" />
                      )}
                    </div>

                    <span
                      className={`text-[10px] font-mono uppercase tracking-wider font-bold ${
                        badge.isUnlocked
                          ? badge.tier === 'gold'
                            ? 'text-amber-300'
                            : badge.tier === 'silver'
                            ? 'text-cyan-300'
                            : 'text-orange-300'
                          : 'text-slate-500'
                      }`}
                    >
                      {badge.tier} Tier
                    </span>
                  </div>

                  {/* Title & Description */}
                  <div>
                    <h3
                      className={`text-base font-bold font-headline leading-tight ${
                        badge.isUnlocked ? 'text-white' : 'text-slate-400'
                      }`}
                    >
                      {badge.title}
                    </h3>
                    <p className="text-xs text-[#94A3B8] mt-1 leading-relaxed">
                      {badge.description}
                    </p>
                  </div>
                </div>

                {/* Progress Strip */}
                <div className="pt-4 border-t border-white/5 mt-4 space-y-1.5 relative z-10">
                  <div className="flex justify-between items-center text-[10px] font-mono">
                    <span className="text-[#94A3B8]">
                      {badge.isUnlocked ? 'Status: Unlocked' : 'Progress'}
                    </span>
                    <span
                      className={`font-bold tabular-nums ${
                        badge.isUnlocked ? 'text-emerald-400' : 'text-white'
                      }`}
                    >
                      {badge.currentValue} / {badge.targetValue}
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        badge.isUnlocked
                          ? 'bg-gradient-to-r from-[#5DA9FF] to-[#34D399]'
                          : 'bg-slate-700'
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Cosmic Journal Spotlight in Profile */}
      <div className="glass-card rounded-3xl p-6 lg:p-8 border border-white/10 space-y-6 shadow-2xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-mono text-[#A78BFA] uppercase tracking-wider">
              <BookOpen className="w-4 h-4" />
              <span>Personal Cosmic Journal</span>
            </div>
            <h2 className="text-2xl font-bold font-headline text-white">
              Recent Scientific Reflections ({journalEntries.length})
            </h2>
          </div>

          <button
            onClick={() => onNavigate('/journal')}
            className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-mono flex items-center gap-2 transition-colors"
          >
            <span>Open Full Journal</span>
            <ArrowRight className="w-4 h-4 text-[#5DA9FF]" />
          </button>
        </div>

        {journalEntries.length === 0 ? (
          <div className="text-center py-6 space-y-2">
            <p className="text-sm text-[#94A3B8]">No personal reflections penned yet.</p>
            <button
              onClick={() => onNavigate('/journal')}
              className="text-xs font-mono text-[#5DA9FF] hover:underline"
            >
              + Create your first entry in the Cosmic Journal
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {journalEntries.slice(0, 3).map((entry) => (
              <div
                key={entry.id}
                onClick={() => onNavigate('/journal')}
                className="p-5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 cursor-pointer space-y-2 transition-colors"
              >
                <div className="flex items-center justify-between text-[10px] font-mono text-[#94A3B8]">
                  <span className="text-[#5DA9FF] font-bold uppercase">{entry.category}</span>
                  <span>{new Date(entry.createdAt).toLocaleDateString()}</span>
                </div>
                <h4 className="font-bold text-sm font-headline text-white line-clamp-1">
                  {entry.title}
                </h4>
                <p className="text-xs text-[#94A3B8] line-clamp-2 leading-relaxed">
                  {entry.content}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bookmarks Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-2">
            <Bookmark className="w-5 h-5 text-[#5DA9FF]" />
            <h2 className="text-2xl font-bold font-headline text-white">
              Personal Archival Bookmarks
            </h2>
          </div>
          <span className="text-xs font-mono text-[#94A3B8]">
            {profile.bookmarkedIds.length} Items Saved
          </span>
        </div>

        {profile.bookmarkedIds.length === 0 ? (
          <div className="glass-card rounded-2xl p-10 text-center space-y-3">
            <Bookmark className="w-10 h-10 text-slate-600 mx-auto" />
            <p className="text-white font-headline text-lg font-bold">No Celestial Records Bookmarked</p>
            <p className="text-xs text-[#94A3B8] max-w-sm mx-auto">
              Click the bookmark icon on any planet, constellation, exoplanet, or audio sonification to pin it to your explorer hub.
            </p>
            <button
              onClick={() => onNavigate('/solar-system')}
              className="mt-3 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white font-mono text-xs uppercase"
            >
              Browse Planetary Catalog
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Celestial Bodies Bookmarks */}
            {bookmarkedBodies.map((b) => (
              <div
                key={b.id}
                onClick={() => onNavigate('/solar-system')}
                className="glass-card-interactive rounded-2xl p-5 border border-white/10 cursor-pointer space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-[#5DA9FF] bg-[#5DA9FF]/10 px-2 py-0.5 rounded">
                    {b.type}
                  </span>
                  <Orbit className="w-4 h-4 text-[#5DA9FF]" />
                </div>
                <h3 className="text-lg font-bold font-headline text-white">{b.name}</h3>
                <p className="text-xs text-[#94A3B8] line-clamp-2">{b.details}</p>
                <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-[#5DA9FF]">
                  <span>View Orbit Record</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            ))}

            {/* Space Sounds Bookmarks */}
            {bookmarkedSounds.map((s) => (
              <div
                key={s.id}
                onClick={() => onNavigate('/space-sounds')}
                className="glass-card-interactive rounded-2xl p-5 border border-white/10 cursor-pointer space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-[#F472B6] bg-[#F472B6]/10 px-2 py-0.5 rounded">
                    {s.category}
                  </span>
                  <Radio className="w-4 h-4 text-[#F472B6]" />
                </div>
                <h3 className="text-lg font-bold font-headline text-white">{s.title}</h3>
                <p className="text-xs text-[#94A3B8] line-clamp-2">{s.description}</p>
                <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-[#F472B6]">
                  <span>Listen Sonification</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            ))}

            {/* Exoplanets Bookmarks */}
            {bookmarkedPlanets.map((p) => (
              <div
                key={p.id}
                onClick={() => onNavigate('/habitable-zone')}
                className="glass-card-interactive rounded-2xl p-5 border border-white/10 cursor-pointer space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-[#34D399] bg-[#34D399]/10 px-2 py-0.5 rounded font-bold">
                    ESI {p.hzIndex}
                  </span>
                  <Compass className="w-4 h-4 text-[#34D399]" />
                </div>
                <h3 className="text-lg font-bold font-headline text-white">{p.name}</h3>
                <p className="text-xs text-[#94A3B8] line-clamp-2">{p.notes}</p>
                <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-[#34D399]">
                  <span>Habitable Zone Record</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            ))}

            {/* Constellations Bookmarks */}
            {bookmarkedConstellations.map((c) => (
              <div
                key={c.id}
                onClick={() => onNavigate('/star-patterns')}
                className="glass-card-interactive rounded-2xl p-5 border border-white/10 cursor-pointer space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-[#A78BFA] bg-[#A78BFA]/10 px-2 py-0.5 rounded">
                    {c.hemisphere}
                  </span>
                  <Sparkles className="w-4 h-4 text-[#A78BFA]" />
                </div>
                <h3 className="text-lg font-bold font-headline text-white">{c.name}</h3>
                <p className="text-xs text-[#94A3B8] line-clamp-2">{c.details}</p>
                <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-[#A78BFA]">
                  <span>Inspect Star Atlas</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
