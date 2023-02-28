import '../styles/globals.css'
import {AppProps} from 'next/app';
import Head from 'next/head';
import {createEmotionCache, MantineProvider} from '@mantine/core';
import {useState} from "react";
import {createBrowserSupabaseClient} from "@supabase/auth-helpers-nextjs";
import {SessionContextProvider} from "@supabase/auth-helpers-react";
import {Session} from "@supabase/supabase-js";
import FooterComponent from "../components/FooterComponent";

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
                <title>Swait</title>
                <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width"/>
                <meta name="description" content="Wartezeiten intelligent verkürzen"/>
            </Head>

            <SessionContextProvider supabaseClient={supabaseClient}
                                    initialSession={pageProps.initialSession}>
                <MantineProvider
                    withGlobalStyles
                    withNormalizeCSS
                    theme={{colorScheme: 'light'}}
                    emotionCache={mantineCache}
                >
                    <Component {...pageProps} />
                    <FooterComponent />
                </MantineProvider>
            </SessionContextProvider>
        </>
    );
}