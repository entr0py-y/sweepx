'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/components/AuthContext';
import { Mail, Lock, ArrowRight, AlertCircle } from 'lucide-react';
import styles from './login.module.css';

export default function LoginPage() {
    const router = useRouter();
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        const success = await login(email, password);

        if (success) {
            router.push('/dashboard');
        } else {
            setError('Invalid email or password');
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
                        <h1>Welcome back</h1>
                        <p>Login to continue your cleanup journey</p>
                    </div>

                    <form onSubmit={handleSubmit} className={styles.form}>
                        {error && (
                            <div className={styles.error}>
                                <AlertCircle size={16} />
                                {error}
                            </div>
                        )}

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
                            {isLoading ? 'Logging in...' : 'Login'}
                            <ArrowRight size={18} />
                        </button>
                    </form>

                    <div className={styles.footer}>
                        <p>
                            Don&apos;t have an account?{' '}
                            <Link href="/signup" className={styles.link}>Sign up</Link>
                        </p>
                    </div>
                </div>
            </div>
        </main>
    );
}
