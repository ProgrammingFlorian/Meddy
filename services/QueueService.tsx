import {PostgrestResponse} from "@supabase/supabase-js";
import {supabase} from "../lib/store";
import {Queue} from "../models/Queue";
import {TABLE_ACCOUNT_TO_ORGANISATION} from "./AccountService";


const TABLE_QUEUES = 'queues';

export const fetchQueues = async (setData: (data: Queue[]) => void, user_id: string) => {
    try {
        // @ts-ignore
        const data: PostgrestResponse<{organisations: {queues: [Queue]}}> = await supabase.from(TABLE_ACCOUNT_TO_ORGANISATION).select('organisations ( queues (*) )').eq("account_id", user_id);
        if (data.data !== null) {
            const result = data.data[0].organisations.queues;
            setData(result);
            return Promise.resolve();
        }
    } catch (error) {
        console.error('Error retrieving waiting_queues from database', error);
    }
    return Promise.reject();
}


//todo
export const saveQueue = async (setData: (data: Queue[]) => void, organisation_id: number) => {
    try {
        const data: PostgrestResponse<Queue> = await supabase.from(TABLE_QUEUES).select('*').eq("organisation_id", organisation_id);
        if (data.data !== null) {
            const result = [...data.data];
            result.sort((a, b) => a.name.localeCompare(b.name));
            setData(result);
        }
    } catch (error) {
        console.error('Error retrieving waiting_queues from database', error);
    }
}

