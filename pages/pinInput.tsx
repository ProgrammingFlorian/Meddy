import {NextPage} from "next";
import {Button, Center, Container, Divider, Group, PinInput, Space, Text} from "@mantine/core";
import TitleText from "../components/landing_page/TitleText";
import {useTranslation} from "next-i18next";
import React from "react";

const PinInputPage: NextPage = () => {
    const {t} = useTranslation();
    return (
        <> <Container>
            <Container style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                height: "100vh"
            }}>
                <TitleText size={60} style={{marginTop: 5}}></TitleText>
                <Center className="py-10">
                    <Text weight={500} size={30} className="text-blue-600 text-center">
                        Gebe Sie hier den am Empfang erhaltenen sechstelligen Code ein
                    </Text>
                </Center>
                <Space h={80}/>
                <Group position="center">

                        <PinInput
                            length={6}
                            size="xl"
                            styles={{
                                input: {
                                    height: 120,
                                    width: 80,
                                    fontSize: '2em' // You can adjust the font size to fit the larger input field
                                }
                            }}
                        />
                    <Space h={40}/>
                    <Button style={{marginTop: 40}} size="xl">Wartezeit anzeigen</Button>
                </Group>



            </Container>

            <Divider my="sm"/>
            <Container>

            </Container>
            <Container className="h-100" style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                height: "90vh"
            }}>
                <Text className="text-center pt-5" weight={500} style={{fontSize: 40, color: "dimgray"}}>
                    {t("wait.informationAboutMeddy")}
                    <p className="pt-5"> {t("wait.contactUs")}</p>
                </Text>
            </Container>
        </Container>
        </>
    )

}

export default PinInputPage;