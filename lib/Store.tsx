import {createContext, ReactNode, useCallback, useEffect, useState} from 'react'
import {createClient} from '@supabase/supabase-js'
import {Customer} from '../models/Customer'
import {RealtimeChannel} from "@supabase/realtime-js";
import {Queue} from "../models/Queue";
import QueueService from "../services/QueueService";
import CustomerService from "../services/CustomerService";
import {Organisation} from "../models/Organisation";
import OrganisationService from "../services/OrganisationService";
import {useAuth} from "./Auth";

export const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '');

const BROADCAST_CHANNEL = 'waiting_queue_updated';
const CHANNEL_NAME = 'waiting_updates';

interface StoreType {
    sendUpdate: (queue_id: number) => void;
    queues: Queue[];
    createQueue: (name: string) => void;
    updateQueue: (queue: Queue) => void;
    deleteQueue: (queue_id: number) => void;
    updateCustomersInQueue: (newValue: { [p: number]: Customer[] }) => void,
    customersInQueue: { [queue: number]: Customer[] };
    organisation: Organisation;
    updateOrganisation: (name: string) => void;
    updateCustomer: (customer: Customer) => void;
    deleteCustomer: (customer: Customer) => void;
}

export const useStore = (): StoreType => {
    const [customersInQueue, setCustomersInQueue] = useState([] as {
        [id: number]: Customer[]
    });
    const [queues, setQueues] = useState([] as Queue[]);
    const [organisation, setOrganisation] = useState({id: -1, name: ''} as Organisation); // TODO null

    // Before receiving the actual database values (id!) of new elements, add them to instantly show them and then later
    // replace their data with the database values. Use this counter as a preview to keep track of which one needs to
    // be replaced. Count downwards to ensure no actual ids are accidentally used
    let local_preview_counter = -1;

    let channel: RealtimeChannel | null = null;

    const auth = useAuth();
    const account = auth.user;

    useEffect(() => {
        // Fetch current state of customers
        if (account) {
            CustomerService.fetchCustomersFromAccountOrganisationGroupedByQueue(account.id).then(data => {
                const result: {
                    [id: number]: Customer[]
                } = [];

                data.organisations.queues.forEach(val => {
                    result[val.id] = val.customers;
                });

                setOrganisation({id: data.organisation_id, name: data.organisations.name});
                setCustomersInQueue(result);

            });
            QueueService.fetchQueues(account.id).then(setQueues);
        }

        // Listen to state changes of customers
        channel = supabase.channel(CHANNEL_NAME)
            .on(
                'broadcast',
                {
                    event: BROADCAST_CHANNEL
                    // TODO: Find out type
                }, (payload) => {
                    // TODO: Only update single queue
                    //fetchCustomers(setCustomers);
                }
            )
            .subscribe();

        // On unmount clean subscribed channels
        return () => {
            if (channel) {
                supabase.removeChannel(channel);
            }
        }
    }, [account]);

    const sendUpdate = useCallback((queue_id: number) => {
        if (channel) {
            // TODO: Send only the customers that should be updated
            channel.send({
                type: 'broadcast',
                event: BROADCAST_CHANNEL,
                payload: queue_id
            });
        }
    }, [channel]);

    const createQueue = (name: string) => {
        const temporaryId = local_preview_counter--;
        setQueues(previous => {
            const newQueues = [...previous];
            newQueues.push({
                id: temporaryId,
                name: name,
                organisation_id: organisation.id,
                latest_appointment_start: null,
                active_customer: null
            });
            return newQueues;
        });
        QueueService.createQueue(name, organisation.id).then(value => {
            setQueues(previous => {
                const newQueues = [...previous];
                newQueues[newQueues.findIndex(element => element.id === temporaryId)] = value;
                return newQueues;
            });
        });
    }

    const deleteQueue = (queue_id: number) => {
        setQueues(previous => previous.filter(queue => queue.id !== queue_id));
        QueueService.deleteQueue(queue_id); // TODO: Handle deletion error
    }

    const updateCustomer = (newValue: Customer) => {
        setCustomersInQueue(previous => {
            const newQueues = {...previous};
            newQueues[newValue.queue_id] = newQueues[newValue.queue_id].map(q =>
                q.id === newValue.id ? newValue : q
            );
            return newQueues;
        });
        CustomerService.updateCustomer(newValue).then(serverValue => {
            setCustomersInQueue(previous => {
                const newQueues = {...previous};
                newQueues[serverValue.queue_id].map(q =>
                    q.id === serverValue.id ? serverValue : q
                );
                return newQueues;
            });
        });
    };

    const updateCustomersInQueue = (newValue: {
        [id: number]: Customer[]
    }) => {
        Object.entries(newValue).forEach(([queue_id, customers]) => {
            customers.forEach((customer, index) => {
                customer.position = index;
                customer.queue_id = +queue_id;
                CustomerService.updateCustomer(customer);
            });
        });
        setCustomersInQueue(newValue);
    };

    const updateOrganisation = (name: string) => {
        setOrganisation({id: organisation.id, name: name});
        OrganisationService.updateOrganisation({id: organisation.id, name: name});
    };

    const deleteCustomer = (customer: Customer) => {
        setCustomersInQueue(previous => {
            const newValue = {...previous};
            newValue[customer.queue_id] = newValue[customer.queue_id].filter(c => c.id !== customer.id);
            return newValue;
        });
        CustomerService.deleteCustomer(customer.id);
    };

    const updateQueue = (queue: Queue) => {
        setQueues(previous => {
            const newQueues = [...previous];
            const index = newQueues.findIndex(q => q.id === queue.id);
            newQueues[index] = queue;
            return newQueues;
        });
        QueueService.updateQueue(queue); // TODO: Handle error
    };


    const fetchQueue = (queue_id: number) => {
        return QueueService.fetchQueue(queue_id);
    }

    return {
        queues,
        customersInQueue,
        createQueue,
        updateQueue,
        deleteQueue,
        updateCustomersInQueue,
        sendUpdate,
        organisation,
        updateOrganisation,
        deleteCustomer,
        updateCustomer,

    }
};

// @ts-ignore default state should never be used and is initialized empty
export const StoreContext = createContext<StoreType>({});

interface StoreProviderProps {
    children: ReactNode;
}

export const StoreProvider = ({children}: StoreProviderProps) => {
    const store = useStore();

    return (
        <StoreContext.Provider value={store}>
            {children}
        </StoreContext.Provider>
    );

}