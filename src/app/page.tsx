'use client';

import Link from 'next/link';
import { useAuth } from '@/components/AuthContext';
import { MapPin, Trophy, Zap, Users, ArrowRight, Sparkles } from 'lucide-react';
import styles from './page.module.css';

export default function HomePage() {
  const { user } = useAuth();

  return (
    <main className={styles.main}>
      {/* Navigation */}
      <nav className={styles.nav}>
        <Link href="/" className={styles.logo}>
          <span className={styles.logoIcon}>◈</span>
          SWEEPX
        </Link>
        <div className={styles.navLinks}>
          {user ? (
            <Link href="/dashboard" className="btn btn-primary">
              Dashboard
              <ArrowRight size={16} />
            </Link>
          ) : (
            <>
              <Link href="/login" className={styles.navLink}>
                Login
              </Link>
              <Link href="/signup" className="btn btn-primary">
                Get Started
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <div className={styles.heroBadge}>
            <Sparkles size={14} />
            <span>A New Kind of Game</span>
          </div>
          <h1 className={styles.heroTitle}>
            Clean the World.
            <br />
            <span className={styles.heroAccent}>Earn Rewards.</span>
          </h1>
          <p className={styles.heroDescription}>
            SweepX turns real-world cleanup into an addictive game.
            Spot dirty locations, set bounties, and watch your community transform.
          </p>
          <div className={styles.heroCta}>
            <Link href={user ? "/dashboard" : "/signup"} className="btn btn-accent btn-lg">
              Start Playing
              <ArrowRight size={20} />
            </Link>
            <Link href="/map" className="btn btn-secondary btn-lg">
              <MapPin size={20} />
              Explore Map
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <span className={styles.statNumber}>2,847</span>
            <span className={styles.statLabel}>Active Bounties</span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statNumber}>15.2K</span>
            <span className={styles.statLabel}>Cleanups Done</span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statNumber}>8,531</span>
            <span className={styles.statLabel}>Players</span>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className={styles.features}>
        <h2 className={styles.sectionTitle}>How It Works</h2>
        <div className={styles.featureGrid}>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>
              <MapPin size={24} />
            </div>
            <h3>Spot & Report</h3>
            <p>Find a dirty location? Upload a photo and set a bounty based on severity.</p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>
              <Zap size={24} />
            </div>
            <h3>Accept & Clean</h3>
            <p>Browse the map, accept bounties near you, and clean up to earn rewards.</p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>
              <Trophy size={24} />
            </div>
            <h3>Level Up</h3>
            <p>Earn XP, unlock achievements, climb the leaderboards, and become a legend.</p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>
              <Users size={24} />
            </div>
            <h3>Build Community</h3>
            <p>Join weekly challenges, compete with friends, and transform your neighborhood.</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.ctaSection}>
        <div className={styles.ctaContent}>
          <h2>Ready to Make a Difference?</h2>
          <p>Join thousands of players cleaning up communities worldwide.</p>
          <Link href={user ? "/dashboard" : "/signup"} className="btn btn-primary btn-lg">
            Join the Movement
            <ArrowRight size={20} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <div className={styles.footerBrand}>
            <span className={styles.logoIcon}>◈</span>
            SWEEPX
          </div>
          <p className={styles.footerTagline}>
            A game that accidentally cleans the world.
          </p>
          <div className={styles.footerLinks}>
            <Link href="/map">Map</Link>
            <Link href="/leaderboard">Leaderboard</Link>
            <Link href="/about">About</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
