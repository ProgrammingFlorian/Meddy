import React, {useEffect, useState} from 'react';
import Dashboard from "./dashboard";
import SideBarComponent from "../components/SideBarComponent";
import {MenuSVG} from "../models/SVGIcons";
import {Language} from "../models/Language";
import {useSupabaseClient, useUser} from "@supabase/auth-helpers-react";
import {AuthPage} from "../components/AuthPage";


const Overview = () => {
    const [nameOfClient, setNameOfClient] = useState("TUM Praxis");
    const [nameOfComputer, setNameOfComputer] = useState("Verwaltungsrechner");
    const [language, setLanguage] = useState(Language.GERMAN);

    const employees = ["Arzt 1", "Arzt 2", "Arzt 3"]


    const [sidebarOpen, setSidebarOpen] = useState(false);

    const supabaseClient = useSupabaseClient();
    const user = useUser();

    useEffect(() => {
        if(user) {
            user.id
        }
    });

    return (
        <AuthPage user={user} supabaseClient={supabaseClient}>
            <div className="flex overflow-x-hidden h-screen">
                {/*Sidebar*/}
                <aside
                    className={`flex-shrink-0 w-64 flex flex-col border-r transition-all duration-300 ${!sidebarOpen ? '-ml-64' : ''}`}>
                    <SideBarComponent
                        nameOfClient={nameOfClient}
                        setNameOfClient={setNameOfClient}
                        nameOfComputer={nameOfComputer}
                        setNameOfComputer={setNameOfComputer}
                        language={Language.GERMAN}
                        setLanguage={setLanguage}/>
                </aside>

                {/*Dashboard*/}
                <div className="flex-1">
                    <header className="flex items-center p-2 text-semibold text-gray-100 bg-blue">
                        <button className="p-1 mr-4" onClick={() => setSidebarOpen(!sidebarOpen)}>
                            {MenuSVG()}
                        </button>
                    </header>
                    <main className="p-4">
                        <Dashboard nameOfClient={nameOfClient}
                                   nameOfComputer={nameOfComputer}
                                   language={language}/>
                    </main>
                </div>
            </div>
        </AuthPage>
    );
};

export default Overview
