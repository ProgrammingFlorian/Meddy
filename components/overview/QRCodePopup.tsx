import React from "react";
import {QRCodeSVG} from "qrcode.react";
import {Group, Modal, PinInput, Text} from "@mantine/core";
import {Customer} from "../../models/Customer";
import {useTranslation} from "next-i18next";
import {ROUTE_WAIT} from "../../helpers/Routes";
import {router} from "next/client";

interface QRCodePopupProps {
    visible: boolean;
    customer: Customer;
    onClose: () => void;
}

const QRCodePopup = (props: QRCodePopupProps) => {
    const {t} = useTranslation();


    const generatePinFromUUID = (uuid: string): string => {
        // Remove any hyphens from the UUID
        const uuidWithoutHyphens = uuid.replace(/-/g, '');

        // Take the first 6 characters of the UUID
        const pinSubstring = uuidWithoutHyphens.substring(0, 6);

        // Convert the hexadecimal substring to a decimal number
        const pinDecimal = parseInt(pinSubstring, 16);

        // Take the last 6 digits of the decimal number and pad with zeros if necessary
        const pin = String(pinDecimal % 1000000).padStart(6, '0');

        return pin;
    }


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
                            <Text className="font-bold" size={35} color={"blue"}>
                                {t("qrCode.greeting", {name: props.customer.name})}
                            </Text>
                            <br/>
                            <br/>
                        </div>
                        <div className='justify-center flex'>
                            <QRCodeSVG className='' value={ROUTE_WAIT(props.customer.id)} width={256} height={256}/>
                        </div>
                        <br/>
                        <Text size={50} align={"center"} style={{letterSpacing: 10}} weight={800}>{generatePinFromUUID(props.customer.id)}</Text>
                        <br/>
                        <Text className="font-bold text-center text-blue-800" size={25}>
                            {t("qrCode.scan")}
                        </Text>
                    </div>
                </div>
            </Modal>
        </>
    );
};

export default QRCodePopup;