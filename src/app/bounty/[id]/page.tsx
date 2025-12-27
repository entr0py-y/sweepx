'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/components/AuthContext';
import { MOCK_BOUNTIES } from '@/lib/mockData';
import { getDirtLabel, timeAgo, calculateBountyReward } from '@/lib/gameUtils';
import { Bounty } from '@/types';
import {
    ArrowLeft, MapPin, Clock, Coins, AlertTriangle,
    Check, Upload, User, Zap
} from 'lucide-react';
import styles from './bounty.module.css';

export default function BountyDetailPage() {
    const router = useRouter();
    const params = useParams();
    const { user, isLoading } = useAuth();
    const [bounty, setBounty] = useState<Bounty | null>(null);
    const [proofImage, setProofImage] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const foundBounty = MOCK_BOUNTIES.find(b => b.bounty_id === params.id);
        if (foundBounty) {
            setBounty(foundBounty);
        }
    }, [params.id]);

    const handleAcceptBounty = async () => {
        if (!user || !bounty) return;
        setIsSubmitting(true);
        await new Promise(resolve => setTimeout(resolve, 500));
        setBounty({ ...bounty, status: 'accepted', cleaner_id: user.user_id, cleaner_username: user.username });
        setIsSubmitting(false);
    };

    const handleProofUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setProofImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmitProof = async () => {
        if (!proofImage || !bounty) return;
        setIsSubmitting(true);
        await new Promise(resolve => setTimeout(resolve, 500));
        setBounty({ ...bounty, status: 'completed', proof_image_url: proofImage, completed_at: new Date().toISOString() });
        setIsSubmitting(false);
    };

    if (isLoading) {
        return (
            <div className={styles.loading}>
                <div className={styles.spinner} />
            </div>
        );
    }

    if (!bounty) {
        return (
            <div className={styles.notFound}>
                <h1>Bounty not found</h1>
                <Link href="/map" className="btn btn-secondary">
                    Back to Map
                </Link>
            </div>
        );
    }

    const isCreator = user?.user_id === bounty.creator_id;
    const isCleaner = user?.user_id === bounty.cleaner_id;
    const rewards = calculateBountyReward(bounty.dirt_level, bounty.bounty_amount);
    const dirtColors = ['#84cc16', '#a3e635', '#facc15', '#fb923c', '#ef4444'];

    return (
        <main className={styles.main}>
            {/* Header */}
            <header className={styles.header}>
                <Link href="/map" className={styles.backBtn}>
                    <ArrowLeft size={20} />
                    Back
                </Link>
                <h1>Bounty Details</h1>
                <div style={{ width: 80 }} />
            </header>

            <div className={styles.container}>
                {/* Image */}
                <div className={styles.imageSection}>
                    <div
                        className={styles.mainImage}
                        style={{ backgroundImage: `url(${bounty.image_url})` }}
                    >
                        <div className={styles.statusBadge} data-status={bounty.status}>
                            {bounty.status.toUpperCase()}
                        </div>
                    </div>
                    {bounty.proof_image_url && (
                        <div className={styles.proofSection}>
                            <span className={styles.proofLabel}>Cleanup Proof</span>
                            <div
                                className={styles.proofImage}
                                style={{ backgroundImage: `url(${bounty.proof_image_url})` }}
                            />
                        </div>
                    )}
                </div>

                {/* Info */}
                <div className={styles.infoSection}>
                    <h2>{bounty.location_name}</h2>

                    <div className={styles.metaGrid}>
                        <div className={styles.metaItem}>
                            <Coins size={18} />
                            <div>
                                <span className={styles.metaValue}>{bounty.bounty_amount}</span>
                                <span className={styles.metaLabel}>Coins</span>
                            </div>
                        </div>
                        <div className={styles.metaItem}>
                            <AlertTriangle size={18} style={{ color: dirtColors[bounty.dirt_level - 1] }} />
                            <div>
                                <span className={styles.metaValue}>{getDirtLabel(bounty.dirt_level)}</span>
                                <span className={styles.metaLabel}>Dirt Level</span>
                            </div>
                        </div>
                        <div className={styles.metaItem}>
                            <Clock size={18} />
                            <div>
                                <span className={styles.metaValue}>{timeAgo(bounty.created_at)}</span>
                                <span className={styles.metaLabel}>Posted</span>
                            </div>
                        </div>
                        <div className={styles.metaItem}>
                            <User size={18} />
                            <div>
                                <span className={styles.metaValue}>{bounty.creator_username}</span>
                                <span className={styles.metaLabel}>Creator</span>
                            </div>
                        </div>
                    </div>

                    {/* Rewards */}
                    <div className={styles.rewardsCard}>
                        <h3>Rewards</h3>
                        <div className={styles.rewardsList}>
                            <div className={styles.rewardItem}>
                                <Zap size={18} className={styles.xpIcon} />
                                <span>+{rewards.xp} XP</span>
                            </div>
                            <div className={styles.rewardItem}>
                                <Coins size={18} className={styles.coinIcon} />
                                <span>+{rewards.coins} Coins</span>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    {bounty.status === 'open' && !isCreator && user && (
                        <button
                            className={`btn btn-accent btn-lg ${styles.actionBtn}`}
                            onClick={handleAcceptBounty}
                            disabled={isSubmitting}
                        >
                            <Check size={20} />
                            {isSubmitting ? 'Accepting...' : 'Accept Bounty'}
                        </button>
                    )}

                    {bounty.status === 'accepted' && isCleaner && (
                        <div className={styles.proofUpload}>
                            <h3>Upload Cleanup Proof</h3>
                            <div
                                className={`${styles.uploadArea} ${proofImage ? styles.hasImage : ''}`}
                                style={proofImage ? { backgroundImage: `url(${proofImage})` } : {}}
                            >
                                {!proofImage && (
                                    <div className={styles.uploadPlaceholder}>
                                        <Upload size={24} />
                                        <span>Upload photo of cleaned area</span>
                                    </div>
                                )}
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleProofUpload}
                                    className={styles.fileInput}
                                />
                            </div>
                            {proofImage && (
                                <button
                                    className={`btn btn-accent btn-lg ${styles.actionBtn}`}
                                    onClick={handleSubmitProof}
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? 'Submitting...' : 'Submit Proof'}
                                </button>
                            )}
                        </div>
                    )}

                    {bounty.status === 'completed' && (
                        <div className={styles.completedMessage}>
                            <Check size={24} />
                            <span>Cleanup completed by {bounty.cleaner_username}</span>
                        </div>
                    )}

                    {!user && bounty.status === 'open' && (
                        <Link href="/login" className={`btn btn-accent btn-lg ${styles.actionBtn}`}>
                            Login to Accept
                        </Link>
                    )}
                </div>
            </div>
        </main>
    );
}
