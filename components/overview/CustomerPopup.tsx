import React, {useContext, useMemo, useState} from 'react';
import {Button, Flex, Group, Modal, NumberInput, Select, Textarea, TextInput} from '@mantine/core';
import {Customer} from "../../models/Customer";
import QRCodePopup from "./QRCodePopup";
import {Queue} from "../../models/Queue";
import {useTranslation} from "next-i18next";
import ConfirmButton from "../ConfirmButton";
import {StoreContext} from "../../lib/Store";

interface CustomerPopupProps {
    customer: Customer;
    queues: Queue[];
    updateCustomer: (customer: Customer) => void;
    onClose: () => void;
    appointmentStart: Date | null
}

const CustomerPopup = (props: CustomerPopupProps) => {
    const {t} = useTranslation();

    const initialName = props.customer.name;
    const [name, setName] = useState(initialName)
    const initialQueue = props.queues.find(queue => props.customer.queue_id === queue.id)?.name ?? null;
    const [queue, setQueue] = useState(initialQueue);
    const initialNotes = props.customer.notes ?? '';
    const [notes, setNotes] = useState(initialNotes);
    const initialDuration = props.customer.duration;
    const [durationOfAppointment, setDurationOfAppointment] = useState(initialDuration)
    const {deleteCustomer, } = useContext(StoreContext);

    const [qrCodeShown, showQRCode] = useState(false);

    const propertiesChanged = useMemo(() => {
        return name !== initialName || queue !== initialQueue || notes !== initialNotes || durationOfAppointment !== initialDuration
    }, [name, queue, notes, durationOfAppointment]);

    const saveChanges = () => {
        props.updateCustomer({
            ...props.customer,
            name: name,
            duration: durationOfAppointment,
            notes: notes,
            queue_id: props.queues.find(q => q.name === queue)?.id ?? props.customer.id
        });
        props.onClose();
    };

    return (
        <>
            <Modal opened={true} onClose={props.onClose} size="lg" title={t('customer.editTitle')}>
                <Flex direction="column" justify="flex-start" gap="xl" p="xl">
                    {/* TODO: Find out how to override classes from mantine */}
                    <TextInput className="text-center font-blue" variant="unstyled"
                               placeholder={`${t('customer.name')}`}
                               defaultValue={name}
                               onChange={(e) => setName(e.target.value)} size="xl"
                               sx={{color: 'blue'}}/>

                    { props.customer.position == 0 ? <div style={{fontSize: 16, fontWeight: "bold"}}>{t('remainingAppointmentDuration')}:TODO{t('multipleMinutes')}</div> : <></> }

                    <Flex justify="center" gap="md">
                        <ConfirmButton disabled={props.appointmentStart != null || props.customer.position != 0} fullWidth label={t('call')}  onClick={() => { //todo should work but doesn't
                            props.onClose();
                        }} color="green" />
                        <ConfirmButton fullWidth label={t('checkout')} onClick={() => {
                            props.onClose();
                            deleteCustomer(props.customer);
                        }} color="red"/>
                    </Flex>


                    <Flex direction="column" gap="xs">
                        <Group grow>
                            <NumberInput label={t('customer.appointmentDuration')} value={durationOfAppointment}
                                         parser={value => value?.replace(/\D/g, '') ?? '0'}
                                         formatter={value => !Number.isNaN(parseInt(value ?? '')) ?
                                             `${value} ${t('multipleMinutes')}` : `0 ${t('multipleMinutes')}`}
                                         step={5} min={5}
                                         onChange={(value: number) => setDurationOfAppointment(value)}/>
                        </Group>
                        <Flex gap="xs">
                            {[-5, 5, 10].map(time => (
                                <Button key={time} fullWidth color="gray"
                                        onClick={() => setDurationOfAppointment(durationOfAppointment + time)}>
                                    {time > 0 ? '+' : ''}{time} {t('minutesAbbreviation')}
                                </Button>
                            ))}
                        </Flex>
                    </Flex>
                    <Select
                        data={props.queues.map(queue => queue.name)}
                        defaultValue={queue}
                        label={t('waitingScreen.queue')}
                        onChange={setQueue}
                    />
                    <Textarea
                        label={t('customer.notes')}
                        defaultValue={notes}
                        onChange={event => {
                            setNotes(event.target.value)
                        }}
                        placeholder={`${t('customer.notesPlaceholder')}`}
                        minRows={3}
                        maxRows={10}
                        autosize
                    />
                    <Flex gap="xs">
                        <Button fullWidth disabled={!propertiesChanged} onClick={saveChanges}>
                            {t('saveChanges')}
                        </Button>
                        <Button fullWidth
                                onClick={() => showQRCode(true)}>
                            {t('customer.showQRCode')}
                        </Button>
                    </Flex>
                </Flex>
            </Modal>
            <QRCodePopup visible={qrCodeShown} onClose={() => showQRCode(false)} customer={props.customer}/>
        </>
    );
};

export default CustomerPopup;