import type {NextPage} from 'next'
import {useEffect, useMemo, useState} from "react";
import {Customer} from "../models/Customer";
import {Alert, Container, LoadingOverlay} from "@mantine/core";
import {useRouter} from "next/router";
import CustomerService from "../services/CustomerService";
import {IconAlertCircle, IconUser, IconUsers} from "@tabler/icons-react";
import {useTranslation} from "next-i18next";
import {serverSideTranslations} from "next-i18next/serverSideTranslations";

const custerMessageBuilder = (personsInQueue: number) => {
    if (personsInQueue === 1) {
        return "Vor Ihnen befinden sich noch eine Person";
    } else if (personsInQueue > 4) {
        return "Vor Ihnen befinden sich noch mehr als vier Personen";
    } else {
        return "Vor Ihnen befinden sich noch " + personsInQueue + " Personen";
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
    // TODO: Use translation!
    const {t} = useTranslation();

    const [customer, setCustomer] = useState(null as Customer | null);
    const [error, setError] = useState(null as string | null);

    const [fixedWaitingTime, setFixedWaitingTime] = useState(0);
    const [liveWaitingTime, setLiveWaitingTime] = useState(0);
    const [latestAppointmentStart, setLatestAppointmentStart] = useState(null as null | Date);
    const [personsAhead, setPersonsAhead] = useState(0);
    const [organisationName, setOrganisationName] = useState('');

    const [isOvertime, setOvertime] = useState(false);

    const [actualTime, setActualTime] = useState(0);

    const router = useRouter();

    // TODO: Use useCallback (didn't update the state values for some reason..)
    const calculateTimeLeft = useMemo(() => {
        if (latestAppointmentStart) {
            const difference = +(new Date()) - +(new Date(latestAppointmentStart));
            const minuteDifference = Math.floor((difference / 1000 / 60) % 60);
            setActualTime(fixedWaitingTime + Math.max(0, liveWaitingTime - minuteDifference));
            setOvertime(liveWaitingTime - minuteDifference < 0);
        } else {
            setActualTime(fixedWaitingTime);
        }
    }, [latestAppointmentStart, liveWaitingTime, fixedWaitingTime]);

    useEffect(() => {
        const id = router.query['id'];
        if (id) {
            CustomerService.fetchCustomersInSameQueue(+id).then(([c, otherCustomers, organisation, queue]) => {
                setCustomer(c);
                setPersonsAhead(otherCustomers.length);
                setFixedWaitingTime(otherCustomers.filter(oc => oc.id !== queue.active_customer && oc.position < c.position)
                    .reduce((previous, currentCustomer) => previous + currentCustomer.duration, 0));
                setLiveWaitingTime(otherCustomers.find(c => c.id === queue.active_customer)?.duration ?? 0);
                console.log("live waiting time", otherCustomers.find(c => c.id === queue.active_customer)?.duration ?? 0);
                setLatestAppointmentStart(queue.latest_appointment_start);
                setOrganisationName(organisation.name);
            });
        } else {
            setError(t('errors.parameterMissing'));
        }

        // @ts-ignore see the TODO above the calculateTimeLeft function
        const timer = setInterval(calculateTimeLeft, 30000);
        calculateTimeLeft;

        return () => clearInterval(timer);
    }, [router.query]);

    return customer ? (
        <div className="min-h-screen flex flex-col items-center justify-center py-2">
            <div className='p-10 bg-gray-100 justify-center'>
                <div className="text-center" style={{width: "400px"}}>
                    <br/>
                    <h1 className="">Herzlichen Willkommen bei {organisationName}, {customer.name}!</h1>
                    <br/>
                    <br/>
                    {!isOvertime && fixedWaitingTime === 0 ?
                        <>
                            <div className={`${isOvertime ? "" : "blue-color"} text-center`} style={{
                                width: "150px",
                                height: "150px",
                                border: "15px solid",
                                borderRadius: "75px",
                                margin: "0 auto"
                            }}>
                                <h1 className="pt-5 pb-0 text-black font-bold">{actualTime}</h1>
                                <h4 className="text-black font-bold pt-0">min</h4>
                            </div>
                            <h2 className='pt-5 font-bold'>Ihre geschätze Wartezeit</h2>
                            <br/>
                            <br/>
                            <br/>
                            <div className=' flex justify-items-center justify-center' style={{}}>
                                {personInQueue(personsAhead)}
                            </div>
                            <p className=' font-bold'>{custerMessageBuilder(personsAhead)}</p>
                        </>
                        : <>
                            <p>Sie sind gleich dran.</p>
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