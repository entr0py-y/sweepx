'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/components/AuthContext';
import { MOCK_LEADERBOARD } from '@/lib/mockData';
import { formatNumber } from '@/lib/gameUtils';
import { ArrowLeft, Trophy, Crown, Medal, Award } from 'lucide-react';
import styles from './leaderboard.module.css';

type TabType = 'global' | 'weekly';

export default function LeaderboardPage() {
    const [activeTab, setActiveTab] = useState<TabType>('global');
    const { user } = useAuth();

    const getRankIcon = (rank: number) => {
        if (rank === 1) return <Crown size={20} className={styles.gold} />;
        if (rank === 2) return <Medal size={20} className={styles.silver} />;
        if (rank === 3) return <Award size={20} className={styles.bronze} />;
        return <span className={styles.rankNumber}>{rank}</span>;
    };

    return (
        <main className={styles.main}>
            {/* Header */}
            <header className={styles.header}>
                <Link href="/dashboard" className={styles.backBtn}>
                    <ArrowLeft size={20} />
                    Back
                </Link>
                <h1>
                    <Trophy size={20} />
                    Leaderboard
                </h1>
                <div style={{ width: 80 }} />
            </header>

            <div className={styles.container}>
                {/* Tabs */}
                <div className={styles.tabs}>
                    <button
                        className={`${styles.tab} ${activeTab === 'global' ? styles.active : ''}`}
                        onClick={() => setActiveTab('global')}
                    >
                        Global
                    </button>
                    <button
                        className={`${styles.tab} ${activeTab === 'weekly' ? styles.active : ''}`}
                        onClick={() => setActiveTab('weekly')}
                    >
                        This Week
                    </button>
                </div>

                {/* Top 3 Podium */}
                <div className={styles.podium}>
                    {MOCK_LEADERBOARD.slice(0, 3).map((entry, index) => (
                        <div
                            key={entry.user_id}
                            className={`${styles.podiumItem} ${styles[`rank${index + 1}`]}`}
                        >
                            <div className={styles.podiumAvatar}>
                                {entry.username.charAt(0).toUpperCase()}
                            </div>
                            <span className={styles.podiumRank}>{getRankIcon(entry.rank)}</span>
                            <h3 className={styles.podiumName}>{entry.username}</h3>
                            <span className={styles.podiumXp}>{formatNumber(entry.xp)} XP</span>
                            <span className={styles.podiumCleanups}>{entry.cleanups_completed} cleanups</span>
                        </div>
                    ))}
                </div>

                {/* Rankings List */}
                <div className={styles.rankingsList}>
                    {MOCK_LEADERBOARD.slice(3).map((entry) => {
                        const isCurrentUser = user?.user_id === entry.user_id;
                        return (
                            <div
                                key={entry.user_id}
                                className={`${styles.rankingItem} ${isCurrentUser ? styles.currentUser : ''}`}
                            >
                                <div className={styles.rankBadge}>
                                    {entry.rank}
                                </div>
                                <div className={styles.rankingAvatar}>
                                    {entry.username.charAt(0).toUpperCase()}
                                </div>
                                <div className={styles.rankingInfo}>
                                    <span className={styles.rankingName}>
                                        {entry.username}
                                        {isCurrentUser && <span className={styles.youBadge}>You</span>}
                                    </span>
                                    <span className={styles.rankingStats}>
                                        Level {entry.level} · {entry.cleanups_completed} cleanups
                                    </span>
                                </div>
                                <div className={styles.rankingXp}>
                                    {formatNumber(entry.xp)} XP
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </main>
    );
}
