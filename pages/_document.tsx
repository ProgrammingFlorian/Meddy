import { createGetInitialProps } from '@mantine/next';
import Document, { Head, Html, Main, NextScript } from 'next/document';

const getInitialProps = createGetInitialProps();

export default class _Document extends Document {
    static getInitialProps = getInitialProps;

    render() {
        return (
            <Html>
                <Head />
                <body>
                    <Main />
                    <NextScript />
                    <footer className="flex h-24 w-full items-center justify-center border-t">
                        <p>
                            Webseite erstellt von{' '}
                            <span className="font-bold">
                                Florian Koller & Marius Weigt
                            </span>
                        </p>
                    </footer>
                </body>
            </Html>
        );
    }
}