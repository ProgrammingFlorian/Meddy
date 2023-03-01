import {Navbar} from "@mantine/core";
import {SidebarTextField} from "./SidebarTextField";
import {IconDeviceDesktop, IconLogout, IconSubtask} from "@tabler/icons-react";
import React, {useContext} from "react";
import {StoreContext} from "../../../lib/store";
import {SidebarConfirm} from "./SidebarConfirm";
import {useSupabaseClient} from "@supabase/auth-helpers-react";
import SidebarButton from "./SidebarButton";
import {useTranslation} from "next-i18next";

interface SidebarComponentProps {
    openQueueManagement: () => void;
}

const SidebarComponent = (props: SidebarComponentProps) => {
    const {t} = useTranslation();

    const {organisation, updateOrganisation} = useContext(StoreContext);
    const supabaseClient = useSupabaseClient();

    const signOut = () => {
        supabaseClient.auth.signOut();
    };

    // wait for organisation to initialise, otherwise default text is set to zero
    return organisation.name ? (
        <Navbar width={{base: 300}} p="xs">
            <Navbar.Section grow mt="xs">
                <SidebarTextField initialText={organisation.name} label={t('sidebar.changeOrganisationName')}
                                  editLabel={t('sidebar.organisationName')}
                                  onConfirm={(newValue) => updateOrganisation(newValue)} icon={<IconDeviceDesktop/>}
                                  iconColor="violet"/>
                {/* TODO: Integrate device name editor
                    <SidebarConfirm initialText="" label="Gerätenamen ändern" editLabel="Gerätename"
                                   onConfirm={() => {
                                   }} icon={<IconDeviceMobile/>} iconColor="teal"/>
                */}
                {/* TODO: Integrate languages
                <SidebarTextField initialText="" label="Sprache ändern" editLabel="Sprache"
                                  onConfirm={() => {
                                  }} icon={<IconFlag/>} iconColor="yellow"/>
                */}
                <SidebarButton icon={<IconSubtask/>} iconColor="yellow" label={t('sidebar.manageQueues')}
                               onClick={props.openQueueManagement}/>
                <SidebarConfirm initialText="" label={t('logout')} confirmLabel={t('logout')}
                                onConfirm={() => signOut()} icon={<IconLogout/>} iconColor="red"/>
            </Navbar.Section>
        </Navbar>
    ) : (<></>);
};

export default SidebarComponent;