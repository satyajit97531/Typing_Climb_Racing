import { DailyQuest } from '../types';

export function generateDailyQuests(dateStr: string): DailyQuest[] {
  // Deterministic seed based on day
  return [
    {
      id: `quest_acc_${dateStr}`,
      title: 'Precision Specialist',
      description: 'Complete a race with at least 96% accuracy',
      rewardCoins: 150,
      rewardXp: 120,
      progress: 0,
      target: 1,
      completed: false,
      claimed: false,
      iconName: 'Target',
    },
    {
      id: `quest_speed_${dateStr}`,
      title: 'Speed Trap Violation',
      description: 'Hit 70 WPM or higher in any race',
      rewardCoins: 180,
      rewardXp: 150,
      progress: 0,
      target: 1,
      completed: false,
      claimed: false,
      iconName: 'Zap',
    },
    {
      id: `quest_podium_${dateStr}`,
      title: 'Podium Finisher',
      description: 'Finish in the top 2 in 2 races',
      rewardCoins: 250,
      rewardXp: 200,
      progress: 0,
      target: 2,
      completed: false,
      claimed: false,
      iconName: 'Trophy',
    },
    {
      id: `quest_words_${dateStr}`,
      title: 'Mileage Stacker',
      description: 'Type a total of 250 words today',
      rewardCoins: 200,
      rewardXp: 160,
      progress: 0,
      target: 250,
      completed: false,
      claimed: false,
      iconName: 'Award',
    },
    {
      id: `quest_nitro_${dateStr}`,
      title: 'Nitrous Overboost',
      description: 'Trigger 10+ word streak nitro boost in 2 races',
      rewardCoins: 160,
      rewardXp: 130,
      progress: 0,
      target: 2,
      completed: false,
      claimed: false,
      iconName: 'Flame',
    },
  ];
}

export function getTodayDateString(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}
