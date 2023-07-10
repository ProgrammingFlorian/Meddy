import type {NextPage} from 'next'
import {useEffect, useState} from "react";
import {Customer} from "../models/Customer";
import {Alert, Button, Center, Container, Divider, LoadingOverlay, Space, Text} from "@mantine/core";
import {useRouter} from "next/router";
import CustomerService from "../services/CustomerService";
import {IconAlertCircle, IconUser, IconUsers} from "@tabler/icons-react";
import {TFunction, useTranslation} from "next-i18next";
import {serverSideTranslations} from "next-i18next/serverSideTranslations";
import {getTimeLeftFunction} from "../helpers/Functions";
import {supabase} from "../lib/Store";
import {RealtimeChannel} from "@supabase/realtime-js";
import TitleText from "../components/landing_page/TitleText";

const customMessageBuilder = (personsInQueue: number, t: TFunction) => {
    if (personsInQueue === 1) {
        return t('wait.peopleAhead.1');
    } else if (personsInQueue > 4) {
        return t('wait.peopleAhead.more');
    } else {
        return t('wait.peopleAhead.number', {count: personsInQueue});
    }
};

const personInQueue = (personsInQueue: number) => {
    if (personsInQueue > 4) {
        return <IconUsers color="#0099ff"/>;
    } else {
        return Array(personsInQueue).fill(null).map((_, index) => <IconUser size={50} key={index} color="#0099ff"/>);
    }
};

const wait: NextPage = () => {
    const {t} = useTranslation();

    const [customer, setCustomer] = useState(null as Customer | null);
    const [error, setError] = useState(null as string | null);
    const [channelError, setChannelError] = useState(false);

    const [remainingTime, setRemainingTime] = useState(0);
    const [isOvertime, setIsOvertime] = useState(false);
    const [personsAhead, setPersonsAhead] = useState(0);
    const [organisationName, setOrganisationName] = useState('');

    const [intervalId, setIntervalId] = useState(null as null | NodeJS.Timer);
    const [channelCustomers, setChannelCustomers] = useState(null as null | RealtimeChannel);
    const [channelQueues, setChannelQueues] = useState(null as null | RealtimeChannel);

    const router = useRouter();

    const CHANNEL_CUSTOMERS = "db_customers";
    const CHANNEL_QUEUES = "db_queues";

    const loadData = (id: string) => {
        CustomerService.fetchCustomersInSameQueue(id).then(([c, otherCustomers, organisation, queue]) => {
            setCustomer(c);
            setPersonsAhead(otherCustomers.filter(oc => oc.position < c.position).length);
            setOrganisationName(organisation.name);

            const timeLeft = getTimeLeftFunction(queue.latest_appointment_start, otherCustomers, queue, c, setRemainingTime, setIsOvertime);

            setIntervalId(oldIntervalId => {
                if (oldIntervalId) {
                    clearInterval(oldIntervalId);
                }
                return setInterval(() => {
                    timeLeft();
                }, 10000);
            });
            timeLeft();
        }).catch(() => {
            setError(t('errors.customerNotFound'));
        });
    }

    useEffect(() => {
        const id = router.query['id'] as string;
        let timeout: NodeJS.Timeout;
        if (id) {
            loadData(id);
            let updateTimeout: NodeJS.Timeout;

            const updateCallback = () => {
                if (updateTimeout) {
                    clearTimeout(updateTimeout);
                }
                updateTimeout = setTimeout(() => {
                    loadData(id);
                }, 5000);
            };

            let subscribeCallback = (status: string) => {
                setChannelError(status !== 'SUBSCRIBED');
            };

            const realtimeChannelCustomers = supabase.channel(CHANNEL_CUSTOMERS).on('postgres_changes', {
                    event: '*',
                    schema: 'public',
                    table: 'customers'
                },
                updateCallback
            ).subscribe(subscribeCallback);

            const realtimeChannelQueues = supabase.channel(CHANNEL_QUEUES).on('postgres_changes', {
                    event: '*',
                    schema: 'public',
                    table: 'queues'
                },
                updateCallback
            ).subscribe(subscribeCallback);

            setChannelCustomers(realtimeChannelCustomers);
            setChannelQueues(realtimeChannelQueues);
        } else {
            // it takes a short time to get the pin
            timeout = setTimeout(() => {
                setError(t('errors.parameterMissing'));
            }, 1000);
        }

        return () => {
            if (intervalId) {
                clearInterval(intervalId);
            }
            if (timeout) {
                clearTimeout(timeout);
            }
            if (channelCustomers) {
                supabase.removeChannel(channelCustomers);
            }
            if (channelQueues) {
                supabase.removeChannel(channelQueues);
            }
        };
    }, [router.query]);

    const refresh = () => {
        router.reload();
    }

    return error ? (
        <Container mt={50}>
            <Container className="h-100" style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                height: "90vh"
            }}>
                <Alert icon={<IconAlertCircle size="1rem"/>} title={t('errors.title')} color="red">
                    {error}
                </Alert>
                <Space h={100}/>
                <TitleText size={40}/>
                <Text className="text-center pt-5" weight={500} style={{fontSize: 40, color: "dimgray"}}>
                    {t("wait.informationAboutMeddy")}
                    <p className="pt-5"> {t("wait.contactUs")}</p>
                </Text>
            </Container>
        </Container>
    ) : customer ? (
        <Container>
            <Container style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                height: "100vh"
            }}>
                <TitleText size={60} style={{marginTop: 5}}></TitleText>
                <Center className="py-10">
                    <Text weight={500} size={50} className="text-blue-600 text-center">
                        {t('wait.welcomeMessage', {
                            organisation: organisationName
                        })}
                    </Text>
                </Center>
                <Space h={80}/>
                {remainingTime > 0 ?
                    <>
                        <Container className={`${isOvertime ? "" : "blue-color"} text-center`} style={{
                            width: "250px",
                            height: "250px",
                            border: "25px solid",
                            borderRadius: "150px",
                            margin: "0 auto"
                        }}>
                            <Container style={{
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "center",
                                alignItems: "center"
                            }} className="h-full">
                                <Text className="pb-0 mb-0"
                                      style={{fontSize: 50, color: "black", fontWeight: "bold"}}>{remainingTime}</Text>
                                <Text className="text-black font-bold pt-0 mt-0"
                                      style={{fontSize: 30, color: "black", fontWeight: "bold"}}>min</Text>
                            </Container>

                        </Container>
                        <Center style={{marginTop: 40}}>
                            <Text className='pt-5' weight={500}
                                  style={{fontSize: 40}}>{t('wait.expectedWaitingTime')}</Text>
                        </Center>
                        {channelError &&
                            <Button style={{height: 80, width: 420}} m="xl" onClick={refresh}><Text size={25}>{t('wait.refresh')}</Text></Button>}
                        <Space h={90}/>
                        <Center>
                            {personInQueue(personsAhead)}
                        </Center>
                        <Text className='text-center' weight={500} style={{fontSize: 40}}>
                            {customMessageBuilder(personsAhead, t)}
                        </Text></>
                    : <>
                        <h1>{t('wait.soon')}</h1>
                        {channelError &&
                            <Button style={{height: 80, width: 420}} m="xl" onClick={refresh}><Text size={25}>{t('wait.refresh')}</Text></Button>}
                    </>}
            </Container>

            <Divider my="sm"/>
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
                {/* TODO: Notifications
                        <div className="w-full flex justify-center">
                            <button
                                className="bg-blue hover:bg-blue-500 text-white justify-self-center border border-transparent text-xs py-2 px-4 rounded"
                                style={{width: "200px"}}>
                                Ich möchte benachrichtigt werden, wenn ich dran bin!
                            </button>
                        </div>
                        */}
            </Container>
        </Container>
    ) : (
        <LoadingOverlay visible={true}/>
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

export default wait;