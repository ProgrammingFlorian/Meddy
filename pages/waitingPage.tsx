import type {NextPage} from 'next'
import {useEffect, useState} from "react";
import {Customer} from "../models/Customer";
import {LoadingOverlay} from "@mantine/core";
import {useRouter} from "next/router";
import CustomerService from "../services/CustomerService";
import {IconUser, IconUsers} from "@tabler/icons-react";

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

const waitingPage: NextPage = () => {
    const [customer, setCustomer] = useState(null as Customer | null);
    const [waitingTime, setWaitingTime] = useState(0);
    const [personsAhead, setPersonsAhead] = useState(0);
    const [organisationName, setOrganisationName] = useState('');

    const router = useRouter();

    useEffect(() => {
        const id = router.query['id'];
        if (id) {
            CustomerService.fetchCustomersInSameQueue(+id).then(([c, otherCustomers, organisation]) => {
                setCustomer(c);
                setPersonsAhead(otherCustomers.length);
                setWaitingTime(otherCustomers.reduce((previous, currentCustomer) => previous + currentCustomer.duration, 0))
                setOrganisationName(organisation.name);
            });
        }
    }, [router.query]);

    return customer ? (
        <div className="min-h-screen flex flex-col items-center justify-center py-2">
            <div className='p-10 bg-gray-100 justify-center'>
                <div className="text-center" style={{width: "400px"}}>
                    <br/>
                    <h1 className="">Herzlichen Willkommen bei {organisationName}, {customer.name}!</h1>
                    <br/>
                    <br/>
                    <div className='blue-color text-center' style={{
                        width: "150px",
                        height: "150px",
                        border: "15px solid",
                        borderRadius: "75px",
                        margin: "0 auto"
                    }}>
                        <h1 className="pt-5 pb-0 text-black font-bold">{waitingTime}</h1>
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
    ) : (
        <LoadingOverlay visible={true}/>
    );
};

export default waitingPage;