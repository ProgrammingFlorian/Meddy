import '../styles/globals.css'
import {AppProps} from 'next/app';
import Head from 'next/head';
import {createEmotionCache, MantineProvider} from '@mantine/core';
import {useState} from "react";
import {createBrowserSupabaseClient} from "@supabase/auth-helpers-nextjs";
import {SessionContextProvider} from "@supabase/auth-helpers-react";
import {Session} from "@supabase/supabase-js";

export default function App({Component, pageProps}: AppProps<{ initialSession: Session }>) {
    // To load mantine after tailwind (some mantine css got overwritten my tailwind)
    const mantineCache = createEmotionCache({
        key: 'mantine',
        prepend: false
    });

    const [supabaseClient] = useState(() => createBrowserSupabaseClient());

    return (
        <>
            <Head>
                <title>Meddy</title>
                <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width"/>
            </Head>

            <SessionContextProvider supabaseClient={supabaseClient}
                                    initialSession={pageProps.initialSession}>
                <MantineProvider
                    withGlobalStyles
                    withNormalizeCSS
                    theme={{
                        /** Put your mantine theme override here */
                        colorScheme: 'light',
                    }}
                    emotionCache={mantineCache}
                >
                    <Component {...pageProps} />
                </MantineProvider>
            </SessionContextProvider>
        </>
    );
}