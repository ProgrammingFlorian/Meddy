import { useState } from 'react';
import {TextInput, Box, Button, PasswordInput, Group} from '@mantine/core';
import { useForm } from '@mantine/form';
import {NextPage} from "next";
import {AtIcon} from "../models/SVGIcons";
import {customLabel} from "../models/Functions";
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

    return (
        <div className="min-h-screen flex flex-col items-center justify-center py-2" >
            <div className="relative inline-block text-left "style={{minWidth: 500}}>
                <div className=" p-10 bg-gray-100 justify-center">
                    <label htmlFor="select"
                           className=" text-center font-semibold text text-2xl text-blue-500 block py-2">
                        Registration
                    </label>
                    <br/>
                    <Box sx={{ maxWidth: 340 }} mx="auto">
                        <form onSubmit={form.onSubmit((values) => console.log(values))}>
                            <TextInput
                                label={customLabel("Praxis Name", true)}
                                placeholder="Name"
                                {...form.getInputProps('name')} />
                            <br/>
                            <TextInput
                                label={customLabel("E-Mail:", true)}
                                placeholder="Your email" icon={AtIcon()}
                                {...form.getInputProps('email')}/>
                            <br/>
                            <PasswordInput
                                label={customLabel("Password", true)}
                                placeholder="Password"
                                {...form.getInputProps('password')}
                            />
                            <br/>
                            <PasswordInput
                                mt="sm"
                                label={customLabel("Confirm password", true)}
                                placeholder="Confirm password"
                                {...form.getInputProps('confirmPassword')}
                            />
                            <br/>
                            <Group position="center" mt="md">
                                <div className="flex flex-col items-center justify-content-center">
                                    <Button type="submit" mt="sm"
                                            onClick={() => {

                                            }}>
                                        Register
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

    );

}

export default registrationPage;


