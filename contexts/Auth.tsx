import React, { useContext, useState, useEffect } from 'react'
import { supabase } from "../lib/store";

interface AuthContextType {
    signUp: (data: any) => Promise<any>;
    signIn: (data: any) => Promise<any>;
    signOut: () => Promise<any>;
    user: any;
}

const AuthContext = React.createContext<AuthContextType | null>(null);

interface AuthProviderProps {
    children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        // Check active sessions and sets the user
        const user =  supabase.auth.getUser();
        setUser(user ?? null);


        setLoading(false);

        // Listen for changes on auth state (logged in, signed out, etc.)
        const { data: listener } = supabase.auth.onAuthStateChange(async (event, session) => {
            setUser(session?.user ?? null);
            setLoading(false);
        });

        return () => {
            listener?.subscription.unsubscribe();
        };
    }, []);

    // Will be passed down to Signup, Login and Dashboard components
    const value: AuthContextType = {
        signUp: (data: any) => supabase.auth.signUp(data),
        signIn: (data: any) => supabase.auth.signInWithPassword(data),
        signOut: () => supabase.auth.signOut(),
        user,
    };

    return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
}

export function useAuth() {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
