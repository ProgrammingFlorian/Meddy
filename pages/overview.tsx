import React, {useState} from 'react';
import Dashboard from "../components/overview/Dashboard";
import {useSupabaseClient, useUser} from "@supabase/auth-helpers-react";
import {AuthPage} from "../components/AuthPage";
import {StoreContext, useStore} from "../lib/store";
import {AppShell} from "@mantine/core";
import SidebarComponent from "../components/overview/sidebar/SidebarComponent";
import HeaderComponent from "../components/overview/sidebar/HeaderComponent";
import {QueueManagement} from "../components/QueueManagement";
import {serverSideTranslations} from "next-i18next/serverSideTranslations";


const Overview = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [openedQueueManagement, setOpenedQueueManagement] = useState(false);

    const supabaseClient = useSupabaseClient();
    const user = useUser();

    const store = useStore();

    return (
        <AuthPage user={user} supabaseClient={supabaseClient}>
            <StoreContext.Provider value={store}>
                <AppShell
                    padding="md"
                    fixed={false}
                    navbar={sidebarOpen ?
                        <SidebarComponent openQueueManagement={() => setOpenedQueueManagement(true)}/> : <></>}
                    header={<HeaderComponent toggleSidebarOpen={() => setSidebarOpen(!sidebarOpen)}/>}
                >
                    <Dashboard/>
                </AppShell>
                {/* @ts-ignore if user is null AuthPage doesn't render this */}
                <QueueManagement user={user} isOpen={openedQueueManagement}
                                 onClose={() => setOpenedQueueManagement(false)}
                />
            </StoreContext.Provider>
        </AuthPage>
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

export default Overview;
