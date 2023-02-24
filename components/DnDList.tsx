/**
 * Built by @rtivital
 * https://ui.mantine.dev/category/dnd
 */

import {createStyles, Text} from '@mantine/core';
import {UseListStateHandlers} from '@mantine/hooks';
import {DragDropContext, Draggable, Droppable} from 'react-beautiful-dnd';
import {Customer, getCustomerIdAsString} from '../models/customer';
import {updateUser} from "../lib/store";
import {rgba} from "@mantine/styles/lib/theme/functions/fns/rgba/rgba";

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

interface DndListProps {
    items: Customer[];
    handler: UseListStateHandlers<Customer>;

    sendUpdate: (queue_id: number) => void;
}

export const DndList = (props: DndListProps) => {
    const {classes, cx} = useStyles();

    const items = props.items.map((item, index) => (
        <Draggable key={getCustomerIdAsString(item)} index={index} draggableId={getCustomerIdAsString(item)}>
            {(provided, snapshot) => (
                <div

                    className={cx(classes.item, {[classes.itemDragging]: snapshot.isDragging})}
                    {...provided.draggableProps}
                    style={{background: "#D1D5DB"}}
                    {...provided.dragHandleProps}
                    ref={provided.innerRef}
                >
                    <div className="text-gray-500 font-bold">
                        <Text>{item.name}</Text>
                        <Text size="sm">
                            Dauer: {item.duration} Minuten
                        </Text>
                    </div>
                </div>
            )}
        </Draggable>
    ));

    let valuesHaveChanged = false;
    props.items.forEach((value, index) => {
        if (value.position !== index) {
            valuesHaveChanged = true;
            value.position = index;
            updateUser(value);
        }
    });
    if (valuesHaveChanged) {
        // TODO: queue_id
        props.sendUpdate(0);
    }

    return (
        <DragDropContext onDragEnd={({destination, source}) => {
            props.handler.reorder({from: source.index, to: destination?.index || 0});
        }}>
            <Droppable droppableId="dnd-list" direction="vertical">
                {(provided) => (
                    <div {...provided.droppableProps} ref={provided.innerRef}>
                        {items}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
        </DragDropContext>
    );
}
