import {BackgroundImage, Button, Center, Container, Flex, Text} from "@mantine/core";
import React from "react";
import TitleText from "./TitleText";
import {useTranslation} from "next-i18next";
import {useRouter} from "next/navigation";
import {ROUTE_OVERVIEW, ROUTE_PIN_INPUT} from "../../helpers/Routes";

const WebsiteImage = () => {
    const {t} = useTranslation();

    const router = useRouter();

    const scrollToContact = () => {
        const scrollDiv = typeof document !== 'undefined' ? document.getElementById("contact")?.offsetTop : null;
        if (scrollDiv) {
            window.scrollTo({top: scrollDiv, behavior: 'smooth'});
        }
    }

    return (
        <div style={{height: '100vh', backgroundColor: "black"}}>
            <BackgroundImage style={{opacity: "90%"}} className="h-full w-full" src="/images/title_background.jpg">
                <Container className="h-full" style={{maxWidth: 1500}} px={20}>
                    <Flex className="h-full" align="center" justify="center">
                        <Container style={{position: "absolute", top: 0, right: 0}}>
                            <Button size={"lg"}
                                    onClick={() => router.replace(ROUTE_PIN_INPUT)}>{t('indexPage.pin')}</Button>
                            <Button size={"lg"} className="m-5"
                                    onClick={scrollToContact}>{t('indexPage.contact')}</Button>
                            <Button size={"lg"}
                                    onClick={() => router.replace(ROUTE_OVERVIEW)}>{t('login.title')}</Button>
                        </Container>
                        <Flex className="h-full" direction="row" align="flex-end">
                            <Flex direction="column" mb={"5em"}>
                                <TitleText style={{fontSize: "min(25vw, 18rem)"}}/>
                                <Center>
                                    <Text style={{color: "white", fontSize: "min(8vw, 60px)"}} align="center">
                                        “Verwalten Sie Ihre Warteschlangen
                                        <span className="blue-color"> einfach und effizient</span>. Schaffen Sie
                                        gleichzeitig
                                        <span className="blue-color"> Transparenz</span> über Wartezeiten für Ihre
                                        Kunden.”
                                    </Text>
                                </Center>
                            </Flex>
                        </Flex>
                    </Flex>
                </Container>
            </BackgroundImage>

        </div>
    );

}

export default WebsiteImage;