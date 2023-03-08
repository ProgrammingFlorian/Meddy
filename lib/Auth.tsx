import React, {createContext, ReactNode, useContext, useEffect, useState} from 'react'
import {supabase} from "./Store";
import {Container, LoadingOverlay} from "@mantine/core";
import {User} from "@supabase/auth-helpers-react";
import Login from "../components/Auth/Login";
import {AuthResponse} from "@supabase/gotrue-js";

interface AuthContextType {
    signUp: (data: any) => Promise<AuthResponse>;
    signIn: (data: any) => Promise<AuthResponse>;
    signOut: () => void;
    user: User | null;
}

export const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider = ({children}: AuthProviderProps) => {
    const [user, setUser] = useState<null | User>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        // Check active sessions and sets the user
        supabase.auth.getUser().then((user) => {
            setUser(user.data.user ?? null);
            setLoading(false);
        });

        // Listen for changes on auth state (logged in, signed out, etc.)
        const {data: listener} = supabase.auth.onAuthStateChange(async (event, session) => {
            setUser(session?.user ?? null);
        });

        return () => {
            listener?.subscription.unsubscribe();
        };
    }, []);

    const value: AuthContextType = {
        signUp: (data: any) => supabase.auth.signUp(data),
        signIn: (data: any) => supabase.auth.signInWithPassword(data),
        signOut: () => supabase.auth.signOut().then(() => setUser(null)),
        user
    };

    return (
        <AuthContext.Provider value={value}>
            {loading ?
                <Container className="h-screen">
                    <LoadingOverlay visible={true}/>
                </Container> :

                user === null ?
                    <Login/> :

                    children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
