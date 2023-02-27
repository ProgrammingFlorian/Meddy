import {User} from "@supabase/auth-helpers-react";
import {Auth} from '@supabase/auth-ui-react';
import React, {ReactNode} from "react";
import {ThemeSupa} from "@supabase/auth-ui-shared";
import {SupabaseClient} from "@supabase/supabase-js";

interface AuthPageProps {
    supabaseClient: SupabaseClient<any, "public", any>;
    user: User | null;
    children: ReactNode;
}

export const AuthPage = (props: AuthPageProps): JSX.Element => {
    if (!props.user) {
        return (
            <div style={{maxWidth: 500, margin: "auto", marginTop: 200, marginBottom: "auto"}}>
                <h1 style={{textAlign: "center", marginBottom: 50}}>Anmelden</h1>
                <Auth
                    redirectTo="http://localhost:3000/"
                    appearance={{theme: ThemeSupa}}
                    supabaseClient={props.supabaseClient}
                    providers={[]}
                    socialLayout="horizontal"
                />
            </div>
        );
    } else {
        return (
            <>
                {props.children}
            </>
        );
    }
};