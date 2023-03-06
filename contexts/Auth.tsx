import React, { useContext, useState, useEffect } from 'react'
import { supabase } from "../lib/store";
import {User} from "@supabase/auth-helpers-react";
import {set} from "immer/dist/utils/common";

interface AuthContextType {
    signUp: (data: any) => Promise<any>;
    signIn: (data: any) => Promise<any>;
    signOut: () => Promise<any>;
    user: any;
}

export const AuthContext = React.createContext<AuthContextType | null>(null);

interface AuthProviderProps {
    children: React.ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        // Check active sessions and sets the user
        supabase.auth.getUser().then((user) => {
            setUser(user.data.user ?? null)
        });
        setLoading(false);

        // Listen for changes on auth state (logged in, signed out, etc.)
        const { data: listener } = supabase.auth.onAuthStateChange(async (event, session) => {
            console.log(session?.user)
            setUser(session?.user ?? null);
            setLoading(false);
        });

        return () => {
            listener?.subscription.unsubscribe();
        };
    }, []);

    const value: AuthContextType = {
        signUp: (data: any) => supabase.auth.signUp(data),
        signIn: (data: any) => supabase.auth.signInWithPassword(data),
        signOut: () => supabase.auth.signOut().then(() => setUser(null)),
        user,
    };

    return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
}

export const useAuth = () =>  {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
