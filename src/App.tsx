/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { NavigationRoute, ExplorerProfile, SpaceSound, JournalEntry } from './types';
import { INITIAL_EXPLORER_PROFILE } from './data/cosmicData';
import { StarfieldCanvas } from './components/StarfieldCanvas';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { AudioPlayerBar } from './components/AudioPlayerBar';
import { HomePage } from './pages/HomePage';
import { AiGuidePage } from './pages/AiGuidePage';
import { SolarSystemPage } from './pages/SolarSystemPage';
import { StarPatternsPage } from './pages/StarPatternsPage';
import { SpaceSoundsPage } from './pages/SpaceSoundsPage';
import { CosmicSearchPage } from './pages/CosmicSearchPage';
import { ApodPage } from './pages/ApodPage';
import { HabitableZonePage } from './pages/HabitableZonePage';
import { EarthPage } from './pages/EarthPage';
import { ProfilePage } from './pages/ProfilePage';
import { LoginPage } from './pages/LoginPage';
import { CosmicJournalPage } from './pages/CosmicJournalPage';
import { playCosmicPreset, stopCosmicAudio } from './services/synthAudio';
import {
  getJournalEntries,
  saveJournalEntry,
  deleteJournalEntry,
} from './services/journalService';

export default function App() {
  // Routing state + internal history stack so Back works cleanly inside preview iframes
  const [currentRoute, setCurrentRoute] = useState<NavigationRoute>('/');
  const [historyStack, setHistoryStack] = useState<NavigationRoute[]>(['/']);

  // Profile state with localStorage persistence
  const [profile, setProfile] = useState<ExplorerProfile>(() => {
    try {
      const saved = localStorage.getItem('qn_explorer_profile');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // ignore
    }
    return INITIAL_EXPLORER_PROFILE;
  });

  // Cosmic Journal entries with localStorage persistence
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>(() => {
    return getJournalEntries();
  });

  // Audio Player state
  const [currentSound, setCurrentSound] = useState<SpaceSound | null>(null);
  const [isPlayingSound, setIsPlayingSound] = useState<boolean>(false);
  const audioElemRef = React.useRef<HTMLAudioElement | null>(null);

  // Sync route from window.location on mount
  useEffect(() => {
    const normalizePath = (path: string): NavigationRoute => {
      const clean = path.replace(/\/$/, '') || '/';
      const validRoutes: NavigationRoute[] = [
        '/',
        '/ai-guide',
        '/solar-system',
        '/star-patterns',
        '/space-sounds',
        '/search',
        '/apod',
        '/habitable-zone',
        '/earth',
        '/profile',
        '/login',
        '/journal',
      ];
      return validRoutes.includes(clean as NavigationRoute)
        ? (clean as NavigationRoute)
        : '/';
    };

    const initialRoute = normalizePath(window.location.pathname);
    setCurrentRoute(initialRoute);
    setHistoryStack(initialRoute === '/' ? ['/'] : ['/', initialRoute]);

    const handlePopState = () => {
      const next = normalizePath(window.location.pathname);
      setCurrentRoute(next);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateTo = (route: NavigationRoute) => {
    if (route !== currentRoute) {
      window.history.pushState(null, '', route);
      setCurrentRoute(route);
      setHistoryStack((prev) => [...prev.slice(-24), route]);
      window.scrollTo({ top: 0, behavior: 'smooth' });

      // Increment mission count when visiting a mission route
      if (
        route !== '/' &&
        route !== '/login' &&
        route !== '/profile' &&
        route !== '/journal' &&
        route !== '/ai-guide'
      ) {
        setProfile((prev) => {
          const updated = {
            ...prev,
            missionsLaunched: prev.missionsLaunched + 1,
          };
          try {
            localStorage.setItem('qn_explorer_profile', JSON.stringify(updated));
          } catch {
            // ignore
          }
          return updated;
        });
      }
    }
  };

  const handleBack = () => {
    if (historyStack.length > 1) {
      const nextStack = historyStack.slice(0, -1);
      const target = nextStack[nextStack.length - 1] || '/';
      setHistoryStack(nextStack);
      window.history.pushState(null, '', target);
      setCurrentRoute(target);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (currentRoute !== '/') {
      window.history.pushState(null, '', '/');
      setCurrentRoute('/');
      setHistoryStack(['/']);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleUpdateProfile = (updates: Partial<ExplorerProfile>) => {
    setProfile((prev) => {
      const next = { ...prev, ...updates };
      try {
        localStorage.setItem('qn_explorer_profile', JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
  };

  const handleToggleBookmark = (id: string) => {
    setProfile((prev) => {
      const isAlready = prev.bookmarkedIds.includes(id);
      const nextIds = isAlready
        ? prev.bookmarkedIds.filter((bId) => bId !== id)
        : [...prev.bookmarkedIds, id];
      const updated = { ...prev, bookmarkedIds: nextIds };
      try {
        localStorage.setItem('qn_explorer_profile', JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
  };

  // Cosmic Journal handlers
  const handleSaveJournalEntry = (
    entryData: {
      title: string;
      content: string;
      category: JournalEntry['category'];
      targetSubject?: string;
      tags: string[];
    },
    existingId?: string
  ) => {
    const updated = saveJournalEntry(entryData, existingId);
    setJournalEntries(updated);
  };

  const handleDeleteJournalEntry = (id: string) => {
    const updated = deleteJournalEntry(id);
    setJournalEntries(updated);
  };

  // Space Audio Control
  const handlePlaySound = (sound: SpaceSound) => {
    if (currentSound?.id === sound.id && isPlayingSound) {
      stopCosmicAudio();
      if (audioElemRef.current) {
        audioElemRef.current.pause();
      }
      setIsPlayingSound(false);
      return;
    }

    stopCosmicAudio();
    if (audioElemRef.current) {
      audioElemRef.current.pause();
    }

    setCurrentSound(sound);
    setIsPlayingSound(true);

    if (sound.audioUrl && audioElemRef.current) {
      audioElemRef.current.src = sound.audioUrl;
      audioElemRef.current
        .play()
        .catch(() => {
          playCosmicPreset(sound.synthPreset || 'solar-wind');
        });
    } else if (sound.synthPreset) {
      playCosmicPreset(sound.synthPreset);
    } else {
      playCosmicPreset('solar-wind');
    }
  };

  const handleToggleAudioPlay = () => {
    if (!currentSound) return;
    if (isPlayingSound) {
      stopCosmicAudio();
      if (audioElemRef.current) {
        audioElemRef.current.pause();
      }
      setIsPlayingSound(false);
    } else {
      handlePlaySound(currentSound);
    }
  };

  const handleCloseAudio = () => {
    stopCosmicAudio();
    if (audioElemRef.current) {
      audioElemRef.current.pause();
    }
    setIsPlayingSound(false);
    setCurrentSound(null);
  };

  // Render current view
  const renderCurrentView = () => {
    switch (currentRoute) {
      case '/':
        return <HomePage onNavigate={navigateTo} profile={profile} />;
      case '/ai-guide':
        return <AiGuidePage onBack={handleBack} />;
      case '/solar-system':
        return (
          <SolarSystemPage
            profile={profile}
            onToggleBookmark={handleToggleBookmark}
            onNavigate={navigateTo}
            onBack={handleBack}
          />
        );
      case '/star-patterns':
        return (
          <StarPatternsPage
            profile={profile}
            onToggleBookmark={handleToggleBookmark}
            onBack={handleBack}
          />
        );
      case '/space-sounds':
        return (
          <SpaceSoundsPage
            profile={profile}
            currentSound={currentSound}
            isPlaying={isPlayingSound}
            onPlaySound={handlePlaySound}
            onToggleBookmark={handleToggleBookmark}
            onBack={handleBack}
          />
        );
      case '/search':
        return <CosmicSearchPage onBack={handleBack} />;
      case '/apod':
        return <ApodPage onBack={handleBack} />;
      case '/habitable-zone':
        return (
          <HabitableZonePage
            profile={profile}
            onToggleBookmark={handleToggleBookmark}
            onBack={handleBack}
          />
        );
      case '/earth':
        return <EarthPage onBack={handleBack} />;
      case '/journal':
        return (
          <CosmicJournalPage
            entries={journalEntries}
            onSaveEntry={handleSaveJournalEntry}
            onDeleteEntry={handleDeleteJournalEntry}
            onBack={handleBack}
          />
        );
      case '/profile':
        return (
          <ProfilePage
            profile={profile}
            journalEntries={journalEntries}
            onUpdateProfile={handleUpdateProfile}
            onNavigate={navigateTo}
            onBack={handleBack}
          />
        );
      case '/login':
        return (
          <LoginPage
            onNavigate={navigateTo}
            onLoginSuccess={(data) => handleUpdateProfile(data)}
            onBack={handleBack}
          />
        );
      default:
        return <HomePage onNavigate={navigateTo} profile={profile} />;
    }
  };

  const isLoginPage = currentRoute === '/login';

  return (
    <div className="relative min-h-screen bg-[#050816] text-[#F8FAFC] flex flex-col justify-between selection:bg-[#5DA9FF]/30 selection:text-[#5DA9FF]">
      {/* Background Starfield Canvas Particles */}
      <StarfieldCanvas density={120} />

      {/* Hidden audio tag for streaming */}
      <audio
        ref={audioElemRef}
        onEnded={() => setIsPlayingSound(false)}
        className="hidden"
      />

      {/* Navigation (hidden on dedicated login screen) */}
      {!isLoginPage && (
        <Navbar
          currentRoute={currentRoute}
          onNavigate={navigateTo}
          profile={profile}
        />
      )}

      {/* Primary Page Content */}
      <main className="relative z-10 flex-grow">
        {renderCurrentView()}
      </main>

      {/* Footer (hidden on dedicated login screen) */}
      {!isLoginPage && <Footer onNavigate={navigateTo} />}

      {/* Persistent Audio Mini-Player Bar */}
      <AudioPlayerBar
        currentSound={currentSound}
        isPlaying={isPlayingSound}
        onTogglePlay={handleToggleAudioPlay}
        onClose={handleCloseAudio}
      />
    </div>
  );
}
