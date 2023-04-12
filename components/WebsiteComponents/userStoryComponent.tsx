import {Box, Button, Collapse, Space, Text, Title} from "@mantine/core";
import React, {useState} from "react";
import {useTranslation} from "next-i18next";
import {useDisclosure} from "@mantine/hooks";

const UserStoryComponent = () => {
    const { t } = useTranslation();
    const [opened, { toggle }] = useDisclosure(false);
    const [buttonText, setButtonText] = useState(t("indexPage.readStory"));

    return (
        <Box style={{maxWidth: 1300}}>
            <Title weight={500}>Über uns</Title>
            <Space h={50} />
            <Text style={{ fontSize: 30, maxWidth: 1300 }}>
                {t("indexPage.aboutUsIntroduction")}
            </Text>
            <Collapse in={opened}>
                <Text style={{ fontSize: 30, maxWidth: 1300 }}>
                    {t("indexPage.aboutUs")}
                </Text>
            </Collapse>
            <Button size={"lg"} className="m-10" onClick={toggle}>
                {opened ? t("indexPage.closeStory") : buttonText}
            </Button>
        </Box>
    );
}

export default UserStoryComponent;