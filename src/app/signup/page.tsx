'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/components/AuthContext';
import { Mail, Lock, User, ArrowRight, AlertCircle } from 'lucide-react';
import styles from '../login/login.module.css';

export default function SignupPage() {
    const router = useRouter();
    const { signup } = useAuth();
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        if (password.length < 6) {
            setError('Password must be at least 6 characters');
            setIsLoading(false);
            return;
        }

        const success = await signup(email, username, password);

        if (success) {
            router.push('/dashboard');
        } else {
            setError('Failed to create account. Please try again.');
            setIsLoading(false);
        }
    };

    return (
        <main className={styles.main}>
            <div className={styles.container}>
                <Link href="/" className={styles.logo}>
                    <span className={styles.logoIcon}>◈</span>
                    SWEEPX
                </Link>

                <div className={styles.card}>
                    <div className={styles.header}>
                        <h1>Join the Movement</h1>
                        <p>Create your account and start cleaning</p>
                    </div>

                    <form onSubmit={handleSubmit} className={styles.form}>
                        {error && (
                            <div className={styles.error}>
                                <AlertCircle size={16} />
                                {error}
                            </div>
                        )}

                        <div className={styles.field}>
                            <label htmlFor="username">Username</label>
                            <div className={styles.inputWrapper}>
                                <User size={18} className={styles.inputIcon} />
                                <input
                                    type="text"
                                    id="username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    placeholder="CleanMachine"
                                    required
                                    minLength={3}
                                    className="input"
                                />
                            </div>
                        </div>

                        <div className={styles.field}>
                            <label htmlFor="email">Email</label>
                            <div className={styles.inputWrapper}>
                                <Mail size={18} className={styles.inputIcon} />
                                <input
                                    type="email"
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="you@example.com"
                                    required
                                    className="input"
                                />
                            </div>
                        </div>

                        <div className={styles.field}>
                            <label htmlFor="password">Password</label>
                            <div className={styles.inputWrapper}>
                                <Lock size={18} className={styles.inputIcon} />
                                <input
                                    type="password"
                                    id="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    required
                                    minLength={6}
                                    className="input"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className={`btn btn-accent btn-lg ${styles.submitBtn}`}
                            disabled={isLoading}
                        >
                            {isLoading ? 'Creating account...' : 'Create Account'}
                            <ArrowRight size={18} />
                        </button>
                    </form>

                    <div className={styles.footer}>
                        <p>
                            Already have an account?{' '}
                            <Link href="/login" className={styles.link}>Login</Link>
                        </p>
                    </div>
                </div>
            </div>
        </main>
    );
}
