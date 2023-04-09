import React from "react";
import {QRCodeSVG} from "qrcode.react";
import {Modal, useMantineTheme} from "@mantine/core";
import {Customer} from "../../models/Customer";
import {useTranslation} from "next-i18next";
import {ROUTE_WAIT} from "../../helpers/Routes";

interface QRCodePopupProps {
    visible: boolean;
    customer: Customer;
    onClose: () => void;
}

const QRCodePopup = (props: QRCodePopupProps) => {
    const {t} = useTranslation();

    return (
        <>
            <Modal
                opened={props.visible}
                onClose={props.onClose}
                size="lg"
            >
                <div className="flex flex-col items-center justify-center py-2" style={{minHeight: 750}}>
                    <div className='p-10 justify-center flex-1'>
                        <div className="text-center">
                            <br/>
                            <h1 className="font-bold text-blue-800">
                                {t("qrCode.greeting", {name: props.customer.name})}
                            </h1>
                            <br/>
                            <br/>
                        </div>
                        <div className='justify-center flex'>
                            <QRCodeSVG className='' value={ROUTE_WAIT(props.customer.id)} width={256} height={256}/>
                        </div>
                        <br/>
                        <br/>
                        <div className="font-bold text-center text-blue-800" style={{fontSize: 25}}>
                            {t("qrCode.scan")}
                        </div>
                    </div>
                </div>
            </Modal>
        </>
    );
};

export default QRCodePopup;