import React from "react";
import {QRCodeSVG} from "qrcode.react";
import {Modal, useMantineTheme} from "@mantine/core";
import {Customer} from "../models/Customer";

interface QRCodePopupProps {
    visible: boolean;
    customer: Customer;
    onClose: () => void;
}

const QRCodePopup = (props: QRCodePopupProps) => {
    const theme = useMantineTheme();

    const greetingText = `Herzlichen Willkommen in der TUM Praxis, ${props.customer.name}!`;
    const url = `http://localhost:3000/wait?id=${props.customer.id}`;

    return (
        <>
            <Modal
                opened={props.visible}
                onClose={props.onClose}
                overlayColor={theme.colorScheme === 'dark' ? theme.colors.dark[9] : theme.colors.gray[2]}
                overlayOpacity={0.55}
                overlayBlur={3}
                size={"lg"}
            >

                <div className="min-h-screen flex flex-col items-center justify-center py-2">
                    <div className='p-10 justify-center flex-1'>
                        <div className="text-center">
                            <br/>
                            <h1 className="font-bold text-blue-800">{greetingText}</h1>
                            <br/>
                            <br/>
                        </div>
                        <div className='justify-center flex'>
                            <QRCodeSVG className='' value={url} width={256} height={256}/>
                        </div>
                        <br/>
                        <br/>
                        <div className="font-bold text-center text-blue-800" style={{fontSize: 25}}>
                            Scannen Sie den QR-Code um über Ihre Wartezeit informiert zu bleiben
                        </div>
                    </div>
                </div>
            </Modal>
        </>
    );
};

export default QRCodePopup;