import {Modal, Navbar, ScrollArea} from "@mantine/core";
import {SidebarTextField} from "./SidebarTextField";
import {IconDeviceDesktop, IconLock, IconLogout, IconQrcode, IconStar, IconSubtask} from "@tabler/icons-react";
import React, {useContext, useState} from "react";
import {StoreContext} from "../../../lib/Store";
import {SidebarConfirm} from "./SidebarConfirm";
import SidebarButton from "./SidebarButton";
import {useTranslation} from "next-i18next";
import {useAuth} from "../../../lib/Auth";
import {useRouter} from "next/router";
import {ROUTE_CHANGE_PASSWORD} from "../../../helpers/Routes";
import generatePDF from "../generatePDF";
import FeedbackModal from "../FeedbackModal";

interface SidebarComponentProps {
    openQueueManagement: () => void;
}

const SidebarComponent = (props: SidebarComponentProps) => {
    const {t} = useTranslation();
    const [feedbackOpen, setFeedbackOpen] = useState(false);
    const router = useRouter();

    const {organisation, updateOrganisation} = useContext(StoreContext);
    const { signOut } = useAuth();

    const changePassword = () => {
        router.push(ROUTE_CHANGE_PASSWORD);
    }



    // wait for organisation to initialise, otherwise default text is set to zero
    return organisation.name ? (
        <Navbar width={{base: 300}} p="xs">
            <FeedbackModal feedbackOpen={feedbackOpen} setFeedbackOpen={setFeedbackOpen}/>
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
                <SidebarButton icon={<IconLock/>} iconColor="orange" label={t('sidebar.changePassword')}
                               onClick={changePassword}/>
                <SidebarButton icon={<IconQrcode/>} iconColor="blue" label={t('sidebar.downloadQRCode')}
                               onClick={async () => {
                                   const pdfBlob = await generatePDF({
                                       praxisName: '/images/Meddy.png',
                                       text1: '1. Scannen Sie den QR-Code',
                                       text2: '2. Geben Sie den sechsstelligen PIN-Code ein, um Ihre voraussichtliche Wartezeit anzuzeigen.',
                                       imagePath: '/images/MeddyInputQRCode.png'
                                   });
                                   const blobURL = URL.createObjectURL(pdfBlob);

                                   // create temporary link element
                                   let tempLink = document.createElement('a');
                                   tempLink.href = blobURL;
                                   tempLink.download = 'Meddy_QR-Code.pdf'; // or whatever file name you want
                                   tempLink.style.display = 'none';

                                   // append link element to body
                                   document.body.appendChild(tempLink);

                                   // programmatically click the link to start the download
                                   tempLink.click();

                                   // cleanup: remove the link after triggering the download
                                   document.body.removeChild(tempLink);
                               }}/>
                <SidebarButton icon={<IconStar/>} iconColor="green" label={t('sidebar.feedback')}
                               onClick={() => setFeedbackOpen(!feedbackOpen)}/>
                <SidebarConfirm initialText="" label={t('logout')} confirmLabel={t('logout')}
                                onConfirm={signOut} icon={<IconLogout/>} iconColor="red"/>
            </Navbar.Section>
        </Navbar>
    ) : (<></>);
};

export default SidebarComponent;