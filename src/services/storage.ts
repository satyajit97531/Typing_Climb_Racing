import { 
  UserProfile, 
  CarCustomization, 
  LeaderboardRacer, 
  DivisionTier, 
  ChatMessage, 
  DailyQuest
} from '../types';
import { INITIAL_ACHIEVEMENTS } from '../data/achievements';
import { generateDailyQuests, getTodayDateString } from '../data/quests';
import { CAR_MODELS } from '../data/cars';

const STORAGE_KEY_USER = 'turbotype_active_user_v2';
const STORAGE_KEY_USERS = 'turbotype_registered_users_v2';
const STORAGE_KEY_LEADERBOARD = 'turbotype_leaderboards_v2';
const STORAGE_KEY_CHAT = 'turbotype_chat_history_v2';
const STORAGE_KEY_QUEST_DATE = 'turbotype_quest_date_v2';

export function calculateTier(wpm: number, wins: number): DivisionTier {
  if (wpm >= 95 || wins >= 40) return 'Apex Grandmaster';
  if (wpm >= 80 || wins >= 25) return 'Diamond';
  if (wpm >= 65 || wins >= 15) return 'Platinum';
  if (wpm >= 50 || wins >= 8) return 'Gold';
  if (wpm >= 35 || wins >= 3) return 'Silver';
  return 'Bronze';
}

const DEFAULT_CUSTOMIZATION: CarCustomization = {
  color: '#f97316',
  underglow: 'none',
  spoilerLevel: 0,
  engineLevel: 1,
  nitroLevel: 1,
  tiresLevel: 1,
  wheelsStyle: 'sport',
};

export function createDefaultUser(isGuest: boolean = true, username?: string, displayName?: string): UserProfile {
  const randomNum = Math.floor(100 + Math.random() * 900);
  const genUsername = username || `racer_${randomNum}`;
  const genDisplay = displayName || `Apex Pilot #${randomNum}`;
  const today = getTodayDateString();

  return {
    id: `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    username: genUsername,
    displayName: genDisplay,
    bio: 'Pushing the redline on every keystroke. Born to type, built to race.',
    avatar: '🏎️',
    title: 'Rookie Racer',
    tier: 'Bronze',
    selectedCarId: 'velocity-r1',
    ownedCarIds: ['velocity-r1'],
    carCustomizations: {
      'velocity-r1': { ...DEFAULT_CUSTOMIZATION },
    },
    stats: {
      racesCount: 0,
      winsCount: 0,
      secondPlaceCount: 0,
      thirdPlaceCount: 0,
      bestWpm: 0,
      averageWpm: 0,
      totalWordsTyped: 0,
      totalCharsTyped: 0,
      averageAccuracy: 100,
      nitroCoins: 450, // Starter bonus!
      xp: 0,
      level: 1,
    },
    achievements: JSON.parse(JSON.stringify(INITIAL_ACHIEVEMENTS)),
    dailyQuests: generateDailyQuests(today),
    isGuest,
    createdAt: new Date().toISOString(),
  };
}

export function getActiveUser(): UserProfile {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_USER);
    if (raw) {
      const user: UserProfile = JSON.parse(raw);
      // Ensure daily quests are up to date
      const savedDate = localStorage.getItem(STORAGE_KEY_QUEST_DATE);
      const today = getTodayDateString();
      if (savedDate !== today || !user.dailyQuests || user.dailyQuests.length === 0) {
        user.dailyQuests = generateDailyQuests(today);
        localStorage.setItem(STORAGE_KEY_QUEST_DATE, today);
      }
      // Ensure starter vehicle variety is immediately unlocked and coins are available
      if (!user.ownedCarIds) {
        user.ownedCarIds = ['velocity-r1', 'quad-bike'];
      } else if (!user.ownedCarIds.includes('quad-bike')) {
        user.ownedCarIds.push('quad-bike');
      }
      if (!user.stats.nitroCoins || user.stats.nitroCoins < 1500) {
        user.stats.nitroCoins = Math.max(user.stats.nitroCoins || 0, 2500);
      }
      saveActiveUser(user);
      return user;
    }
  } catch (e) {
    console.error('Failed to parse user from localStorage', e);
  }

  const freshUser = createDefaultUser(true);
  freshUser.ownedCarIds = ['velocity-r1', 'quad-bike'];
  freshUser.stats.nitroCoins = 3000;
  saveActiveUser(freshUser);
  return freshUser;
}

export function saveActiveUser(user: UserProfile) {
  try {
    // Recalculate level from XP
    const calculatedLevel = Math.max(1, Math.floor(user.stats.xp / 300) + 1);
    user.stats.level = calculatedLevel;
    user.tier = calculateTier(user.stats.bestWpm, user.stats.winsCount);

    localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(user));

    // Also update registered users store if registered
    if (!user.isGuest) {
      const usersRaw = localStorage.getItem(STORAGE_KEY_USERS);
      const users: Record<string, UserProfile> = usersRaw ? JSON.parse(usersRaw) : {};
      users[user.username.toLowerCase()] = user;
      localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(users));
    }
  } catch (e) {
    console.error('Failed to save user', e);
  }
}

export function registerUser(username: string, password: string, displayName: string): { success: boolean; message: string; user?: UserProfile } {
  const cleanUsername = username.trim().toLowerCase();
  if (cleanUsername.length < 3) {
    return { success: false, message: 'Username must be at least 3 characters' };
  }
  if (password.length < 4) {
    return { success: false, message: 'Password must be at least 4 characters' };
  }

  const usersRaw = localStorage.getItem(STORAGE_KEY_USERS);
  const users: Record<string, UserProfile & { passwordHash?: string }> = usersRaw ? JSON.parse(usersRaw) : {};

  if (users[cleanUsername]) {
    return { success: false, message: 'Username is already taken' };
  }

  // Preserve existing guest stats if present
  const currentGuest = getActiveUser();
  const newUser = createDefaultUser(false, cleanUsername, displayName.trim() || cleanUsername);
  
  if (currentGuest.isGuest) {
    // Transfer stats & garage from guest session!
    newUser.stats = { ...currentGuest.stats };
    newUser.ownedCarIds = [...currentGuest.ownedCarIds];
    newUser.carCustomizations = { ...currentGuest.carCustomizations };
    newUser.selectedCarId = currentGuest.selectedCarId;
    newUser.achievements = [...currentGuest.achievements];
  }

  users[cleanUsername] = {
    ...newUser,
    passwordHash: btoa(password), // standard client-side credential store
  };

  localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(users));
  saveActiveUser(newUser);
  return { success: true, message: 'Account registered successfully!', user: newUser };
}

export function loginUser(username: string, password: string): { success: boolean; message: string; user?: UserProfile } {
  const cleanUsername = username.trim().toLowerCase();
  const usersRaw = localStorage.getItem(STORAGE_KEY_USERS);
  const users: Record<string, UserProfile & { passwordHash?: string }> = usersRaw ? JSON.parse(usersRaw) : {};

  const existing = users[cleanUsername];
  if (!existing) {
    return { success: false, message: 'Invalid username or password' };
  }

  if (existing.passwordHash !== btoa(password)) {
    return { success: false, message: 'Invalid username or password' };
  }

  const loggedUser: UserProfile = { ...existing };
  delete (loggedUser as unknown as { passwordHash?: string }).passwordHash;
  saveActiveUser(loggedUser);
  return { success: true, message: 'Welcome back, racer!', user: loggedUser };
}

export function recordRaceFinish(user: UserProfile, result: {
  rank: number;
  wpm: number;
  rawWpm: number;
  accuracy: number;
  wordsTyped: number;
  charsTyped: number;
  streakMax: number;
  flawless: boolean;
}): { updatedUser: UserProfile; coinsEarned: number; xpEarned: number; newAchievements: string[] } {
  const isWin = result.rank === 1;
  const isPodium = result.rank <= 3;

  // Reward formula based on position, WPM and accuracy
  let coinsEarned = 50 + Math.round(result.wpm * 1.5) + (result.accuracy >= 98 ? 30 : 0);
  let xpEarned = 40 + Math.round(result.wpm * 1.2);

  if (isWin) {
    coinsEarned += 120;
    xpEarned += 100;
  } else if (result.rank === 2) {
    coinsEarned += 60;
    xpEarned += 50;
  } else if (result.rank === 3) {
    coinsEarned += 30;
    xpEarned += 25;
  }

  // Apply engine/nitro bonus multiplier if upgraded
  const currentCar = user.carCustomizations[user.selectedCarId];
  if (currentCar) {
    const bonus = 1 + (currentCar.engineLevel - 1) * 0.05 + (currentCar.nitroLevel - 1) * 0.05;
    coinsEarned = Math.round(coinsEarned * bonus);
  }

  const prevRaces = user.stats.racesCount;
  const newRaces = prevRaces + 1;
  const newWins = isWin ? user.stats.winsCount + 1 : user.stats.winsCount;
  const newSecond = result.rank === 2 ? user.stats.secondPlaceCount + 1 : user.stats.secondPlaceCount;
  const newThird = result.rank === 3 ? user.stats.thirdPlaceCount + 1 : user.stats.thirdPlaceCount;
  const newBestWpm = Math.max(user.stats.bestWpm, result.wpm);
  const newAvgWpm = Math.round(((user.stats.averageWpm * prevRaces) + result.wpm) / newRaces);
  const newAvgAcc = Math.round(((user.stats.averageAccuracy * prevRaces) + result.accuracy) / newRaces);

  user.stats.racesCount = newRaces;
  user.stats.winsCount = newWins;
  user.stats.secondPlaceCount = newSecond;
  user.stats.thirdPlaceCount = newThird;
  user.stats.bestWpm = newBestWpm;
  user.stats.averageWpm = newAvgWpm;
  user.stats.averageAccuracy = newAvgAcc;
  user.stats.totalWordsTyped += result.wordsTyped;
  user.stats.totalCharsTyped += result.charsTyped;
  user.stats.nitroCoins += coinsEarned;
  user.stats.xp += xpEarned;

  // Track achievements
  const newAchievements: string[] = [];
  user.achievements.forEach(ach => {
    if (ach.unlocked) return;

    if (ach.id === 'first_race') {
      ach.unlocked = true;
      ach.unlockedAt = new Date().toISOString();
      newAchievements.push(ach.title);
    }
    if (ach.id === 'first_win' && isWin) {
      ach.unlocked = true;
      ach.unlockedAt = new Date().toISOString();
      newAchievements.push(ach.title);
    }
    if (ach.id === 'speed_80_wpm' && result.wpm >= 80) {
      ach.unlocked = true;
      ach.unlockedAt = new Date().toISOString();
      newAchievements.push(ach.title);
    }
    if (ach.id === 'speed_100_wpm' && result.wpm >= 100) {
      ach.unlocked = true;
      ach.unlockedAt = new Date().toISOString();
      newAchievements.push(ach.title);
    }
    if (ach.id === 'flawless_accuracy' && result.accuracy === 100) {
      ach.unlocked = true;
      ach.unlockedAt = new Date().toISOString();
      newAchievements.push(ach.title);
    }
    if (ach.id === 'podium_master') {
      ach.progress = (ach.progress || 0) + (isPodium ? 1 : 0);
      if (ach.progress >= (ach.maxProgress || 10)) {
        ach.unlocked = true;
        ach.unlockedAt = new Date().toISOString();
        newAchievements.push(ach.title);
      }
    }
    if (ach.id === 'apex_champion') {
      ach.progress = newWins;
      if (ach.progress >= (ach.maxProgress || 20)) {
        ach.unlocked = true;
        ach.unlockedAt = new Date().toISOString();
        newAchievements.push(ach.title);
      }
    }
    if (ach.id === 'nitro_streak' && result.streakMax >= 25) {
      ach.unlocked = true;
      ach.unlockedAt = new Date().toISOString();
      newAchievements.push(ach.title);
    }
    if (ach.id === 'word_millionaire') {
      ach.progress = user.stats.totalWordsTyped;
      if (ach.progress >= (ach.maxProgress || 1000)) {
        ach.unlocked = true;
        ach.unlockedAt = new Date().toISOString();
        newAchievements.push(ach.title);
      }
    }
  });

  // Track daily quests
  user.dailyQuests.forEach(quest => {
    if (quest.completed) return;
    if (quest.id.includes('quest_acc_') && result.accuracy >= 96) {
      quest.progress = Math.min(quest.target, quest.progress + 1);
    }
    if (quest.id.includes('quest_speed_') && result.wpm >= 70) {
      quest.progress = Math.min(quest.target, quest.progress + 1);
    }
    if (quest.id.includes('quest_podium_') && result.rank <= 2) {
      quest.progress = Math.min(quest.target, quest.progress + 1);
    }
    if (quest.id.includes('quest_words_')) {
      quest.progress = Math.min(quest.target, quest.progress + result.wordsTyped);
    }
    if (quest.id.includes('quest_nitro_') && result.streakMax >= 10) {
      quest.progress = Math.min(quest.target, quest.progress + 1);
    }
    if (quest.progress >= quest.target) {
      quest.completed = true;
    }
  });

  saveActiveUser(user);
  return { updatedUser: user, coinsEarned, xpEarned, newAchievements };
}

// Global Leaderboards with realistic community records
export function getLeaderboards(currentUser: UserProfile): LeaderboardRacer[] {
  const seedRacers: LeaderboardRacer[] = [
    {
      id: 'bot_senna',
      name: 'VelocityPhantom',
      avatar: '🏎️',
      title: 'Apex Legend',
      tier: 'Apex Grandmaster',
      bestWpm: 124,
      wins: 142,
      races: 168,
      winRate: 85,
      carId: 'cyber-solaris',
    },
    {
      id: 'bot_kira',
      name: 'ShiftLock_Kira',
      avatar: '⚡',
      title: 'Grand Prix Champion',
      tier: 'Apex Grandmaster',
      bestWpm: 112,
      wins: 98,
      races: 120,
      winRate: 82,
      carId: 'apex-formula-1',
    },
    {
      id: 'bot_turbo',
      name: 'NitroRaven',
      avatar: '🔥',
      title: 'Diamond Dragster',
      tier: 'Diamond',
      bestWpm: 98,
      wins: 76,
      races: 105,
      winRate: 72,
      carId: 'phantom-gt',
    },
    {
      id: 'bot_hyper',
      name: 'GhostRider_09',
      avatar: '🕶️',
      title: 'Midnight Cruiser',
      tier: 'Diamond',
      bestWpm: 89,
      wins: 54,
      races: 88,
      winRate: 61,
      carId: 'inferno-v8',
    },
    {
      id: 'bot_nova',
      name: 'NovaKeyStroke',
      avatar: '🚀',
      title: 'Platinum Striker',
      tier: 'Platinum',
      bestWpm: 78,
      wins: 38,
      races: 65,
      winRate: 58,
      carId: 'neon-drift-gt',
    },
    {
      id: 'bot_drift',
      name: 'TokyoDrifter',
      avatar: '🏁',
      title: 'Gold Circuit Pilot',
      tier: 'Gold',
      bestWpm: 65,
      wins: 22,
      races: 48,
      winRate: 46,
      carId: 'velocity-r1',
    },
    {
      id: 'bot_zen',
      name: 'ZenithOverdrive',
      avatar: '🎯',
      title: 'Silver Challenger',
      tier: 'Silver',
      bestWpm: 54,
      wins: 14,
      races: 36,
      winRate: 39,
      carId: 'velocity-r1',
    },
  ];

  // Insert current user into leaderboard list
  const currentRacer: LeaderboardRacer = {
    id: currentUser.id,
    name: currentUser.displayName,
    avatar: currentUser.avatar,
    title: currentUser.title,
    tier: currentUser.tier,
    bestWpm: currentUser.stats.bestWpm,
    wins: currentUser.stats.winsCount,
    races: currentUser.stats.racesCount,
    winRate: currentUser.stats.racesCount > 0 
      ? Math.round((currentUser.stats.winsCount / currentUser.stats.racesCount) * 100) 
      : 0,
    carId: currentUser.selectedCarId,
    isCurrentPlayer: true,
  };

  const combined = [...seedRacers, currentRacer];
  return combined;
}

// Initial chat messages
export const INITIAL_CHAT_MESSAGES: ChatMessage[] = [
  {
    id: 'msg_1',
    senderId: 'sys_1',
    senderName: 'VelocityPhantom',
    senderAvatar: '🏎️',
    senderTier: 'Apex Grandmaster',
    text: 'Track conditions are optimal tonight racers! Keep your fingers loose and let the nitro fly! 🔥',
    timestamp: Date.now() - 1000 * 60 * 18,
  },
  {
    id: 'msg_2',
    senderId: 'sys_2',
    senderName: 'ShiftLock_Kira',
    senderAvatar: '⚡',
    senderTier: 'Apex Grandmaster',
    text: 'Just upgraded my twin turbos in the garage. Looking for a high-speed lobby showdown!',
    timestamp: Date.now() - 1000 * 60 * 9,
  },
  {
    id: 'msg_3',
    senderId: 'sys_3',
    senderName: 'TokyoDrifter',
    senderAvatar: '🏁',
    senderTier: 'Gold',
    text: 'GG on that last sprint! That final chicane was intense. Rematch ready! 🏎️💨',
    timestamp: Date.now() - 1000 * 60 * 3,
  },
];
