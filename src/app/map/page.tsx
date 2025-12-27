'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { MOCK_BOUNTIES } from '@/lib/mockData';
import { BountyStatus } from '@/types';
import { ArrowLeft, Filter, X } from 'lucide-react';
import styles from './map.module.css';

// Dynamically import map to avoid SSR issues with Leaflet
const BountyMap = dynamic(() => import('@/components/BountyMap'), {
    ssr: false,
    loading: () => <div className={styles.mapLoading}>Loading map...</div>,
});

type FilterType = 'all' | BountyStatus;

export default function MapPage() {
    const [filter, setFilter] = useState<FilterType>('all');
    const [showFilters, setShowFilters] = useState(false);

    const filteredBounties = useMemo(() => {
        if (filter === 'all') return MOCK_BOUNTIES;
        return MOCK_BOUNTIES.filter(b => b.status === filter);
    }, [filter]);

    const filters: { label: string; value: FilterType }[] = [
        { label: 'All', value: 'all' },
        { label: 'Open', value: 'open' },
        { label: 'Accepted', value: 'accepted' },
        { label: 'Completed', value: 'completed' },
    ];

    return (
        <main className={styles.main}>
            {/* Header */}
            <header className={styles.header}>
                <Link href="/dashboard" className={styles.backBtn}>
                    <ArrowLeft size={20} />
                </Link>
                <h1>Bounty Map</h1>
                <button
                    className={styles.filterBtn}
                    onClick={() => setShowFilters(!showFilters)}
                >
                    {showFilters ? <X size={20} /> : <Filter size={20} />}
                </button>
            </header>

            {/* Filters */}
            {showFilters && (
                <div className={styles.filters}>
                    {filters.map(f => (
                        <button
                            key={f.value}
                            className={`${styles.filterChip} ${filter === f.value ? styles.active : ''}`}
                            onClick={() => setFilter(f.value)}
                        >
                            {f.label}
                        </button>
                    ))}
                </div>
            )}

            {/* Stats Bar */}
            <div className={styles.statsBar}>
                <span className={styles.statItem}>
                    <span className={styles.statDot} style={{ background: '#22c55e' }} />
                    {MOCK_BOUNTIES.filter(b => b.status === 'open').length} Open
                </span>
                <span className={styles.statItem}>
                    <span className={styles.statDot} style={{ background: '#3b82f6' }} />
                    {MOCK_BOUNTIES.filter(b => b.status === 'accepted').length} Accepted
                </span>
                <span className={styles.statItem}>
                    <span className={styles.statDot} style={{ background: '#a855f7' }} />
                    {MOCK_BOUNTIES.filter(b => b.status === 'completed').length} Done
                </span>
            </div>

            {/* Map */}
            <div className={styles.mapContainer}>
                <BountyMap
                    bounties={filteredBounties}
                    height="100%"
                />
            </div>

            {/* Legend */}
            <div className={styles.legend}>
                <span className={styles.legendTitle}>Dirt Level:</span>
                <div className={styles.legendItems}>
                    <span><span className={styles.legendDot} style={{ background: '#84cc16' }} />Light</span>
                    <span><span className={styles.legendDot} style={{ background: '#facc15' }} />Heavy</span>
                    <span><span className={styles.legendDot} style={{ background: '#ef4444' }} />Extreme</span>
                </div>
            </div>
        </main>
    );
}
