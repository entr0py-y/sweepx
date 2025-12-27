'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@/types';
import { MOCK_USER } from '@/lib/mockData';

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<boolean>;
    signup: (email: string, username: string, password: string) => Promise<boolean>;
    logout: () => void;
    updateUser: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = 'sweepx_user';

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Load user from localStorage
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            try {
                setUser(JSON.parse(stored));
            } catch {
                localStorage.removeItem(STORAGE_KEY);
            }
        }
        setIsLoading(false);
    }, []);

    const login = async (email: string, password: string): Promise<boolean> => {
        // Mock login - in production, this would call an API
        await new Promise(resolve => setTimeout(resolve, 500));

        if (email && password.length >= 6) {
            const loggedInUser = { ...MOCK_USER, email };
            setUser(loggedInUser);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(loggedInUser));
            return true;
        }
        return false;
    };

    const signup = async (email: string, username: string, password: string): Promise<boolean> => {
        // Mock signup
        await new Promise(resolve => setTimeout(resolve, 500));

        if (email && username && password.length >= 6) {
            const newUser: User = {
                user_id: 'user_' + Date.now(),
                email,
                username,
                avatar_url: '',
                xp: 0,
                level: 1,
                reputation: 0,
                achievements: [],
                cleanups_completed: 0,
                bounties_created: 0,
                coins: 50, // Starting coins
                created_at: new Date().toISOString(),
            };
            setUser(newUser);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser));
            return true;
        }
        return false;
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem(STORAGE_KEY);
    };

    const updateUser = (updates: Partial<User>) => {
        if (user) {
            const updated = { ...user, ...updates };
            setUser(updated);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        }
    };

    return (
        <AuthContext.Provider value={{ user, isLoading, login, signup, logout, updateUser }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
