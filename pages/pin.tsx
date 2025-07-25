import {NextPage} from "next";
import {Alert, Button, Center, Container, Divider, Flex, Group, PinInput, Space, Text} from "@mantine/core";
import TitleText from "../components/landing_page/TitleText";
import {useTranslation} from "next-i18next";
import React, {useState} from "react";
import {serverSideTranslations} from "next-i18next/serverSideTranslations";
import {useForm} from "@mantine/form";
import CustomerService from "../services/CustomerService";
import {useRouter} from "next/navigation";
import {ROUTE_WAIT} from "../helpers/Routes";

const PinInputPage: NextPage = () => {
    const {t} = useTranslation();
    const router = useRouter();

    const [error, setError] = useState(null as null | string);

    const form = useForm({
        initialValues: {pin: ""},
        validate: {
            pin: (value: string) => {
                const num = Number(value);
                return (num >= 0 && num < 1000000) ? null : t("errors.passwordLength");
            }
        }
    });

    const submit = (values: { pin: string }) => {
        CustomerService.fetchCustomerUUID(values.pin).then((uuid) => {
            if (uuid) {
                router.push(ROUTE_WAIT(uuid));
            } else {
                setError(t('errors.uuidNotFound'));
            }
        }).catch((e) => {
            setError(e);
        })
    }

    return (
        <>
            <Container>
                <form onSubmit={form.onSubmit(submit)}>
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
                                {t('pin.codeMessage')}
                            </Text>
                        </Center>
                        {error ?
                            <Alert color="red">{error}</Alert>
                            : <></>}
                        <Space h={80}/>
                        <Group position="center">
                            <Flex direction={"column"}>
                                <Center>
                                    <PinInput
                                        length={6}
                                        size="xl"
                                        type={/^[0-9]+/} inputType="number" inputMode="numeric"
                                        styles={{
                                            input: {
                                                height: 100,
                                                width: 60,
                                                fontSize: '2em' // You can adjust the font size to fit the larger input field
                                            }
                                        }}
                                        {...form.getInputProps('pin')}
                                    />
                                </Center>

                                <Space h={40}/>
                                <Center>
                                    <Button type="submit" style={{height: 80, width: 420}} size="xl"><Text size={25}>
                                        {t('pin.showButton')}</Text></Button>
                                </Center>


                            </Flex>

                            </Group>
                    </Container>
                </form>

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
    );
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

export default PinInputPage;