import React, {useContext, useEffect, useMemo, useState} from 'react';
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
    const {deleteCustomer, updateQueue, customersInQueue} = useContext(StoreContext);
    const [remainingTime, setRemainingTime] = useState(0)
    const [qrCodeShown, showQRCode] = useState(false);
    const customerQueue = props.queues.find(q => q.id === props.customer.queue_id);

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

    const calculateWaitingTime = () => {
        return customersInQueue[props.customer.queue_id].filter(oc => oc.id !== customerQueue?.active_customer && oc.position < props.customer.position)
            .reduce((previous, currentCustomer) => previous + currentCustomer.duration, 0)
    }

    const updateRemainingTime = () => {
        const activeCustomer = customersInQueue[props.customer.queue_id].find(c => c.id === customerQueue?.active_customer);
        //appointment duration - (time of appointment start in milliseconds - current time in milliseconds)/(60000) -> 60000 milliseconds = 1 min
        const remainingTime = Math.round((activeCustomer?.duration ?? 0) +
            (new Date(customerQueue?.latest_appointment_start ?? new Date()).getTime() - new Date().getTime()) / (1000 * 60));
        setRemainingTime(remainingTime + calculateWaitingTime());
    }

    useEffect(() => {
        const intervalId = setInterval(() => {
            updateRemainingTime();
        }, 10000);
        updateRemainingTime()
        return () => {
            clearInterval(intervalId);
        };
    }, [props.appointmentStart, remainingTime, props.updateCustomer])

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

                    <div style={{fontSize: 16, fontWeight: "bold"}}>{props.customer.id === customerQueue?.active_customer ? t('remainingAppointmentDuration') : t('remainingWaitingTime')} {remainingTime} {t('multipleMinutes')}</div>

                    <Flex justify="center" gap="md">
                        {
                            props.queues.find(q => q.id === props.customer.queue_id)?.active_customer === props.customer.id || props.customer.position != 0 ?
                                <></> : <ConfirmButton fullWidth label={t('call')}  onClick={() => {
                                    const newQueue = {...props.queues.find(q => q.id === props.customer.queue_id)};
                                    if (newQueue.id !== undefined) {
                                        newQueue.active_customer = props.customer.id;
                                        newQueue.latest_appointment_start = new Date();
                                        // @ts-ignore
                                        updateQueue(newQueue);
                                    }
                                    props.onClose();
                                }} color="green" />
                        }

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