import {Accordion, Grid, Image, Space, Text, Button, Center, List, Group, Modal} from "@mantine/core";
import {IconPencil, IconQrcode, IconUserCheck} from "@tabler/icons-react";
import React, {useState} from "react";
import {useTranslation} from "next-i18next";
import {useDisclosure} from "@mantine/hooks";
import TextAndPictureAccordionComponent from "./textAndPictureAccordionComponent";

const UseCaseAccordion = () => {
    const {t} = useTranslation();
    const [openedCheckIn, setOpenedCheckIn] = useState(false);
    const [openedWaiting, setOpenedWaiting] = useState(false);

    return (
        <Accordion className="pt-5" variant="filled" defaultValue="1" style={{fontSize: 25, fontWeight: 500}}>
            <Accordion.Item value="1">
                <Accordion.Control icon={<IconUserCheck className="blue-color" size={35}/>}><Text
                    style={{fontSize: 30}} weight={500}>
                    {t("indexPage.checkInToggle")}</Text></Accordion.Control>
                <Accordion.Panel className="py-5">
                    <Grid justify={"space-evenly"} gutter={50} gutterLg={0}>
                        <Grid.Col  md={12} lg={5} style={{display: 'flex', alignItems: 'center'}}>
                            <Center className="w-full">
                                <Text className="text-start">
                                    <List type="ordered" size={"xxl"}>
                                        <List.Item>1. Kunden Name eingeben</List.Item>
                                        <List.Item>2. Geschätze Termindauer anklicken (bzw. eingeben)</List.Item>
                                        <List.Item>3. Warteschlange auswählen</List.Item>
                                        <List.Item>4. Kunde erstellen</List.Item>
                                    </List>
                                </Text>

                            </Center>
                        </Grid.Col>
                        <Grid.Col md={8} lg={5}>
                            <Modal size={"xl"} style={{width: "50%"}} opened={openedCheckIn} onClose={() => setOpenedCheckIn(false)} title="Reihenfolge/ Warteschlange der Kunden verändern">
                                <Image src="./Images/checkInCustomer.png" />
                            </Modal>
                            <Group position="center">
                                <Image onClick={() => setOpenedCheckIn(true)} src="./Images/checkInCustomer.png" />
                            </Group>
                        </Grid.Col>
                    </Grid>
                </Accordion.Panel>
            </Accordion.Item>

            <Accordion.Item value="2">
                <Accordion.Control icon={<IconQrcode className="blue-color" size={35}/>}><Text
                    style={{fontSize: 30}}
                    weight={500}>{t("indexPage.scanQRToggle")}</Text></Accordion.Control>
                <Accordion.Panel>
                    <Grid justify={"space-evenly"} gutter={50} gutterLg={0}>
                        <Grid.Col className="text-start" md={12} lg={5} style={{display: 'flex', alignItems: 'center'}}>
                            <Center className="w-full" >
                                <List style={{fontSize:25}}>
                                    <List.Item>1. Kunde scannt QR-Code</List.Item>
                                    <List.Item>2. Wartezeit wird auf seinem Smartphone angezeigt</List.Item>
                                </List>
                            </Center>
                        </Grid.Col>
                        <Grid.Col span={4}>
                            <Image src="./Images/waitingView.png" />
                        </Grid.Col>
                    </Grid></Accordion.Panel>
            </Accordion.Item>

            <Accordion.Item value="3" className="text-start">
                <Accordion.Control icon={<IconPencil className="blue-color" size={35}/>}><Text
                    style={{fontSize: 30}}
                    weight={500}>{t("indexPage.queueManagement")}</Text></Accordion.Control>
                <Accordion.Panel>
                    <Space h={50}/>
                    <TextAndPictureAccordionComponent image="./Images/changeOrder.png" description="Reihenfolge/ Warteschlange der Kunden verändern"/>
                    <Space h={50}/>
                    <TextAndPictureAccordionComponent image="./Images/editCustomer.png" description="Kunde bearbeiten"/>
                    <Space h={50}/>
                    <TextAndPictureAccordionComponent image="./Images/queueManagement.png" description="Warteschlangen verwalten"/>
                </Accordion.Panel>
            </Accordion.Item>
        </Accordion>
    )

}

export default UseCaseAccordion;