import {createStyles, Group, Text} from '@mantine/core';
import {DragDropContext, Draggable, Droppable, DropResult} from 'react-beautiful-dnd';
import {Customer, getCustomerIdAsString} from '../../models/Customer';
import {move, reorder} from "../../util/ListUtil";
import React, {useContext, useEffect, useMemo, useState} from "react";
import {ListQueue} from "../../models/ListQueue";
import {useSupabaseClient, useUser} from "@supabase/auth-helpers-react";
import CustomerPopup from "./CustomerPopup";
import {Queue} from "../../models/Queue";
import QueueService from "../../services/QueueService";
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
    },

    itemDragging: {
        boxShadow: theme.shadows.sm,
    },
}));

const QueueViewer = () => {
    const {classes, cx} = useStyles();

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
    const {queues, customersInQueue} = useContext(StoreContext);

    console.log(queues);

    const onDragEnd = ({destination, source}: DropResult) => {
        // dropped outside the lists
        if (!destination) {
            return;
        }

        const sourceId = +source.droppableId;
        const destinationId = +destination.droppableId;

        /*if (sourceId === destinationId) {
            const items = reorder(state[sourceId].customers, source.index, destination.index);
            const newState = [...state];
            newState[sourceId].customers = items;
            setState(newState);
        } else {
            const result = move(state[sourceId].customers, state[destinationId].customers, source, destination);
            const newState = [...state];
            newState[sourceId].customers = result[sourceId];
            newState[destinationId].customers = result[destinationId];
            setState(newState);
        }*/
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
            <DragDropContext onDragEnd={onDragEnd}>
                {queues.map(((queue, index) => (
                    <div key={index}>
                        <h3>{queue.name}</h3>
                        <main className="flex w-full flex-1 items-center justify-center px-20 text-center">
                            <Droppable key={index} droppableId={`${index}`} direction="vertical">
                                {(provided) => (
                                    <div {...provided.droppableProps} ref={provided.innerRef}>
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
                        </main>
                    </div>
                )))}
            </DragDropContext>
        </>
    );
};

export default QueueViewer;