import type {NextPage} from 'next'
import {useEffect, useState} from "react";
import {Customer} from "../models/Customer";
import {Alert, Container, LoadingOverlay} from "@mantine/core";
import {useRouter} from "next/router";
import CustomerService from "../services/CustomerService";
import {IconAlertCircle, IconUser, IconUsers} from "@tabler/icons-react";
import {TFunction, useTranslation} from "next-i18next";
import {serverSideTranslations} from "next-i18next/serverSideTranslations";
import {getTimeLeftFunction} from "../helpers/Functions";
import {supabase} from "../lib/Store";
import {RealtimeChannel} from "@supabase/realtime-js";

const custerMessageBuilder = (personsInQueue: number, t: TFunction) => {
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
        return Array(personsInQueue).fill(null).map((_, index) => <IconUser key={index} color="#0099ff"/>);
    }
};

const wait: NextPage = () => {
    const {t} = useTranslation();

    const [customer, setCustomer] = useState(null as Customer | null);
    const [error, setError] = useState(null as string | null);

    const [remainingTime, setRemainingTime] = useState(0);
    const [isOvertime, setIsOvertime] = useState(false);
    const [personsAhead, setPersonsAhead] = useState(0);
    const [organisationName, setOrganisationName] = useState('');

    const [intervalId, setIntervalId] = useState(null as null | NodeJS.Timer);
    const [channel, setChannel] = useState(null as null | RealtimeChannel);

    const router = useRouter();

    const loadData = (id: string) => {
        CustomerService.fetchCustomersInSameQueue(id).then(([c, otherCustomers, organisation, queue]) => {
            setCustomer(c);
            setPersonsAhead(otherCustomers.length);
            setOrganisationName(organisation.name);

            const timeLeft = getTimeLeftFunction(queue.latest_appointment_start, otherCustomers, queue, c, setRemainingTime, setIsOvertime);

            setIntervalId(oldIntervalId => {
                if (oldIntervalId) {
                    clearInterval(oldIntervalId);
                }
                return setInterval(() => {
                    timeLeft();
                    console.log("interval", intervalId);
                }, 10000)
            });
            timeLeft();
        });
    }

    useEffect(() => {
        const id = router.query['id'] as string;
        if (id) {
            loadData(id);
            const realtimeChannel = supabase.channel('any').on('postgres_changes', {event: 'UPDATE', schema: 'public', table: 'customers'},
                _ => {
                    loadData(id);
                }).subscribe();
            setChannel(realtimeChannel);
        } else {
            setTimeout(() => {
                setError(t('errors.parameterMissing'));
            }, 1000);
        }

        return () => {
            if (intervalId) {
                clearInterval(intervalId);
            }
            if (channel) {
                supabase.removeChannel(channel);
            }
        };
    }, [router.query]);

    return customer ? (
        <div className="min-h-screen flex flex-col items-center justify-center py-2">
            <div className='p-10 bg-gray-100 justify-center'>
                <div className="text-center" style={{width: "400px"}}>
                    <br/>
                    <h1 className="">{t('wait.welcomeMessage', {
                        organisation: organisationName,
                        customer: customer.name
                    })}</h1>
                    <br/>
                    <br/>
                    {remainingTime > 0 ?
                        <>
                            <div className={`${isOvertime ? "" : "blue-color"} text-center`} style={{
                                width: "150px",
                                height: "150px",
                                border: "15px solid",
                                borderRadius: "75px",
                                margin: "0 auto"
                            }}>
                                <h1 className="pt-5 pb-0 text-black font-bold">{remainingTime}</h1>
                                <h4 className="text-black font-bold pt-0">min</h4>
                            </div>
                            <h2 className='pt-5 font-bold'>{t('wait.expectedWaitingTime')}</h2>
                            <br/>
                            <br/>
                            <br/>
                            <div className=' flex justify-items-center justify-center' style={{}}>
                                {personInQueue(personsAhead)}
                            </div>
                            <p className=' font-bold'>{custerMessageBuilder(personsAhead, t)}</p>
                        </>
                        : <>
                            <p>{t('wait.soon')}</p>
                        </>}
                </div>
                <br/>
                {/* TODO: Notifications
                <div className="w-full flex justify-center">
                    <button
                        className="bg-blue hover:bg-blue-500 text-white justify-self-center border border-transparent text-xs py-2 px-4 rounded"
                        style={{width: "200px"}}>
                        Ich möchte benachrichtigt werden, wenn ich dran bin!
                    </button>
                </div>
                */}
            </div>
        </div>
    ) : error ? (
        <Container mt={50}>
            <Alert icon={<IconAlertCircle size="1rem"/>} title={t('errors.title')} color="red">
                {error}
            </Alert>
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