export type NavigationRoute =
  | '/'
  | '/solar-system'
  | '/star-patterns'
  | '/space-sounds'
  | '/search'
  | '/apod'
  | '/habitable-zone'
  | '/earth'
  | '/profile'
  | '/login'
  | '/journal'
  | '/ai-guide';

export interface Moon {
  name: string;
  details: string;
}

export interface CelestialBody {
  id: string;
  name: string;
  type: 'Star' | 'Terrestrial' | 'Gas Giant' | 'Ice Giant' | 'Dwarf Planet';
  dist: string;
  distAU: number;
  gravity: string;
  temp: string;
  details: string;
  surface: string;
  atmosphere: string;
  moons: number;
  moonList: Moon[];
  discovery: string;
  day?: string;
  orbitalPeriodDays?: number;
  radiusKm?: number;
  imageUrl?: string;
  eyesTarget?: string;
  imageHint?: string;
  color: string;
}

export interface ConstellationStar {
  name: string;
  mag: number;
  x: number; // percentage in view
  y: number;
}

export interface Constellation {
  id: string;
  name: string;
  aka: string;
  stars: string;
  details: string;
  hemisphere: 'Northern' | 'Southern' | 'Equatorial';
  myth: string;
  visible: string;
  majorStars: ConstellationStar[];
  lines: [number, number][]; // index pairs to connect
  mythologyCulture: {
    greek: string;
    indigenousOrGlobal: string;
  };
}

export interface SpaceSound {
  id: string;
  title: string;
  description: string;
  audioUrl?: string;
  synthPreset?: 'pulsar' | 'black-hole' | 'solar-wind' | 'plasma-wave' | 'magnetosphere' | 'radio-burst';
  date: string;
  category: 'Black Hole' | 'Sonification' | 'Planetary' | 'Deep Space';
  duration?: string;
  instrument?: string;
}

export interface Exoplanet {
  id: string;
  name: string;
  dist: string;
  distLy: number;
  star: string;
  starType: 'M' | 'K' | 'G' | 'F';
  hzIndex: string; // Earth Similarity Index
  temp: string;
  tempKelvin: number;
  notes: string;
  orbitalPeriodDays: number;
  semiMajorAxisAU: number;
  radiusEarthRatio: number;
  massEarthRatio: number;
  habitabilityScore: number; // 0 - 100
  potentialWater: 'Confirmed Vapor' | 'Likely Liquid' | 'Potential Liquid' | 'Subsurface Only';
}

export interface NearEarthObject {
  id: string;
  name: string;
  hazardous: boolean;
  speed: string;
  distance: string;
  size: string;
  closeApproachDate: string;
}

export interface SpaceWeatherEvent {
  id: string;
  type: string;
  date: string;
  message: string;
  severity: 'Routine' | 'Moderate' | 'High' | 'Severe';
}

export interface APODCapture {
  date: string;
  title: string;
  explanation: string;
  url: string;
  hdurl?: string;
  media_type: 'image' | 'video' | 'error';
  copyright?: string;
}

export interface AchievementBadge {
  id: string;
  title: string;
  description: string;
  iconName: 'zap' | 'bookmark' | 'book' | 'compass' | 'orbit' | 'radio' | 'globe' | 'award' | 'sparkles' | 'eye';
  category: 'missions' | 'bookmarks' | 'journal' | 'audio' | 'exploration';
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
  currentValue: number;
  targetValue: number;
  isUnlocked: boolean;
  unlockedAt?: string;
}

export interface JournalEntry {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  targetSubject?: string;
  category: 'Observation' | 'Theory' | 'Mission Log' | 'Sonification' | 'General';
  tags: string[];
}

export interface ExplorerProfile {
  id: string;
  displayName: string;
  email: string;
  rank: string;
  rankLevel: number;
  photoURL?: string;
  joinedDate: string;
  lastActive: string;
  bookmarkedIds: string[];
  missionsLaunched: number;
  listeningTimeMinutes: number;
}

export interface NasaMediaItem {
  nasaId: string;
  title: string;
  description: string;
  mediaType: 'image' | 'video' | 'audio';
  dateCreated: string;
  center?: string;
  thumbUrl?: string;
  mediaUrl?: string;
  keywords?: string[];
}

export interface EpicImageItem {
  identifier: string;
  caption: string;
  date: string;
  imageUrl: string;
  centroid: {
    lat: number;
    lon: number;
  };
  dscovrDistanceKm?: number;
}

export interface SmallBodyItem {
  id: string;
  name: string;
  category: 'Asteroid' | 'Comet';
  mission: string;
  diameter: string;
  orbitPeriod: string;
  summary: string;
  imageUrl: string;
  eyesTarget?: string;
}

