import {PostgrestResponse} from "@supabase/supabase-js";
import {supabase} from "../lib/store";
import {Queue} from "../models/Queue";
import {TABLE_ACCOUNT_TO_ORGANISATION} from "./AccountService";


const TABLE_QUEUES = 'queues';

const fetchQueues = async (account_id: string): Promise<Queue[]> => {
    try {
        // @ts-ignore
        const data: PostgrestResponse<{organisations: {queues: [Queue]}}> = await supabase.from(TABLE_ACCOUNT_TO_ORGANISATION).select('organisations ( queues (*) )').eq("account_id", account_id);
        if (data.data !== null) {
            const result = data.data[0].organisations.queues;
            return Promise.resolve(result);
        }
    } catch (error) {
        console.error('Error retrieving waiting_queues from database', error);
    }
    return Promise.reject();
}


const createQueue = async (name: string, organisation_id: number): Promise<Queue> => {
    try {
        const response: PostgrestResponse<Queue> = await supabase.from(TABLE_QUEUES).insert({
            name: name,
            organisation_id: organisation_id
        }).select();
        if (response.data !== null) {
            const result = response.data[0];
            return Promise.resolve(result);
        }
    } catch (error) {
        console.error('Error retrieving waiting_queues from database', error);
    }
    return Promise.reject();
}

const deleteQueue = async (queue_id: number) => {
    try {
        await supabase.from(TABLE_QUEUES).delete().eq("id", queue_id);
    } catch (error) {
        console.error('Error delete a queue from database', error);
    }
}

export default {
    fetchQueues,
    createQueue,
    deleteQueue
}