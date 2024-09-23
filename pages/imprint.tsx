import {Container, Center, Space, Text} from "@mantine/core";
import {NextPage} from "next";
import TitleText from "../components/landing_page/TitleText";
import {serverSideTranslations} from "next-i18next/serverSideTranslations";

const Imprint: NextPage = () => {

    return (
        <Container className="py-10">
            <Center>
                <TitleText size={40}/>
            </Center>
            <Space h={100}/>
            <Text className="text-center" size={40} fw={700}>Impressum</Text>
            <Space h={50}/>
            <Space h={100}/>
            <p>Meddy wird nicht fortgesetzt</p>
            <Space h={20}/>
            <p>Marius Weigt</p>
            <p>Schubartstraße 9</p>
            <p>74076 Heilbronn</p>
            <p>Deutschland</p>
            <br/>
            <p>Tel.: +49 1573 2128812</p>
            <p>E-Mail: info@meddy.me</p>
            <br/>
            <p>Plattform der EU-Kommission zur Online-Streitbeilegung:
                <a href="https://ec.europa.eu/odr">https://ec.europa.eu/odr</a>
            </p>
            <br/>
            <br/>
            <p>Wir sind zur Teilnahme an einem Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle weder
                verpflichtet noch bereit.</p>
            <br/>
            <br/>
            <a className="underline" href="https://meddy.me/privacy">Datenschutz</a>
        </Container>
    )

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

export default Imprint;