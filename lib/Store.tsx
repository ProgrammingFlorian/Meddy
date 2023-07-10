import {createContext, ReactNode, useEffect, useState} from 'react'
import {createClient} from '@supabase/supabase-js'
import {Customer} from '../models/Customer'
import {Queue} from "../models/Queue";
import QueueService from "../services/QueueService";
import CustomerService from "../services/CustomerService";
import {Organisation} from "../models/Organisation";
import OrganisationService from "../services/OrganisationService";
import {useAuth} from "./Auth";
import {Feedback} from "../models/Feedback";
import FeedbackService from "../services/FeedbackService";

export const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '');

const BROADCAST_EVENT = 'waiting_queue_updated';
const CHANNEL_NAME = 'waiting_updates';

interface StoreType {
    sendUpdate: (queue_id: number) => void;
    queues: Queue[];
    createQueue: (name: string) => void;
    updateQueue: (queue: Queue) => void;
    deleteQueue: (queue_id: number) => Promise<void>;
    createCustomer: (customer: Customer) => Promise<Customer>;
    updateCustomersInQueue: (newValue: { [p: number]: Customer[] }) => void,
    customersInQueue: { [queue: number]: Customer[] };
    organisation: Organisation;
    updateOrganisation: (name: string) => void;
    updateCustomer: (customer: Customer) => Promise<void>;
    deleteCustomer: (customer: Customer) => void;
    feedback: Feedback[];
    updateFeedback: (feedback_id: number, content: string) => Promise<void>;
    addFeedback: (content: string) => Promise<void>;
    deleteFeedback: (feedback_id: number) => Promise<void>;
}

export const useStore = (): StoreType => {
    const [customersInQueue, setCustomersInQueue] = useState([] as {
        [id: number]: Customer[]
    });
    const [queues, setQueues] = useState([] as Queue[]);
    const [organisation, setOrganisation] = useState({id: -1, name: ''} as Organisation); // TODO null
    const [feedback, setFeedback] = useState([] as Feedback[])
    // Before receiving the actual database values (id!) of new elements, add them to instantly show them and then later
    // replace their data with the database values. Use this counter as a preview to keep track of which one needs to
    // be replaced. Count downwards to ensure no actual ids are accidentally used
    let local_preview_counter = -1;

    const auth = useAuth();
    const account = auth.user;

    useEffect(() => {
        // Fetch current state of customers
        fetchData();
        // Listen to state changes of customers
        supabase.channel(CHANNEL_NAME, {
            config: {
                broadcast: {
                    self: true,
                },
            },
        }).on('broadcast', {event: BROADCAST_EVENT}, () => {
            console.log("Refreshing data..");
            fetchData();
        }).subscribe();
    }, [account]);

    const sendUpdate = () => {
        const channel = supabase.channel(CHANNEL_NAME, {
            config: {
                broadcast: {
                    self: true
                },
            },
        }).subscribe();
        channel.send({
            type: 'broadcast',
            event: BROADCAST_EVENT,
            payload: {}
        });
    };

    const fetchData = () => {
        if (account) {

            CustomerService.fetchCustomersFromAccountOrganisationGroupedByQueue(account.id).then(data => {
                const result: {
                    [id: number]: Customer[]
                } = [];
                data.organisations.queues.forEach(val => {

                    result[val.id] = val.customers.sort((a, b) => {
                        return a.position - b.position
                    });
                });
                setOrganisation({id: data.organisation_id, name: data.organisations.name});
                setCustomersInQueue(result);
            });
            QueueService.fetchQueues(account.id).then(setQueues);
            FeedbackService.fetchFeedback(account.id).then(data => setFeedback(data));
        }

    }

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
            setCustomersInQueue(previous => {
                const newCustomersInQueue = {...previous};
                newCustomersInQueue[value.id] = [];
                return newCustomersInQueue;
            })
        });
    }

    const deleteQueue = (queue_id: number): Promise<void> => {
        return QueueService.deleteQueue(queue_id).then(() => {
            setQueues(previous => previous.filter(queue => queue.id !== queue_id));
            return Promise.resolve();
        });
    }

    // TODO: Resolve before waiting for server
    const createCustomer = (newCustomer: Customer): Promise<Customer> => {
        const temporaryId = String(local_preview_counter--);
        setCustomersInQueue(previous => {
            const newQueues = {...previous};
            newQueues[newCustomer.queue_id].push({
                id: temporaryId,
                name: newCustomer.name,
                queue_id: newCustomer.queue_id,
                notes: newCustomer.notes,
                duration: newCustomer.duration,
                position: newCustomer.position
            });
            return newQueues;
        });
        return CustomerService.saveCustomer(newCustomer).then(serverValue => {
            setCustomersInQueue(previous => {
                const newQueues = {...previous};
                newQueues[serverValue.queue_id] = newQueues[serverValue.queue_id].map(c =>
                    c.id === temporaryId ? serverValue : c
                );
                return newQueues;
            });
            sendUpdate();
            return Promise.resolve(serverValue);
        }).catch(() => {
            return Promise.reject();
        });
    }

    const updateCustomer = (newValue: Customer) => {
        setCustomersInQueue(previous => {
            const newQueues = {...previous};
            newQueues[newValue.queue_id] = newQueues[newValue.queue_id].map(q =>
                q.id === newValue.id ? newValue : q
            );
            return newQueues;
        });
        return CustomerService.updateCustomer(newValue).then(serverValue => {
            setCustomersInQueue(previous => {
                const newQueues = {...previous};
                newQueues[serverValue.queue_id].map(q =>
                    q.id === serverValue.id ? serverValue : q
                );
                return newQueues;
            });
            sendUpdate();
            return Promise.resolve();
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
        sendUpdate();
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
        CustomerService.deleteCustomer(customer.id).then(() => {
            sendUpdate();
        });
    };

    const updateQueue = (queue: Queue) => {
        setQueues(previous => {
            const newQueues = [...previous];
            const index = newQueues.findIndex(q => q.id === queue.id);
            newQueues[index] = queue;
            return newQueues;
        });
        QueueService.updateQueue(queue).then(() => { // TODO: Handle error
            sendUpdate();
        });
    };


    const fetchQueue = (queue_id: number) => {
        return QueueService.fetchQueue(queue_id);
    }

    const updateFeedback = async (feedback_id: number, content: string): Promise<void> => {
        if (account) {
            await FeedbackService.updateFeedback(feedback_id, content);
            return FeedbackService.fetchFeedback(account.id).then(data => setFeedback(data));
        }

    }

    const addFeedback = async (content: string): Promise<void> => {
        if (account) {
            await FeedbackService.addFeedback(content, account.id);
            return FeedbackService.fetchFeedback(account.id).then(data => setFeedback(data));
        }
    }

    const deleteFeedback = async (feedback_id: number): Promise<void> => {
        const feedbackCopy = feedback.filter(f => f.id !== feedback_id);
        setFeedback(feedbackCopy);
        await FeedbackService.deleteFeedback(feedback_id)
        return Promise.resolve();
    }

    return {
        queues,
        customersInQueue,
        createQueue,
        updateQueue,
        deleteQueue,
        createCustomer,
        updateCustomersInQueue,
        sendUpdate,
        organisation,
        updateOrganisation,
        deleteCustomer,
        updateCustomer,
        feedback,
        updateFeedback,
        addFeedback,
        deleteFeedback

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