'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/components/AuthContext';
import { ArrowLeft, Upload, MapPin, Coins, AlertTriangle } from 'lucide-react';
import styles from './create.module.css';

export default function CreateBountyPage() {
    const router = useRouter();
    const { user, isLoading } = useAuth();
    const [image, setImage] = useState<string | null>(null);
    const [locationName, setLocationName] = useState('');
    const [dirtLevel, setDirtLevel] = useState(3);
    const [bountyAmount, setBountyAmount] = useState(100);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (!isLoading && !user) {
            router.push('/login');
        }
    }, [user, isLoading, router]);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));

        // In production, this would send to API
        router.push('/dashboard');
    };

    const dirtLabels = ['Light', 'Moderate', 'Heavy', 'Severe', 'Extreme'];
    const dirtColors = ['#84cc16', '#a3e635', '#facc15', '#fb923c', '#ef4444'];

    if (isLoading || !user) {
        return (
            <div className={styles.loading}>
                <div className={styles.spinner} />
            </div>
        );
    }

    return (
        <main className={styles.main}>
            {/* Header */}
            <header className={styles.header}>
                <Link href="/dashboard" className={styles.backBtn}>
                    <ArrowLeft size={20} />
                    Back
                </Link>
                <h1>Create Bounty</h1>
                <div style={{ width: 80 }} />
            </header>

            <div className={styles.container}>
                <form onSubmit={handleSubmit} className={styles.form}>
                    {/* Image Upload */}
                    <div className={styles.section}>
                        <label className={styles.label}>Location Photo</label>
                        <div
                            className={`${styles.uploadArea} ${image ? styles.hasImage : ''}`}
                            style={image ? { backgroundImage: `url(${image})` } : {}}
                        >
                            {!image && (
                                <div className={styles.uploadPlaceholder}>
                                    <Upload size={32} />
                                    <span>Upload dirty location photo</span>
                                    <span className={styles.uploadHint}>Click or drag & drop</span>
                                </div>
                            )}
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                className={styles.fileInput}
                            />
                            {image && (
                                <button
                                    type="button"
                                    className={styles.changeImage}
                                    onClick={() => setImage(null)}
                                >
                                    Change
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Location Name */}
                    <div className={styles.section}>
                        <label htmlFor="location" className={styles.label}>
                            <MapPin size={16} />
                            Location Name
                        </label>
                        <input
                            type="text"
                            id="location"
                            value={locationName}
                            onChange={(e) => setLocationName(e.target.value)}
                            placeholder="e.g., Central Park, Main Street..."
                            required
                            className="input"
                        />
                    </div>

                    {/* Dirt Level */}
                    <div className={styles.section}>
                        <label className={styles.label}>
                            <AlertTriangle size={16} />
                            Dirt Level
                        </label>
                        <div className={styles.dirtLevels}>
                            {[1, 2, 3, 4, 5].map((level) => (
                                <button
                                    key={level}
                                    type="button"
                                    className={`${styles.dirtLevel} ${dirtLevel === level ? styles.selected : ''}`}
                                    onClick={() => setDirtLevel(level)}
                                    style={{
                                        '--dirt-color': dirtColors[level - 1],
                                        borderColor: dirtLevel === level ? dirtColors[level - 1] : undefined,
                                    } as React.CSSProperties}
                                >
                                    <span className={styles.dirtNumber}>{level}</span>
                                    <span className={styles.dirtLabel}>{dirtLabels[level - 1]}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Bounty Amount */}
                    <div className={styles.section}>
                        <label className={styles.label}>
                            <Coins size={16} />
                            Bounty Amount
                        </label>
                        <div className={styles.bountyInput}>
                            <input
                                type="range"
                                min={25}
                                max={500}
                                step={25}
                                value={bountyAmount}
                                onChange={(e) => setBountyAmount(parseInt(e.target.value))}
                                className={styles.slider}
                            />
                            <div className={styles.bountyValue}>
                                <span className={styles.coinIcon}>◈</span>
                                <span className={styles.coinAmount}>{bountyAmount}</span>
                                <span className={styles.coinLabel}>coins</span>
                            </div>
                        </div>
                        <p className={styles.balanceNote}>
                            Your balance: {user.coins} coins
                        </p>
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        className={`btn btn-accent btn-lg ${styles.submitBtn}`}
                        disabled={!image || !locationName || isSubmitting}
                    >
                        {isSubmitting ? 'Creating...' : 'Create Bounty'}
                    </button>
                </form>
            </div>
        </main>
    );
}
