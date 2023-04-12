import {Card, Center, Grid, Text} from "@mantine/core";
import {IconAccessible, IconLock, IconMoodSmile} from "@tabler/icons-react";
import React from "react";
import {useTranslation} from "next-i18next";

const FeatureCards = () => {
    const {t} = useTranslation();
    return (
        <Center className="py-10" >
            <Grid className="py-10 p-10 text-center" w={"100%"} columns={3} justify={"space-between"}
                  style={{maxWidth: 1400}}>
                <Card shadow="sm" style={{maxWidth: 400}} radius="md" withBorder >
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
    )
}

export default FeatureCards;