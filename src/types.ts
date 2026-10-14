export type DivisionTier = 'Bronze' | 'Silver' | 'Gold' | 'Platinum' | 'Diamond' | 'Apex Grandmaster';

export interface CarCustomization {
  color: string;
  underglow: string; // e.g. '#00ffff' or 'none'
  spoilerLevel: number; // 0 to 3
  engineLevel: number; // 1 to 5
  nitroLevel: number; // 1 to 5
  tiresLevel: number; // 1 to 5
  wheelsStyle: string; // 'sport' | 'star' | 'cyber' | 'gold'
}

export interface CarModel {
  id: string;
  name: string;
  tagline: string;
  category: 'Street' | 'Tuner' | 'Super' | 'Hyper' | 'Prototype';
  price: number;
  baseAcceleration: number; // visual progression speed multiplier
  baseHandling: number;
  unlockedByDefault?: boolean;
  defaultColor: string;
  accentColor: string;
  description: string;
}

export interface UserStats {
  racesCount: number;
  winsCount: number;
  secondPlaceCount: number;
  thirdPlaceCount: number;
  bestWpm: number;
  averageWpm: number;
  totalWordsTyped: number;
  totalCharsTyped: number;
  averageAccuracy: number;
  nitroCoins: number;
  xp: number;
  level: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
  category: 'Speed' | 'Precision' | 'Endurance' | 'Collector';
  progress?: number;
  maxProgress?: number;
}

export interface DailyQuest {
  id: string;
  title: string;
  description: string;
  rewardCoins: number;
  rewardXp: number;
  progress: number;
  target: number;
  completed: boolean;
  claimed: boolean;
  iconName: string;
}

export interface UserProfile {
  id: string;
  username: string;
  displayName: string;
  bio: string;
  avatar: string;
  title: string;
  tier: DivisionTier;
  selectedCarId: string;
  carCustomizations: Record<string, CarCustomization>;
  ownedCarIds: string[];
  stats: UserStats;
  achievements: Achievement[];
  dailyQuests: DailyQuest[];
  isGuest: boolean;
  createdAt: string;
}

export interface Racer {
  id: string;
  name: string;
  isPlayer: boolean;
  avatar: string;
  carId: string;
  customization: CarCustomization;
  wpm: number;
  rawWpm: number;
  accuracy: number;
  progress: number; // 0 to 100
  finished: boolean;
  finishTime: number | null; // seconds
  rank?: number;
  isBot?: boolean;
  targetWpm?: number;
  currentWordIndex?: number;
  nitroActive?: boolean;
  statusMessage?: string;
}

export type RaceMode = 'multiplayer' | 'practice' | 'custom_room';

export type RaceStatus = 'lobby' | 'countdown' | 'racing' | 'finished';

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  senderTier: DivisionTier;
  text: string;
  timestamp: number;
  isQuickRadio?: boolean;
}

export interface LeaderboardRacer {
  id: string;
  name: string;
  avatar: string;
  title: string;
  tier: DivisionTier;
  bestWpm: number;
  wins: number;
  races: number;
  winRate: number;
  carId: string;
  isCurrentPlayer?: boolean;
}
