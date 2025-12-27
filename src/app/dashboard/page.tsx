'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/components/AuthContext';
import { getXpProgress, getLevelTitle, formatNumber, timeAgo } from '@/lib/gameUtils';
import { MOCK_BOUNTIES, MOCK_CHALLENGES } from '@/lib/mockData';
import {
    MapPin, Trophy, Zap, Plus, ArrowRight, Star, Clock,
    Target, Award, LogOut, User, ChevronRight, Coins
} from 'lucide-react';
import styles from './dashboard.module.css';

export default function DashboardPage() {
    const router = useRouter();
    const { user, isLoading, logout } = useAuth();

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
    const activeBounties = MOCK_BOUNTIES.filter(b =>
        b.status === 'accepted' && b.cleaner_id === user.user_id
    );
    const dailyChallenges = MOCK_CHALLENGES.filter(c => c.type === 'daily');

    return (
        <main className={styles.main}>
            {/* Header */}
            <header className={styles.header}>
                <Link href="/" className={styles.logo}>
                    <span className={styles.logoIcon}>◈</span>
                    SWEEPX
                </Link>
                <nav className={styles.nav}>
                    <Link href="/map" className={styles.navLink}>
                        <MapPin size={18} />
                        Map
                    </Link>
                    <Link href="/leaderboard" className={styles.navLink}>
                        <Trophy size={18} />
                        Leaderboard
                    </Link>
                    <Link href="/profile" className={styles.navLink}>
                        <User size={18} />
                        Profile
                    </Link>
                    <button onClick={logout} className={styles.navLink}>
                        <LogOut size={18} />
                    </button>
                </nav>
            </header>

            <div className={styles.container}>
                {/* Welcome Section */}
                <section className={styles.welcome}>
                    <div className={styles.welcomeContent}>
                        <h1>Welcome back, {user.username}</h1>
                        <p className={styles.levelTitle}>{levelTitle}</p>
                    </div>
                    <Link href="/bounty/create" className="btn btn-accent">
                        <Plus size={18} />
                        Create Bounty
                    </Link>
                </section>

                {/* Stats Grid */}
                <section className={styles.statsGrid}>
                    {/* Level Card */}
                    <div className={`${styles.statCard} ${styles.levelCard}`}>
                        <div className={styles.levelHeader}>
                            <div className={styles.levelBadge}>
                                <Star size={20} />
                                <span>Level {user.level}</span>
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

                    {/* Quick Stats */}
                    <div className={styles.statCard}>
                        <div className={styles.statIcon}>
                            <Zap size={20} />
                        </div>
                        <div className={styles.statContent}>
                            <span className={styles.statValue}>{user.cleanups_completed}</span>
                            <span className={styles.statLabel}>Cleanups</span>
                        </div>
                    </div>

                    <div className={styles.statCard}>
                        <div className={styles.statIcon}>
                            <Coins size={20} />
                        </div>
                        <div className={styles.statContent}>
                            <span className={styles.statValue}>{formatNumber(user.coins)}</span>
                            <span className={styles.statLabel}>Coins</span>
                        </div>
                    </div>

                    <div className={styles.statCard}>
                        <div className={styles.statIcon}>
                            <Award size={20} />
                        </div>
                        <div className={styles.statContent}>
                            <span className={styles.statValue}>{user.reputation}%</span>
                            <span className={styles.statLabel}>Reputation</span>
                        </div>
                    </div>
                </section>

                <div className={styles.gridLayout}>
                    {/* Active Bounties */}
                    <section className={styles.section}>
                        <div className={styles.sectionHeader}>
                            <h2>
                                <Target size={20} />
                                Active Bounties
                            </h2>
                            <Link href="/map" className={styles.viewAll}>
                                View Map <ChevronRight size={16} />
                            </Link>
                        </div>
                        {activeBounties.length > 0 ? (
                            <div className={styles.bountyList}>
                                {activeBounties.map(bounty => (
                                    <Link
                                        href={`/bounty/${bounty.bounty_id}`}
                                        key={bounty.bounty_id}
                                        className={styles.bountyCard}
                                    >
                                        <div
                                            className={styles.bountyImage}
                                            style={{ backgroundImage: `url(${bounty.image_url})` }}
                                        />
                                        <div className={styles.bountyInfo}>
                                            <h3>{bounty.location_name}</h3>
                                            <div className={styles.bountyMeta}>
                                                <span className={styles.bountyReward}>
                                                    <Coins size={14} />
                                                    {bounty.bounty_amount}
                                                </span>
                                                <span className={styles.bountyTime}>
                                                    <Clock size={14} />
                                                    {timeAgo(bounty.created_at)}
                                                </span>
                                            </div>
                                        </div>
                                        <ArrowRight size={18} className={styles.bountyArrow} />
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <div className={styles.emptyState}>
                                <MapPin size={32} />
                                <p>No active bounties</p>
                                <Link href="/map" className="btn btn-secondary">
                                    Find Bounties
                                </Link>
                            </div>
                        )}
                    </section>

                    {/* Daily Challenges */}
                    <section className={styles.section}>
                        <div className={styles.sectionHeader}>
                            <h2>
                                <Zap size={20} />
                                Daily Challenges
                            </h2>
                        </div>
                        <div className={styles.challengeList}>
                            {dailyChallenges.map(challenge => (
                                <div key={challenge.id} className={styles.challengeCard}>
                                    <div className={styles.challengeContent}>
                                        <h3>{challenge.title}</h3>
                                        <p>{challenge.description}</p>
                                        <div className={styles.challengeProgress}>
                                            <div className="progress">
                                                <div
                                                    className="progress-fill"
                                                    style={{ width: `${(challenge.progress / challenge.target) * 100}%` }}
                                                />
                                            </div>
                                            <span>{challenge.progress}/{challenge.target}</span>
                                        </div>
                                    </div>
                                    <div className={styles.challengeReward}>
                                        <span className={styles.rewardXp}>+{challenge.xp_reward} XP</span>
                                        <span className={styles.rewardCoins}>
                                            <Coins size={12} />
                                            {challenge.coin_reward}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>

                {/* Quick Actions */}
                <section className={styles.quickActions}>
                    <Link href="/map" className={styles.actionCard}>
                        <div className={styles.actionIcon}>
                            <MapPin size={24} />
                        </div>
                        <div className={styles.actionContent}>
                            <h3>Explore Map</h3>
                            <p>Find bounties near you</p>
                        </div>
                        <ArrowRight size={20} />
                    </Link>
                    <Link href="/bounty/create" className={styles.actionCard}>
                        <div className={styles.actionIcon}>
                            <Plus size={24} />
                        </div>
                        <div className={styles.actionContent}>
                            <h3>Create Bounty</h3>
                            <p>Report a dirty location</p>
                        </div>
                        <ArrowRight size={20} />
                    </Link>
                    <Link href="/leaderboard" className={styles.actionCard}>
                        <div className={styles.actionIcon}>
                            <Trophy size={24} />
                        </div>
                        <div className={styles.actionContent}>
                            <h3>Leaderboard</h3>
                            <p>See top cleaners</p>
                        </div>
                        <ArrowRight size={20} />
                    </Link>
                </section>
            </div>
        </main>
    );
}
