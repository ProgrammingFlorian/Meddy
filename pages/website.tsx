import {NextPage} from "next";
import React, {useCallback, useEffect, useState} from "react";

import {serverSideTranslations} from "next-i18next/serverSideTranslations";
import {
    Accordion,
    BackgroundImage,
    Box,
    Button,
    Card,
    Center,
    Collapse,
    Container,
    Flex,
    Grid,
    Image,
    Progress,
    Space,
    Text,
    Title
} from '@mantine/core';
import {IconAccessible, IconLock, IconMoodSmile, IconPencil, IconQrcode, IconUserCheck} from "@tabler/icons-react";
import {useTranslation} from "next-i18next";
import {useDisclosure} from "@mantine/hooks";
import {Carousel, Embla} from "@mantine/carousel";


const Website: NextPage = () => {
    const {t} = useTranslation();
    const [opened, {toggle}] = useDisclosure(false);
    const [scrollProgress, setScrollProgress] = useState(0);
    const [embla, setEmbla] = useState<Embla | null>(null);

    const handleScroll = useCallback(() => {
        if (!embla) return;
        const progress = Math.max(0, Math.min(1, embla.scrollProgress()));
        setScrollProgress(progress * 100);
    }, [embla, setScrollProgress]);

    useEffect(() => {
        if (embla) {
            embla.on('scroll', handleScroll);
            handleScroll();
        }
    }, [embla]);

    return (
        <Box>
            <div style={{height: '100vh'}}>
                <BackgroundImage className="" w={"100%"} h={"100%"} src="./Images/website_image_2.jpg">
                    <Container fluid className="h-full " style={{position: "relative"}}>
                        <Container style={{position: "absolute", top: 0, right: 0}}>
                            <Button size={"lg"} className="m-5">Kontakt</Button>
                            <Button size={"lg"}
                                    onClick={() => window.location.href = "https://meddy.me/overview"}>Anmelden</Button>
                        </Container>
                        <Text className=""
                              style={{position: "absolute", top: "25%", left: 0, right: 0, textAlign: "center"}}>
                            <Title order={1}
                                   variant="gradient"
                                   gradient={{from: 'indigo', to: 'cyan', deg: 45}}
                                   sx={{fontFamily: 'Greycliff CF, sans-serif'}}
                                   ta="center"
                                   size="200px"
                                   fw={700}
                            >Meddy</Title>
                            <Center>
                                <Text style={{color: "white", fontSize: "50px", maxWidth: 1500}}>
                                    “Verwalten Sie Ihre Warteschlangen
                                    <span className="blue-color"> einfach und effizient</span>. Schaffen Sie
                                    gleichzeitig
                                    <span className="blue-color"> Transparenz</span> über Wartezeiten für Ihre Kunden.”
                                </Text>

                            </Center>

                        </Text>
                    </Container>
                </BackgroundImage>

            </div>


            <Space h={100}/>
            <Text className="font-bold text-center py-10" style={{fontSize: 60}}>{t("indexPage.mission")}</Text>
            <Container fluid style={{maxWidth: 1400}}>
                <Box w={"90%"} className="pb-10" mx="auto">
                    <Text className="text-center" style={{fontSize: 35}}>{t("indexPage.useCase")}</Text>
                </Box>
                <Space h={50}/>
                <Center className="py-10">
                    <Grid className="py-10  p-10 text-center" w={"100%"} columns={3} justify={"space-between"}
                          style={{maxWidth: 1400}}>
                        <Card shadow="sm" style={{maxWidth: 400}} radius="md" withBorder>
                            <Center className="pt-5">
                                <IconAccessible size={50} className="blue-color"/>
                            </Center>
                            <Text className="pt-2" size={30} weight={500}>{t("indexPage.usability")}</Text>
                            <Text className="py-5" size={20} color="dimmed">
                                {t("indexPage.usabilityText")}
                            </Text>
                        </Card>
                        <Card shadow="sm" style={{maxWidth: 400}} radius="md" withBorder>
                            <Center className="pt-5">
                                <IconLock size={50} className="blue-color"/>
                            </Center>
                            <Text className="pt-2" size={30} weight={500}>{t("indexPage.privacy")}</Text>
                            <Text className="py-5" size={20} color="dimmed">
                                {t("indexPage.privacyText")}
                            </Text>
                        </Card>
                        <Card shadow="sm" style={{maxWidth: 400, whiteSpace: "pre-line"}} radius="md" withBorder>
                            <Center className="pt-5">
                                <IconMoodSmile size={50} className="blue-color"/>
                            </Center>
                            <Text className="pt-2" size={30} weight={500}>{t("indexPage.clientSatisfaction")}</Text>
                            <Text className="py-5" size={20} color="dimmed">
                                <Text className="pt-2" size={20}
                                      weight={500}>{t("indexPage.clientSatisfactionText")}</Text>
                            </Text>
                        </Card>
                    </Grid>
                </Center>
                <Space h={50}/>
                <Container fluid w={"90%"} className="py-10" style={{maxWidth: 1400}}>
                    <Text className="text-center" size={30}>
                        {t("indexPage.productDescription")}
                    </Text>
                </Container>
                <Space h={150}/>
                <Container fluid className="p-5 text-xl bg-white shadow-md rounded-xl"
                           style={{maxWidth: 1300, borderWidth: 1}}>
                    <Flex>
                        <Text style={{fontSize: 35}} weight={500}>{t("indexPage.applicationQuestion")}</Text>
                    </Flex>

                    <Accordion variant="filled" defaultValue="1">
                        <Accordion.Item value="1">
                            <Accordion.Control icon={<IconUserCheck className="blue-color" size={35}/>}><Text
                                style={{fontSize: 30}} weight={500}>
                                {t("indexPage.checkInToggle")}</Text></Accordion.Control>
                            <Accordion.Panel className="py-5">
                                <Grid justify={"space-evenly"}>
                                    <Grid.Col span={5} style={{display: 'flex', alignItems: 'center'}}>
                                        1. Kunden Name eingeben<br/>
                                        2. Geschätze Termindauer anklicken (bzw. eingeben)<br/>
                                        3. Warteschlange auswählen<br/>
                                        4. Kunde erstellen
                                    </Grid.Col>
                                    <Grid.Col span={4}><Image src="./Images/website_image.jpg"/></Grid.Col>
                                </Grid>

                            </Accordion.Panel>
                        </Accordion.Item>

                        <Accordion.Item value="2">
                            <Accordion.Control icon={<IconQrcode className="blue-color" size={35}/>}><Text
                                style={{fontSize: 30}}
                                weight={500}>{t("indexPage.scanQRToggle")}</Text></Accordion.Control>
                            <Accordion.Panel>
                                <Grid justify={"space-evenly"}>
                                    <Grid.Col span={4} style={{display: 'flex', alignItems: 'center'}}>
                                        1. Kunde scannt QR-Code<br/>
                                        2. Wartezeit wird auf seinem Smartphone angezeigt<br/>
                                    </Grid.Col>
                                    <Grid.Col span={4}><Image src="./Images/website_image.jpg"/></Grid.Col>
                                </Grid></Accordion.Panel>
                        </Accordion.Item>

                        <Accordion.Item value="3">
                            <Accordion.Control icon={<IconPencil className="blue-color" size={35}/>}><Text
                                style={{fontSize: 30}}
                                weight={500}>{t("indexPage.queueManagement")}</Text></Accordion.Control>
                            <Accordion.Panel>
                                <Grid justify={"space-evenly"}>
                                    <Grid.Col span={4} style={{display: 'flex', alignItems: 'center'}}>
                                        Ändern der Reihenfolge
                                    </Grid.Col>
                                    <Grid.Col span={4}><Image src="./Images/website_image.jpg"/></Grid.Col>
                                </Grid>
                                <Grid justify={"space-evenly"}>
                                    <Grid.Col span={4} style={{display: 'flex', alignItems: 'center'}}>
                                        Bearbeiten von Kunden
                                    </Grid.Col>
                                    <Grid.Col span={4}><Image src="./Images/website_image.jpg"/></Grid.Col>
                                </Grid>
                                <Grid justify={"space-evenly"}>
                                    <Grid.Col span={4} style={{display: 'flex', alignItems: 'center'}}>
                                        Warteschlangen verwalten
                                    </Grid.Col>
                                    <Grid.Col span={4}><Image src="./Images/website_image.jpg"/></Grid.Col>
                                </Grid>
                            </Accordion.Panel>
                        </Accordion.Item>
                    </Accordion>
                </Container>
            </Container>
            <Space h={200}/>
            <Container fluid className="text-center m-0" style={{maxWidth: 1300}}>
                <Title>Über uns</Title>
                <Space h={50}/>
                <Text style={{fontSize: 30}}>{t("indexPage.aboutUsIntroduction")}
                </Text>
                <Collapse in={opened}>
                    <Text style={{fontSize: 30}}>{t("indexPage.aboutUs")}</Text>
                </Collapse>
                <Button size={"md"} className="m-10" onClick={toggle}>Lies die ganze Story</Button>
            </Container>
            <Space h={200}/>
            <>
                <Carousel
                    dragFree
                    slideSize="50%"
                    slideGap="md"
                    height={200}
                    getEmblaApi={setEmbla}
                    initialSlide={2}
                >
                    <Carousel.Slide>1</Carousel.Slide>
                    <Carousel.Slide>2</Carousel.Slide>
                    <Carousel.Slide>3</Carousel.Slide>
                    {/* ...other slides */}
                </Carousel>
                <Progress
                    value={scrollProgress}
                    styles={{bar: {transitionDuration: '0ms'}, root: {maxWidth: 1300}}}
                    size="sm"
                    mt="xl"
                    mx="auto"
                />
            </>

        </Box>

    );
};

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

export default Website;