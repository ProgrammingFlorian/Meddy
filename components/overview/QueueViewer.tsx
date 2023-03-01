import {Button, createStyles, Group, Popover, Text} from '@mantine/core';
import {DragDropContext, Draggable, Droppable, DropResult} from 'react-beautiful-dnd';
import {Customer, getCustomerIdAsString} from '../../models/Customer';
import {move, reorder} from "../../util/ListUtil";
import React, {useContext, useEffect, useMemo, useState} from "react";
import CustomerPopup from "./CustomerPopup";
import {StoreContext, useStore} from "../../lib/store";

const useStyles = createStyles((theme) => ({
    item: {
        ...theme.fn.focusStyles(),
        display: 'flex',
        alignItems: 'center',
        borderRadius: theme.radius.md,
        border: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[2]
        }`,
        padding: `${theme.spacing.sm}px ${theme.spacing.xl}px`,
        backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.white,
        marginBottom: theme.spacing.sm,
        minWidth: "300px"
    },

    itemDragging: {
        boxShadow: theme.shadows.sm,
    },
}));

const QueueViewer = () => {

    const {classes, cx} = useStyles();
    const {deleteCustomer} = useContext(StoreContext);

    const [popup, setPopup] = useState(null as Customer | null);

    /*const sendChangesToServer = () => {
        state.forEach((queue) => {
            queue.customers.forEach((customer, index) => {
                if (customer.position !== index || customer.queue_id !== queue.id) {
                    customer.position = index;
                    customer.queue_id = queue.id;
                    //updateCustomer(customer);
                }
            });
        });
    }*/
    const positionView = (customer: Customer) => {
        const [customerInvoked, setCustomerInvoked] = useState(false);
        const [openedPopover, setOpenedPopover] = useState(false);


        const appointmentState = () => {


            if (!customerInvoked) {
                return (
                    <Popover trapFocus position="bottom"
                             withArrow
                             shadow="md"
                             opened={openedPopover}
                    >
                        <Popover.Target>
                            <Button color="green"
                                    onClick={() => {
                                        setOpenedPopover(!openedPopover)
                                    }}>
                                Aufrufen
                            </Button>
                        </Popover.Target>
                        <Popover.Dropdown sx={(theme) => ({background: theme.white})}>
                            <Button color="gray"
                                    onClick={() => {
                                        setCustomerInvoked(true)
                                        setOpenedPopover(!openedPopover)
                                    }}>
                                Bestätigen
                            </Button>
                        </Popover.Dropdown>
                    </Popover>
                )
            } else {
                return (
                    <div className="grid grid-cols-2 gap-2">
                        <Popover trapFocus position="bottom" withArrow shadow="md" opened={openedPopover}>
                            <Popover.Target>
                                <Button color="red"
                                    onClick={() => setOpenedPopover(!openedPopover)}>
                                    Auschecken
                                </Button>
                            </Popover.Target>
                            <Popover.Dropdown sx={(theme) => ({background: theme.white})}>
                                <Button color="gray"
                                        onClick={()=> {
                                            setOpenedPopover(!openedPopover)
                                            deleteCustomer(customer.id)
                                        }}>
                                    Bestätigen
                                </Button>
                            </Popover.Dropdown>
                        </Popover>
                        <Button color="gray"
                                onClick={() => {
                                }}>
                            + 5 min
                        </Button>
                    </div>
                    )
            }
        }




        if (customer.position == 0) {
            return (
                <div>
                    {appointmentState()}
                </div>
            );
        } else {
            return (
                <div></div>
            )
        }


    }



    const {queues, customersInQueue, updateCustomersInQueue} = useContext(StoreContext);

    const onDragEnd = ({destination, source}: DropResult) => {
        // dropped outside the lists
        if (!destination) {
            return;
        }

        const sourceId = +source.droppableId;
        const destinationId = +destination.droppableId;

        if (sourceId === destinationId) {
            const items = reorder(customersInQueue[sourceId], source.index, destination.index);
            const newState = {...customersInQueue};
            newState[sourceId] = items;
            updateCustomersInQueue(newState);
        } else {
            const result = move(customersInQueue[sourceId], customersInQueue[destinationId], source, destination);
            const newState = {...customersInQueue};
            newState[sourceId] = result[sourceId];
            newState[destinationId] = result[destinationId];
            updateCustomersInQueue(newState);
        }
    };

    /*const deleteCustomer = ((queue_index: number, customer_index: number) => {
        const newState = [...state];
        newState[queue_index].customers.splice(customer_index, 1);
        setState(newState);
    });*/

    const closePopup = () => {
        setPopup(null);
    }

    return (
        <>
            {popup ?
                <CustomerPopup customer={popup} queues={queues} updateCustomer={() => {/* TODO */}} onClose={closePopup}/>
                : <></>
            }
            <div className="grid grid-cols-4 gap-5">
                <DragDropContext onDragEnd={onDragEnd}>
                    {queues.map(((queue, index) => (
                        <div key={index} className="flex flex-col bg-gray-100 rounded" style={{}}>
                            <h2 className="mt-3" style={{fontWeight: "bold", fontSize: 20}}>{queue.name}</h2>
                            {/*<main className="flex w-full flex-1 items-center justify-center px-20 text-center" style={{height: 100}}>*/}
                            <Droppable key={queue.id} droppableId={`${queue.id}`} direction="vertical">
                                {(provided) => (
                                    <div className="m-2"
                                         {...provided.droppableProps}
                                         ref={provided.innerRef}
                                         style={{minWidth: "300px"}}>
                                        {/* TODO */}
                                        {customersInQueue[queue.id] ? customersInQueue[queue.id].map((customer, index) => (
                                            <Draggable key={getCustomerIdAsString(customer)} index={index}
                                                       draggableId={getCustomerIdAsString(customer)}>
                                                {(provided, snapshot) => (
                                                    <div
                                                        className={cx(classes.item, {[classes.itemDragging]: snapshot.isDragging})}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                        ref={provided.innerRef}
                                                    >
                                                        <Group position="center" style={{
                                                            width: '100%',
                                                            height: '100%',
                                                            margin: 0,
                                                            padding: 0
                                                        }}>
                                                            <div className="text-gray-500 font-bold m-2"
                                                                 onClick={() => setPopup(customer)}>
                                                                <Text>{customer.name}</Text>
                                                                <Text size="sm">
                                                                    Dauer: {customer.duration} Minuten
                                                                </Text>
                                                                <div className="mt-2" onClick={(e) => e.stopPropagation()}>
                                                                    {positionView(customer)}
                                                                </div>

                                                            </div>
                                                        </Group>
                                                    </div>
                                                )}
                                            </Draggable>
                                        )) : <></>}
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>
                            {/*}</main>*/}
                        </div>
                    )))}
                </DragDropContext>
            </div>

        </>
    );
};

export default QueueViewer;