import '../styles/globals.css'
import { AppProps } from 'next/app';
import Head from 'next/head';
import {createEmotionCache, MantineProvider} from '@mantine/core';

export default function App(props: AppProps) {
  const { Component, pageProps } = props;

    // To load mantine after tailwind (some mantine css got overwritten my tailwind)
    const mantineCache = createEmotionCache({
        key: 'mantine',
        prepend: false
    });

  return (
    <>
      <Head>
        <title>Meddy</title>
        <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
      </Head>

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
    </>
  );
}