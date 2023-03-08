import {Box, Button, PasswordInput, TextInput} from '@mantine/core';
import {NextPage} from "next";
import {customLabel} from "../helpers/Functions";
import Link from "next/link";
import {useForm} from "@mantine/form";
import {IconAt} from "@tabler/icons-react";
import {AuthContext, AuthProvider, useAuth} from "../contexts/Auth"
import React, {useContext} from "react";
import { StoreContext } from '../lib/store';
import { Auth } from '@supabase/auth-ui-react';


const loginPage: NextPage = () => {


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

    // const { signIn } = useAuth();
    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        // e.preventDefault()
        //
        // const email = form.values.email;
        // const password = form.values.password;
        //
        // // Calls `signUp` function from the context
        // const { error } = await signIn({ email , password })
        //
        // if (error) {
        //     alert('error signing in')
        // } else {
        //
        //     // Redirect user to Dashboard
        //     window.location.href = '/';
        //
        // }
    }

    return (
        <AuthProvider>
            <div className="min-h-screen flex flex-col items-center justify-center py-2">
                <div className="relative inline-block text-left " style={{minWidth: 500}}>
                    <div className=" p-10 justify-center">
                        <label htmlFor="select"
                               className=" text-center font-semibold text text-3xl text-blue-500 block py-2">
                            Login
                        </label>
                        <br/>
                        <Box sx={{maxWidth: 340}} mx="auto">
                            <form onSubmit={form.onSubmit((values) => {
                                handleSubmit
                                console.log(values)
                            })}>
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
                                            mt="sm"
                                            onClick={() => {
                                                window.location.href = "overview";
                                            }}>
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
        </AuthProvider>

    );

};

export default loginPage;



