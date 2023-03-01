import React, {useState} from 'react';
import Dashboard from "../components/overview/Dashboard";
import SideBarComponent from "../components/SideBarComponent";
import {MenuSVG} from "../models/SVGIcons";
import {Language} from "../models/Language";
import {useSupabaseClient, useUser} from "@supabase/auth-helpers-react";
import {AuthPage} from "../components/AuthPage";
import {StoreContext, useStore} from "../lib/store";


const Overview = () => {
    const [nameOfClient, setNameOfClient] = useState("TUM Praxis");
    const [nameOfComputer, setNameOfComputer] = useState("Verwaltungsrechner");
    const [language, setLanguage] = useState(Language.GERMAN);

    const [sidebarOpen, setSidebarOpen] = useState(false);

    const supabaseClient = useSupabaseClient();
    const user = useUser();

    const store = useStore();

    return (
        <AuthPage user={user} supabaseClient={supabaseClient}>
            <StoreContext.Provider value={store}>
                <div className="flex overflow-x-hidden h-screen">
                    {/*Sidebar*/}
                    <aside
                        className={`flex-shrink-0 w-64 flex flex-col border-r transition-all duration-300 ${!sidebarOpen ? '-ml-64' : ''}`}>
                        <SideBarComponent
                            // @ts-ignore AuthPage doesn't render this if user is null
                            user={user}
                        />
                    </aside>

                    {/*Dashboard*/}
                    <div className="flex-1">
                        <header className="flex items-center p-2 text-semibold text-gray-100 bg-blue">
                            <button className="p-1 mr-4" onClick={() => setSidebarOpen(!sidebarOpen)}>
                                {MenuSVG()}
                            </button>
                        </header>
                        <main className="p-4">
                            <Dashboard/>
                        </main>
                    </div>
                </div>
            </StoreContext.Provider>
        </AuthPage>
    );
};

export default Overview
