import {Accordion, Grid, Image, Space, Text} from "@mantine/core";
import {IconPencil, IconQrcode, IconUserCheck} from "@tabler/icons-react";
import React from "react";
import {useTranslation} from "next-i18next";

const UseCaseAccordion = () => {
    const {t} = useTranslation();

    return (
        <Accordion className="pt-5" variant="filled" defaultValue="1" style={{fontSize: 25, fontWeight: 500}}>
            <Accordion.Item value="1">
                <Accordion.Control icon={<IconUserCheck className="blue-color" size={35}/>}><Text
                    style={{fontSize: 30}} weight={500}>
                    {t("indexPage.checkInToggle")}</Text></Accordion.Control>
                <Accordion.Panel className="py-5">
                    <Grid justify={"space-evenly"}>
                        <Grid.Col className="text-start" span={5} style={{display: 'flex', alignItems: 'center'}}>
                            1. Kunden Name eingeben<br/>
                            2. Geschätze Termindauer anklicken (bzw. eingeben)<br/>
                            3. Warteschlange auswählen<br/>
                            4. Kunde erstellen
                        </Grid.Col>
                        <Grid.Col span={4}><Image src="./Images/checkInCustomer.png"/></Grid.Col>
                    </Grid>

                </Accordion.Panel>
            </Accordion.Item>

            <Accordion.Item value="2">
                <Accordion.Control icon={<IconQrcode className="blue-color" size={35}/>}><Text
                    style={{fontSize: 30}}
                    weight={500}>{t("indexPage.scanQRToggle")}</Text></Accordion.Control>
                <Accordion.Panel>
                    <Grid justify={"space-evenly"}>
                        <Grid.Col className="text-start" span={4} style={{display: 'flex', alignItems: 'center'}}>
                            1. Kunde scannt QR-Code<br/>
                            2. Wartezeit wird auf seinem Smartphone angezeigt<br/>
                        </Grid.Col>
                        <Grid.Col span={4}><Image src="./Images/waitingView.png"/></Grid.Col>
                    </Grid></Accordion.Panel>
            </Accordion.Item>

            <Accordion.Item value="3" className="text-start">
                <Accordion.Control icon={<IconPencil className="blue-color" size={35}/>}><Text
                    style={{fontSize: 30}}
                    weight={500}>{t("indexPage.queueManagement")}</Text></Accordion.Control>
                <Accordion.Panel>
                    <Space h={50}/>
                    <Grid justify={"space-evenly"}>
                        <Grid.Col span={4} style={{display: 'flex', alignItems: 'center'}}>
                            Ändern der Reihenfolge/ Warteschlange
                        </Grid.Col >
                        <Grid.Col span={5} className="rounded-5 bg-white shadow" style={{borderRadius: 10}}>  <Image src="./Images/changeOrder.png" />
                        </Grid.Col>
                    </Grid>
                    <Space h={50}/>
                    <Grid justify={"space-evenly"}>
                        <Grid.Col span={4} style={{display: 'flex', alignItems: 'center'}}>
                            Bearbeiten von Kunden
                        </Grid.Col>
                        <Grid.Col span={5} className="rounded-5 bg-white shadow" style={{borderRadius: 10}}>  <Image className="p-5" src="./Images/editCustomer.png" />
                        </Grid.Col>
                    </Grid>
                    <Space h={50}/>
                    <Grid justify={"space-evenly"}>
                        <Grid.Col span={4} style={{display: 'flex', alignItems: 'center'}}>
                            Warteschlangen verwalten
                        </Grid.Col>
                        <Grid.Col span={5} className="rounded-5 bg-white shadow" style={{borderRadius: 10}}>  <Image className="p-5" src="./Images/queueManagement.png" />
                        </Grid.Col>
                    </Grid>
                </Accordion.Panel>
            </Accordion.Item>
        </Accordion>
    )

}

export default UseCaseAccordion;