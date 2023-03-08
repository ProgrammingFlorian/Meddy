import {Box, Button, Group, PasswordInput, TextInput} from '@mantine/core';
import {useForm} from '@mantine/form';
import {NextPage} from "next";
import {customLabel} from "../helpers/Functions";
import {IconAt} from "@tabler/icons-react";
import React, {useRef} from "react";
import {AuthProvider, useAuth} from "../contexts/Auth";
import {Simulate} from "react-dom/test-utils";
import error = Simulate.error;
import Link from "next/link";

const registrationPage: NextPage = () => {
    const form = useForm({
        initialValues: { name: '', email: '', password: '',
            confirmPassword: ''},

        // functions will be used to validate values at corresponding key
        validate: {
            name: (value) => (value.length < 2 ? 'Name must have at least 2 letters' : null),
            email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
            confirmPassword: (value, values) =>
                value !== values.password ? 'Passwords did not match' : null,

        },
    });

    // const { signUp } = useAuth();
    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        // e.preventDefault()
        //
        // const email = form.values.email;
        // const password = form.values.password;
        //
        //
        // // Calls `signUp` function from the context
        // const { error } = await signUp({ email , password })
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
            <div className="min-h-screen flex flex-col items-center justify-center py-2" >
                <div className="relative inline-block text-left " style={{minWidth: 500}}>
                    <div className=" p-10 justify-center">
                        <label htmlFor="select"
                               className=" text-center font-semibold text text-3xl text-blue-500 block py-2">
                            SignUp
                        </label>
                        <br/>
                        <Box sx={{ maxWidth: 340 }} mx="auto">
                            <form onSubmit={form.onSubmit((values) => {
                                handleSubmit
                                console.log(values)
                            })}>
                                <TextInput
                                    label={customLabel("Praxis Name", true)}
                                    placeholder="Name"
                                    {...form.getInputProps('name')} />
                                <br/>
                                <TextInput
                                    label={customLabel("E-Mail:", true)}
                                    placeholder="email" icon={<IconAt />}
                                    {...form.getInputProps('email')}
                                />
                                <br/>
                                <PasswordInput
                                    label={customLabel("Passwort", true)}
                                    placeholder="Passwort"
                                    {...form.getInputProps('password')}
                                />
                                <br/>
                                <PasswordInput
                                    mt="sm"
                                    label={customLabel("Passwort wiederholen", true)}
                                    placeholder="Passwort wiederholen"
                                    {...form.getInputProps('confirmPassword')}
                                />
                                <br/>
                                <Group position="center" mt="md">
                                    <div className="flex flex-col items-center justify-content-center">
                                        <Button type="submit" mt="sm"
                                                onClick={() => {

                                                }}>
                                            Registrieren
                                        </Button>
                                        <br/>
                                        <div>
                                            Schon registriert?&nbsp;
                                            <Link href="/loginPage" className="text-blue-600 underline">Login</Link>
                                        </div>
                                    </div>
                                </Group>
                            </form>
                        </Box>
                        <br/>
                        <br/>

                    </div>
                </div>
            </div>
        </AuthProvider>


    );

}

export default registrationPage;


