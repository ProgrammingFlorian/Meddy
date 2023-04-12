import type {NextPage} from 'next'
import {Card, Title} from "@mantine/core";
import {serverSideTranslations} from "next-i18next/serverSideTranslations";
import Website from "./website";

const Home: NextPage = () => {
    return (
        <div>

            <Website/>
            <div className="flex min-h-screen flex-col items-center justify-center py-2">
                <main className="flex w-full flex-1 flex-col items-center justify-center px-20 text-center">

                    <Title order={1}
                           variant="gradient"
                           gradient={{from: 'indigo', to: 'cyan', deg: 45}}
                           sx={{fontFamily: 'Greycliff CF, sans-serif'}}
                           ta="center"
                           size="100px"
                           fw={700}
                    >Meddy</Title>

                    <a href="overview"
                       className="rounded-xl text-left mt-12">
                        <Card shadow="sm" p="lg" radius="md" withBorder>
                            <h3 className="text-2xl font-bold text-center hover:text-blue-600 focus:text-blue-600">Starten &rarr;</h3>
                        </Card>
                    </a>
                </main>
            </div>
        </div>

    );
}

export async function getStaticProps({locale}: { locale: string }) {
    return {
        props: {
            ...(await serverSideTranslations(locale, [
                'common'
            ])),
            // Will be passed to the page component as props
        },
    }
}

export default Home;
