import {createContext, useCallback, useEffect, useMemo, useState} from 'react'
import {createClient} from '@supabase/supabase-js'
import {Customer} from '../models/Customer'
import {RealtimeChannel} from "@supabase/realtime-js";
import {Queue} from "../models/Queue";
import {useSupabaseClient, useUser} from "@supabase/auth-helpers-react";
import QueueService from "../services/QueueService";
import CustomerService from "../services/CustomerService";
import {number} from "prop-types";

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
    customersInQueue: { [queue: number]: Customer[] };
}

export const useStore = (): StoreType => {
    const [customersInQueue, setCustomersInQueue] = useState([] as {
        [id: number]: Customer[]
    });
    const [queues, setQueues] = useState([] as Queue[]);
    const [organisationId, setOrganisationId] = useState(-1); // TODO null

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

                setOrganisationId(data.organisation_id);
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
                organisation_id: organisationId,
                latest_appointment_start: null //TODO!
            });
            return newQueues;
        });
        QueueService.createQueue(name, organisationId).then(value => {
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

    return {queues, customersInQueue, createQueue, deleteQueue, sendUpdate}
};

export const StoreContext = createContext<StoreType>({
    createQueue: () => {
    }, customersInQueue: [],
    deleteQueue: () => {
    }, queues: [],//{id: 0, name: "test", latest_appointment_start: null, organisation_id: 0}],
    sendUpdate: () => {
    }
});
