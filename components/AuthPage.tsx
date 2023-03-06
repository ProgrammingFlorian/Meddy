import {User} from "@supabase/auth-helpers-react";
import {Auth} from '@supabase/auth-ui-react';
import React, {ReactNode} from "react";
import {ThemeSupa} from "@supabase/auth-ui-shared";
import {SupabaseClient} from "@supabase/supabase-js";
import {AuthProvider, useAuth} from "../contexts/Auth";
import {useForm} from "@mantine/form";
import {Box, Button, PasswordInput, TextInput} from "@mantine/core";
import {customLabel} from "../helpers/Functions";
import {IconAt} from "@tabler/icons-react";
import Link from "next/link";
import loginPage from "../pages/loginPage";
import registrationPage from "../pages/registrationPage";
import Dashboard from "./overview/Dashboard";

interface AuthPageProps {
    supabaseClient: SupabaseClient<any, "public", any>;
    user: User | null;
    children: ReactNode;
}

export const AuthPage = (props: AuthPageProps): JSX.Element => {
    const form = useForm({
        initialValues: { name: '', email: '', password: '',
            confirmPassword: ''},

        // functions will be used to validate values at corresponding key
        validate: {
            email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
            password: (value) =>
                value.length < 4 ? 'Password must have at least 4 letters' : null,

        },
    });

    const { signIn, user } = useAuth();
    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()

        const email = form.values.email;
        const password = form.values.password;

        // Calls `signUp` function from the context
        const user = await signIn({ email , password }).then((user) => {
            if (user.error !== null) {
                alert('error signing in')
            }
        })

    }

    if (user == null) {
        return (
                <div className="min-h-screen flex flex-col items-center justify-center py-2">
                    <div className="relative inline-block text-left " style={{minWidth: 500}}>
                        <div className=" p-10 justify-center">
                            <label htmlFor="select"
                                   className=" text-center font-semibold text text-3xl text-blue-500 block py-2">
                                Login
                            </label>
                            <br/>
                            <Box sx={{maxWidth: 340}} mx="auto">
                                <form onSubmit={//form.onSubmit((values) => {
                                    //console.log(values)
                                    handleSubmit
                                //})
                                }>
                                    <TextInput
                                        label={customLabel("E-Mail:", true)}
                                        placeholder="Your email" icon={<IconAt/>}
                                        {...form.getInputProps('email')}/>
                                    <br/>
                                    <PasswordInput
                                        label={customLabel("Password", true)}
                                        placeholder="Password"
                                        {...form.getInputProps('password')}
                                    />
                                    <br/>
                                    <div className="flex flex-col items-center justify-content-center">
                                        <Button type="submit"
                                                mt="sm">
                                            Login
                                        </Button>
                                        <br/>
                                        <div>
                                            Noch nicht registriert?&nbsp;
                                            <Link href="/registrationPage"
                                                  className="text-blue-600 underline">Registrieren</Link>
                                        </div>
                                    </div>
                                </form>
                            </Box>
                        </div>
                    </div>
                </div>

        );

        return (
            <AuthProvider>
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
            </AuthProvider>

        );
    } else {
        return (
            <>
                {props.children}
            </>
        );
    }
};