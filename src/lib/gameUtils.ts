// XP thresholds for each level (exponential curve)
const XP_BASE = 100;
const XP_MULTIPLIER = 1.5;

export function getXpForLevel(level: number): number {
    if (level <= 1) return 0;
    return Math.floor(XP_BASE * Math.pow(XP_MULTIPLIER, level - 2));
}

export function getTotalXpForLevel(level: number): number {
    let total = 0;
    for (let i = 2; i <= level; i++) {
        total += getXpForLevel(i);
    }
    return total;
}

export function getLevelFromXp(xp: number): number {
    let level = 1;
    let xpNeeded = 0;
    while (xp >= xpNeeded + getXpForLevel(level + 1)) {
        xpNeeded += getXpForLevel(level + 1);
        level++;
    }
    return level;
}

export function getXpProgress(xp: number): { current: number; needed: number; percentage: number } {
    const level = getLevelFromXp(xp);
    const xpForCurrentLevel = getTotalXpForLevel(level);
    const xpForNextLevel = getXpForLevel(level + 1);
    const currentLevelXp = xp - xpForCurrentLevel;

    return {
        current: currentLevelXp,
        needed: xpForNextLevel,
        percentage: Math.min((currentLevelXp / xpForNextLevel) * 100, 100)
    };
}

// Bounty rewards based on dirt level
export function calculateBountyReward(dirtLevel: 1 | 2 | 3 | 4 | 5, bountyAmount: number): { xp: number; coins: number } {
    const xpMultiplier = [10, 25, 50, 100, 200][dirtLevel - 1];
    return {
        xp: xpMultiplier,
        coins: bountyAmount
    };
}

// Reputation calculation
export function calculateReputation(cleanups: number, successRate: number): number {
    return Math.floor(cleanups * successRate * 10);
}

// Level title
export function getLevelTitle(level: number): string {
    if (level < 5) return 'Street Sweeper';
    if (level < 10) return 'Block Guardian';
    if (level < 20) return 'Neighborhood Hero';
    if (level < 35) return 'District Champion';
    if (level < 50) return 'City Defender';
    if (level < 75) return 'Regional Legend';
    return 'Global Savior';
}

// Format numbers
export function formatNumber(num: number): string {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
}

// Dirt level labels
export function getDirtLabel(level: 1 | 2 | 3 | 4 | 5): string {
    return ['Light', 'Moderate', 'Heavy', 'Severe', 'Extreme'][level - 1];
}

// Time ago formatter
export function timeAgo(date: string): string {
    const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);

    if (seconds < 60) return 'just now';
    if (seconds < 3600) return Math.floor(seconds / 60) + 'm ago';
    if (seconds < 86400) return Math.floor(seconds / 3600) + 'h ago';
    if (seconds < 604800) return Math.floor(seconds / 86400) + 'd ago';
    return Math.floor(seconds / 604800) + 'w ago';
}
