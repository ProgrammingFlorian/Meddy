import {NextPage} from "next";
import React from "react";

import {serverSideTranslations} from "next-i18next/serverSideTranslations";
import {Accordion, BackgroundImage, Box, Card, Center, Container, Flex, Grid, Image, Space, Text} from '@mantine/core';
import {IconAccessible, IconLock, IconMoodSmile, IconUsers} from "@tabler/icons-react";
import {useTranslation} from "next-i18next";


const Website: NextPage = () => {
    const {t} = useTranslation();


    return (
        <Box>
            <div  style={{height: '100vw'}}>
                <BackgroundImage className="h-100" mx="auto" h={"100%"} src="./Images/website_image.jpg">
                    <Container fluid className="h-full">
                        <Text className="font-bold text-center h-100" style={{fontSize: 60}}>{t("appName")}</Text>
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
                <Container fluid className="p-5 text-xl bg-white shadow-md rounded-xl" style={{maxWidth: 1300}}>
                    <Flex>
                        <IconUsers className="blue-color" size={35}/>
                        <Text style={{fontSize: 35}} weight={500}>{t("indexPage.applicationQuestion")}</Text>
                    </Flex>

                    <Accordion variant="filled" defaultValue="1">
                        <Accordion.Item value="1">
                            <Accordion.Control><Text style={{fontSize: 30}} weight={500}>
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
                            <Accordion.Control><Text style={{fontSize: 30}}
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
                            <Accordion.Control><Text style={{fontSize: 30}}
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
                                        Verwaltung der Warteschlangen
                                    </Grid.Col>
                                    <Grid.Col span={4}><Image src="./Images/website_image.jpg"/></Grid.Col>
                                </Grid>
                            </Accordion.Panel>
                        </Accordion.Item>
                    </Accordion>
                </Container>
            </Container>
            <Space h={200}/>
            <Container>
                <Text className="text-center" style={{fontSize: 35}}>{t("indexPage.useCase")}</Text>
            </Container>


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