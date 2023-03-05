import {Container, Grid, Center, Title} from '@mantine/core';
import {DragDropContext, Draggable, Droppable, DropResult} from 'react-beautiful-dnd';
import {Customer, getCustomerIdAsString} from '../../../models/Customer';
import {move, reorder} from "../../../util/ListUtil";
import React, {useContext, useMemo, useState} from "react";
import CustomerPopup from "../CustomerPopup";
import {StoreContext} from "../../../lib/store";
import QueueCustomerActive from "./QueueCustomerActive";
import QueueCustomer from "./QueueCustomer";

const QueueViewer = () => {
    const [popup, setPopup] = useState(null as Customer | null);

    const {queues, customersInQueue, updateCustomersInQueue, deleteCustomer, updateQueue, updateCustomer} = useContext(StoreContext);

    const onDragEnd = ({destination, source}: DropResult) => {
        // dropped outside the lists
        if (!destination) {
            return;
        }

        const sourceId = +source.droppableId;
        const destinationId = +destination.droppableId;

        const sourceQueue = queues.find(q => q.id === sourceId);
        const destinationQueue = queues.find(q => q.id === destinationId);

        if (sourceQueue?.active_customer !== null) {

        }

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

    const activeCustomer = useMemo(() => {
        const result = [] as { [queue_id: number]: Customer | null };
        queues.forEach((queue) => {
            result[queue.id] = customersInQueue[queue.id]?.find(customer => customer.id === queue.active_customer) ?? null;
        });
        return result;
    }, [queues, customersInQueue]);

    const passiveCustomersInQueue = useMemo(() => {
        const result = [] as { [queue_id: number]: Customer[] };
        queues.forEach((queue) => {
            result[queue.id] = customersInQueue[queue.id]?.filter(customer => customer.id !== queue.active_customer) ?? [];
        });
        return result;
    }, [queues, customersInQueue]);

    return (
        <>
            {popup ?
                <CustomerPopup customer={popup} queues={queues} updateCustomer={updateCustomer}
                               onClose={() => setPopup(null)}/>
                : <></>
            }
            <div  className="" >
                <Grid style={{maxWidth: 1400}}>
                    <DragDropContext onDragEnd={onDragEnd}>
                        {queues.map(((queue, queue_index) => (
                            <Grid.Col span={3} key={queue_index} style={{width: 350, padding: 0, marginTop: 20, minHeight: 500}}>
                                <Center className="h-full p-0 m-0">
                                    <Container p={10} m={10} className="bg-gray-100 rounded h-full p-0 w-0"
                                               style={{width: 350}}>
                                        <Container style={{padding: 0, margin: 0}}>
                                            <Title order={3} align="center">{queue.name}</Title>
                                        </Container>
                                        <QueueCustomerActive activeCustomer={activeCustomer[queue.id]} queue={queue}
                                                             setPopup={setPopup} deleteCustomer={deleteCustomer}
                                                             appointmentStart={queue.latest_appointment_start}/>
                                        <Droppable key={queue.id} droppableId={`${queue.id}`} direction="vertical">
                                            {(provided) => (
                                                <div className="m-2"
                                                     {...provided.droppableProps}
                                                     ref={provided.innerRef}>
                                                    {passiveCustomersInQueue[queue.id].map((customer, customer_index) => (
                                                        <Draggable key={getCustomerIdAsString(customer)}
                                                                   index={customer_index}
                                                                   draggableId={getCustomerIdAsString(customer)}>
                                                            {(provided, snapshot) =>
                                                                <QueueCustomer isDragging={snapshot.isDragging}
                                                                               provided={provided} setPopup={setPopup}
                                                                               queue={queue}
                                                                               isHighlighted={customer_index === 0 && activeCustomer[queue.id] === null}
                                                                               customer={customer}
                                                                               updateQueue={updateQueue}/>
                                                            }
                                                        </Draggable>
                                                    ))}
                                                    {provided.placeholder}
                                                </div>
                                            )}
                                        </Droppable>
                                    </Container>
                                </Center>
                            </Grid.Col>
                        )))}
                    </DragDropContext>


                </Grid>
            </div>
        </>
    );
};

export default QueueViewer;