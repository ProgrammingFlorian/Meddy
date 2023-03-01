import {Customer} from "../../../models/Customer";
import {Queue} from "../../../models/Queue";
import {Button, Card, Group, Popover, Text} from "@mantine/core";
import React from "react";
import {useTranslation} from "next-i18next";

interface QueueCustomerActiveProps {
    activeCustomer: Customer | null;
    queue: Queue;
    setPopup: (customer: Customer) => void;
    deleteCustomer: (customer: Customer) => void;
}

const QueueCustomerActive = (props: QueueCustomerActiveProps) => {
    const {t} = useTranslation();
    const activeCustomer = props.activeCustomer;

    return activeCustomer !== null ? (
        <Card>
            <Group position="center" style={{
                width: '100%',
                height: '100%',
                margin: 0,
                padding: 0
            }}>
                <div className="text-gray-500 font-bold m-2"
                     onClick={() => props.setPopup(activeCustomer)}>
                    <Text>{activeCustomer.name}</Text>
                    <Text size="sm">
                        {t('duration')}: {activeCustomer.duration} {t('multipleMinutes')}
                    </Text>
                    <div className="mt-2"
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