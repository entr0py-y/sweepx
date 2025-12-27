// User types
export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt?: string;
}

export interface User {
  user_id: string;
  email: string;
  username: string;
  avatar_url: string;
  xp: number;
  level: number;
  reputation: number;
  achievements: Achievement[];
  cleanups_completed: number;
  bounties_created: number;
  coins: number;
  created_at: string;
}

// Bounty types
export type DirtLevel = 1 | 2 | 3 | 4 | 5;
export type BountyStatus = 'open' | 'accepted' | 'completed' | 'verified';

export interface Bounty {
  bounty_id: string;
  creator_id: string;
  creator_username: string;
  cleaner_id?: string;
  cleaner_username?: string;
  image_url: string;
  proof_image_url?: string;
  latitude: number;
  longitude: number;
  location_name: string;
  dirt_level: DirtLevel;
  bounty_amount: number;
  status: BountyStatus;
  created_at: string;
  completed_at?: string;
}

// Challenge types
export interface Challenge {
  id: string;
  title: string;
  description: string;
  xp_reward: number;
  coin_reward: number;
  target: number;
  progress: number;
  type: 'daily' | 'weekly';
  expires_at: string;
}

// Leaderboard types
export interface LeaderboardEntry {
  rank: number;
  user_id: string;
  username: string;
  avatar_url: string;
  xp: number;
  level: number;
  cleanups_completed: number;
}
