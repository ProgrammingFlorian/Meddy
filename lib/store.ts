import {createContext, useCallback, useEffect, useMemo, useState} from 'react'
import {createClient} from '@supabase/supabase-js'
import {Customer} from '../models/Customer'
import {RealtimeChannel} from "@supabase/realtime-js";
import {Queue} from "../models/Queue";
import {useSupabaseClient, useUser} from "@supabase/auth-helpers-react";
import QueueService from "../services/QueueService";
import CustomerService from "../services/CustomerService";
import {number} from "prop-types";
import {Organisation} from "../models/Organisation";
import OrganisationService from "../services/OrganisationService";
import {name} from "next/dist/telemetry/ci-info";

export const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '');

const BROADCAST_CHANNEL = 'waiting_queue_updated';
const CHANNEL_NAME = 'waiting_updates';

interface StoreType {
    sendUpdate: (queue_id: number) => void;
    queues: Queue[];
    createQueue: (name: string) => void;
    deleteQueue: (queue_id: number) => void;
    updateCustomersInQueue: (newValue: { [p: number]: Customer[] }) => void,
    customersInQueue: { [queue: number]: Customer[] };
    organisation: Organisation;
    updateOrganisation: (name: string) => void;
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

    const account = useUser();

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
                latest_appointment_start: null //TODO!
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
    }

    const updateOrganisation = (name: string) => {
        setOrganisation({id: organisation.id, name: name});
        OrganisationService.updateOrganisation({id: organisation.id, name: name});
    }

    return {queues, customersInQueue, createQueue, deleteQueue, updateCustomersInQueue, sendUpdate, organisation, updateOrganisation}
};

export const StoreContext = createContext<StoreType>({
    createQueue: () => {
    }, customersInQueue: [],
    deleteQueue: () => {}, queues: [],
    updateCustomersInQueue: () => {},
    sendUpdate: () => {
    },
    organisation: {
        id: -1,
        name: ""
    },
    updateOrganisation: (name: string) => {},
});
