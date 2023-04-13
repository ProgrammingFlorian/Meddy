import {NextPage} from "next";
import React from "react";

import {serverSideTranslations} from "next-i18next/serverSideTranslations";
import {Box, Container, Center, Flex, Grid, Space, Text} from '@mantine/core';
import {useTranslation} from "next-i18next";
import WebsiteImage from "../components/WebsiteComponents/websiteImage";
import FeatureCards from "../components/WebsiteComponents/featureCards";
import UseCaseAccordion from "../components/WebsiteComponents/useCaseAccordion";
import UserStoryComponent from "../components/WebsiteComponents/userStoryComponent";
import ContactUsComponent from "../components/WebsiteComponents/contactUsComponent";
import AboutUsComponent from "../components/WebsiteComponents/aboutUsComponent";


const Index: NextPage = () => {
    const {t} = useTranslation();

    return (
        <Box>
            <WebsiteImage/>
            <Space h={100}/>
            <Text className="font-bold text-center py-10" style={{fontSize: 60}}>{t("indexPage.mission")}</Text>
            <Container fluid className="text-center m-0" style={{maxWidth: 1400}}>
                <Box w={"90%"} className="pb-10" mx="auto">
                    <Text className="text-center" style={{fontSize: 35}}>{t("indexPage.useCase")}</Text>
                </Box>

                <Space h={50}/>
                <FeatureCards/>
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
                    <UseCaseAccordion/>
                </Container>

                <Space h={200}/>
                <UserStoryComponent/>
                <Space h={200}/>
                <Center>
                    <Grid gutter={20} className="" w={"100%"} justify={"space-between"}>
                        <Grid.Col md={5} lg={5}  span={12} style={{display: 'flex', alignItems: 'center'}}>
                            <ContactUsComponent/>
                        </Grid.Col >
                        <Grid.Col md={7} lg={7} span={12} style={{display: 'flex', alignItems: 'center'}}>
                            <AboutUsComponent/>
                        </Grid.Col >
                    </Grid>
                </Center>

                <Space h={200}/>
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

export default Index;