import {Customer} from "../../../models/Customer";
import {Queue} from "../../../models/Queue";
import {Button, Card, Group, Popover, Text} from "@mantine/core";
import React, {useContext, useEffect, useState} from "react";
import {useTranslation} from "next-i18next";


interface QueueCustomerActiveProps {
    activeCustomer: Customer | null;
    queue: Queue;
    appointmentStart: Date | null;
    setPopup: (customer: Customer) => void;
    deleteCustomer: (customer: Customer) => void;
    updateCustomer: (customer: Customer) => void;
}

const QueueCustomerActive = (props: QueueCustomerActiveProps) => {
    const {t} = useTranslation();
    const activeCustomer = props.activeCustomer;
    const [remainingTime, setRemainingTime] = useState(activeCustomer ? activeCustomer.duration : 0)


    const updateRemainingTime = () => {
        if (props.appointmentStart && activeCustomer) {
            //appointment duration - (time of appointment start in milliseconds - current time in milliseconds)/(60000) -> 60000 milliseconds = 1 min
            const remainingTime = Math.round(activeCustomer.duration +
                (new Date(props.appointmentStart).getTime() - new Date().getTime()) / (1000 * 60));
            setRemainingTime(remainingTime)
            console.log(remainingTime)
        }
    }

    useEffect(() => {
        const intervalId = setInterval(() => {
            updateRemainingTime();
        }, 10000);
        updateRemainingTime()
        return () => {
            clearInterval(intervalId);
        };
    }, [activeCustomer, props.appointmentStart, remainingTime, props.updateCustomer])





    return activeCustomer !== null ? (
        <Card shadow="sm" m={8}>
            <Group position="center" style={{
                width: '100%',
                height: '100%',
                margin: 0,
                padding: 0
            }}>
                <div className="text-gray-500 text-center font-bold m-2"
                     onClick={() => props.setPopup(activeCustomer)}>
                    <Text>{activeCustomer.name}</Text>
                    <Text size="sm">
                        {t('duration')}: {activeCustomer.duration} {t('minutesAbbreviation')}
                    </Text>
                    {props.appointmentStart !== null ?
                        <Text size="sm" color={remainingTime < 5 ? "red" : ""}>
                            {t('remaining')} {remainingTime} {t("minutesAbbreviation")}
                        </Text>
                        : <></>}
                    <div className="mt-2 flex justify-center"
                         onClick={(e) => e.stopPropagation()}>
                        <div className="grid grid-cols-2 gap-2">
                            <Popover trapFocus position="bottom" withArrow
                                     shadow="md">
                                <Popover.Target>
                                    <Button color="red">
                                        {t('checkout')}
                                    </Button>
                                </Popover.Target>
                                <Popover.Dropdown
                                    sx={(theme) => ({background: theme.white})}>
                                    <Button color="gray"
                                            onClick={() => props.deleteCustomer(activeCustomer)}>
                                        {t('confirm')}
                                    </Button>
                                </Popover.Dropdown>
                            </Popover>
                            <Button color="gray" onClick={() => {
                                if (props.activeCustomer && activeCustomer?.duration) {
                                    setRemainingTime(remainingTime + 5)
                                    props.updateCustomer({
                                        ...props.activeCustomer,
                                        duration: activeCustomer.duration + 5
                                    });
                                }
                            }}>
                                + 5 {t('minutesAbbreviation')}
                            </Button>
                        </div>
                    </div>
                </div>
            </Group>
        </Card>
    ) : <></>;
};

export default QueueCustomerActive;