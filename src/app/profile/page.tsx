'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/components/AuthContext';
import { getXpProgress, getLevelTitle, formatNumber, timeAgo } from '@/lib/gameUtils';
import { ACHIEVEMENTS } from '@/lib/mockData';
import {
    Star, Trophy, Zap, Target, Calendar, ArrowLeft,
    Award, Coins, CheckCircle, Lock
} from 'lucide-react';
import styles from './profile.module.css';

export default function ProfilePage() {
    const router = useRouter();
    const { user, isLoading } = useAuth();

    useEffect(() => {
        if (!isLoading && !user) {
            router.push('/login');
        }
    }, [user, isLoading, router]);

    if (isLoading || !user) {
        return (
            <div className={styles.loading}>
                <div className={styles.spinner} />
            </div>
        );
    }

    const xpProgress = getXpProgress(user.xp);
    const levelTitle = getLevelTitle(user.level);
    const unlockedAchievementIds = user.achievements.map(a => a.id);

    return (
        <main className={styles.main}>
            {/* Header */}
            <header className={styles.header}>
                <Link href="/dashboard" className={styles.backBtn}>
                    <ArrowLeft size={20} />
                    Back
                </Link>
                <h1>Profile</h1>
                <div style={{ width: 80 }} />
            </header>

            <div className={styles.container}>
                {/* Profile Card */}
                <section className={styles.profileCard}>
                    <div className={styles.avatar}>
                        {user.username.charAt(0).toUpperCase()}
                    </div>

                    <div className={styles.profileInfo}>
                        <h2>{user.username}</h2>
                        <p className={styles.levelTitle}>{levelTitle}</p>
                        <p className={styles.email}>{user.email}</p>
                    </div>

                    <div className={styles.levelSection}>
                        <div className={styles.levelHeader}>
                            <div className={styles.levelBadge}>
                                <Star size={18} />
                                Level {user.level}
                            </div>
                            <span className={styles.xpText}>
                                {formatNumber(xpProgress.current)} / {formatNumber(xpProgress.needed)} XP
                            </span>
                        </div>
                        <div className="progress">
                            <div
                                className="progress-fill"
                                style={{ width: `${xpProgress.percentage}%` }}
                            />
                        </div>
                    </div>
                </section>

                {/* Stats Grid */}
                <section className={styles.statsSection}>
                    <h3>Statistics</h3>
                    <div className={styles.statsGrid}>
                        <div className={styles.statCard}>
                            <Zap size={24} className={styles.statIcon} />
                            <span className={styles.statValue}>{user.cleanups_completed}</span>
                            <span className={styles.statLabel}>Cleanups</span>
                        </div>
                        <div className={styles.statCard}>
                            <Target size={24} className={styles.statIcon} />
                            <span className={styles.statValue}>{user.bounties_created}</span>
                            <span className={styles.statLabel}>Bounties Created</span>
                        </div>
                        <div className={styles.statCard}>
                            <Coins size={24} className={styles.statIcon} />
                            <span className={styles.statValue}>{formatNumber(user.coins)}</span>
                            <span className={styles.statLabel}>Coins Earned</span>
                        </div>
                        <div className={styles.statCard}>
                            <Trophy size={24} className={styles.statIcon} />
                            <span className={styles.statValue}>{formatNumber(user.xp)}</span>
                            <span className={styles.statLabel}>Total XP</span>
                        </div>
                        <div className={styles.statCard}>
                            <Award size={24} className={styles.statIcon} />
                            <span className={styles.statValue}>{user.reputation}%</span>
                            <span className={styles.statLabel}>Reputation</span>
                        </div>
                        <div className={styles.statCard}>
                            <Calendar size={24} className={styles.statIcon} />
                            <span className={styles.statValue}>{timeAgo(user.created_at)}</span>
                            <span className={styles.statLabel}>Member Since</span>
                        </div>
                    </div>
                </section>

                {/* Achievements */}
                <section className={styles.achievementsSection}>
                    <h3>
                        Achievements
                        <span className={styles.achievementCount}>
                            {user.achievements.length}/{ACHIEVEMENTS.length}
                        </span>
                    </h3>
                    <div className={styles.achievementsGrid}>
                        {ACHIEVEMENTS.map(achievement => {
                            const isUnlocked = unlockedAchievementIds.includes(achievement.id);
                            return (
                                <div
                                    key={achievement.id}
                                    className={`${styles.achievementCard} ${isUnlocked ? styles.unlocked : ''}`}
                                >
                                    <div className={styles.achievementIcon}>
                                        {isUnlocked ? (
                                            <span>{achievement.icon}</span>
                                        ) : (
                                            <Lock size={20} />
                                        )}
                                    </div>
                                    <div className={styles.achievementInfo}>
                                        <h4>{achievement.name}</h4>
                                        <p>{achievement.description}</p>
                                    </div>
                                    {isUnlocked && (
                                        <CheckCircle size={16} className={styles.checkIcon} />
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </section>
            </div>
        </main>
    );
}
