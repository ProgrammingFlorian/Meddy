import React, {useContext, useEffect, useMemo, useState} from 'react';
import {Button, Flex, Group, Modal, NumberInput, Text, Textarea, TextInput} from '@mantine/core';
import {Customer} from "../../models/Customer";
import QRCodePopup from "./QRCodePopup";
import {Queue} from "../../models/Queue";
import {useTranslation} from "next-i18next";
import ConfirmButton from "../ConfirmButton";
import {StoreContext} from "../../lib/Store";
import {getTimeLeftFunction} from "../../helpers/Functions";

interface CustomerPopupProps {
    customer: Customer;
    queues: Queue[];
    onClose: () => void;
    appointmentStart: Date | null;
    updateCustomer: (customer: Customer) => Promise<void>;
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

    const [remainingTime, setRemainingTime] = useState(0);
    const [isOvertime, setIsOvertime] = useState(false);

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
            queue_id: props.queues.find(q => q.name === queue)?.id ?? props.customer.queue_id
        });
        props.onClose();
    };

    useEffect(() => {
        if (customerQueue) {
            const timeLeft = getTimeLeftFunction(customerQueue.latest_appointment_start, customersInQueue[customerQueue.id], customerQueue, props.customer, setRemainingTime, setIsOvertime);

            const intervalId = setInterval(timeLeft, 10000);
            timeLeft();

            return () => {
                clearInterval(intervalId);
            };
        }
    }, [customerQueue, customersInQueue, props.customer]);

    // TODO: use form
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

                    <Flex direction="column">
                        <Text weight={600}>{t('customer.currentQueue', {queue: queue})}</Text>
                        {/*Use Text and proper language*/}
                        <div style={{
                            fontSize: 16,
                            fontWeight: "bold"
                        }}>{props.customer.id === customerQueue?.active_customer ? t('remainingAppointmentDuration') : t('remainingWaitingTime')} {remainingTime} {t('multipleMinutes')}</div>
                    </Flex>

                    <Flex justify="center" gap="xs">
                        {
                            customerQueue?.active_customer === props.customer.id || props.customer.position != 0 ?
                                <></> : <ConfirmButton fullWidth label={t('call')} onClick={() => {
                                    const newQueue = {...props.queues.find(q => q.id === props.customer.queue_id)};
                                    if (newQueue.id !== undefined) {
                                        newQueue.active_customer = props.customer.id;
                                        newQueue.latest_appointment_start = new Date();
                                        // @ts-ignore
                                        updateQueue(newQueue);
                                    }
                                    props.onClose();
                                }} color="green"/>
                        }

                        {
                            customerQueue?.active_customer === props.customer.id
                            && <ConfirmButton fullWidth label= {t("sendBackToQueue")} onClick={() => {
                                const newQueue = {...customerQueue};
                                newQueue.active_customer = null;
                                newQueue.latest_appointment_start = null;
                                updateQueue(newQueue);
                                props.onClose();
                            }}/>
                        }

                        <ConfirmButton fullWidth label={t('checkout')} onClick={() => {
                            props.onClose();
                            deleteCustomer(props.customer);
                        }} color="red"/>
                    </Flex>


                    <Flex direction="column" gap="xs">
                        <Group grow>
                            <NumberInput label={t('customer.approximateAppointmentDuration')}
                                         value={durationOfAppointment}
                                         parser={value => value?.replace(/\D/g, '') ?? '0'}
                                         step={1} min={1}
                                         onChange={(value: number) => setDurationOfAppointment(value > 0 ? value : 1)}/>
                        </Group>
                        <Flex gap="xs">
                            {[-5, 5, 10].map(time => (
                                <Button key={time} fullWidth color="gray"
                                        onClick={() => setDurationOfAppointment(durationOfAppointment + time > 0 ? durationOfAppointment + time : 1)}>
                                    {time > 0 ? '+' : ''}{time} {t('minutesAbbreviation')}
                                </Button>
                            ))}
                        </Flex>
                    </Flex>
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