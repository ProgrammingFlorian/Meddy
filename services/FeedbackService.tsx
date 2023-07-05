import {Feedback} from "../models/Feedback";
import {supabase} from "../lib/Store";
import {PostgrestResponse} from "@supabase/supabase-js";


const TABLE_FEEDBACK = 'feedback';
const TABLE_ACCOUNT_INFORMATION = 'account_information';

const getOrganisationId = async (customerId: string): Promise<number> => {
    try {
        const { data: accountData, error: accountError } = await supabase
            .from(TABLE_ACCOUNT_INFORMATION)
            .select('organisation_id')
            .eq('account_id', customerId);

        if (accountError) throw accountError;
       return Promise.resolve(accountData[0]?.organisation_id);
    } catch (e) {
        console.log(e);
    }
    return Promise.reject();
}
const fetchFeedback = async (customerId: string): Promise<Feedback[]> => {
    try {

        // Fetch the organisation_id related to the given account_id
        const organisationId = await getOrganisationId(customerId);

        // Fetch the feedback related to the fetched organisation_id
        const { data: feedbackData, error: feedbackError } = await supabase
            .from(TABLE_FEEDBACK)
            .select('*')
            .eq('organisation_id', organisationId);

        if (feedbackError) throw feedbackError;

        return Promise.resolve(feedbackData as Feedback[]);

    } catch (error) {
        console.error('Error retrieving feedback from database', error);
    }
    return Promise.reject();
}




const updateFeedback = async (feedback_id: number, content: string): Promise<Feedback | null> => {
    try {
        const { data, error } = await supabase
            .from('feedback')
            .update({ content: content, date: new Date()}) // Update 'content' column
            .eq('id', feedback_id) // Where 'id' is equal to 'feedback_id'
            .single(); // Use 'single()' if you're only expecting a single result

        return data;
    } catch (error) {
        console.error('Error updating feedback from database', error);
        return null;
    }
}

const addFeedback = async (content: string, account_id: string): Promise<Feedback | null> => {
    try {
        const organisationId = await getOrganisationId(account_id);
        const { data, error } = await supabase
            .from('feedback')
            .insert([
                { date: new Date(), content: content, organisation_id: organisationId},
            ]);
        if (error) throw error;
        return Promise.resolve(data);
    } catch (error) {
        console.error('Error updating feedback from database', error);
        return null;
    }
}

const deleteFeedback = async (feedback_id: number): Promise<void> => {
    try {
        const { error } = await supabase
            .from('feedback')
            .delete()
            .eq('id', feedback_id)
        if (error) throw error;
        return Promise.resolve();
    } catch (error) {
        console.error('Error updating feedback from database', error);
        return;
    }
}


export default {
    fetchFeedback,
    updateFeedback,
    addFeedback,
    deleteFeedback,
}