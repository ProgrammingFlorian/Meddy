/**
 * Built by @rtivital
 * https://ui.mantine.dev/category/dnd
 */

import { createStyles, Text } from '@mantine/core';
import { useListState, UseListStateHandlers } from '@mantine/hooks';
import dynamic from 'next/dynamic';
import { DropResult } from 'react-beautiful-dnd';
import { Customer, getCustomerIdAsString } from '../models/customer';

// https://stackoverflow.com/a/73168004
const DragDropContext = dynamic(
  () =>
    import('react-beautiful-dnd').then(mod => {
      return mod.DragDropContext;
    }),
  { ssr: false },
);
const Droppable = dynamic(
  () =>
    import('react-beautiful-dnd').then(mod => {
      return mod.Droppable;
    }),
  { ssr: false },
);
const Draggable = dynamic(
  () =>
    import('react-beautiful-dnd').then(mod => {
      return mod.Draggable;
    }),
  { ssr: false },
);

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

  onReorder: () => void;
}

export const DndList = (props: DndListProps) => {
  const { classes, cx } = useStyles();

  const items = props.items.map((item, index) => (
    <Draggable key={getCustomerIdAsString(item)} index={index} draggableId={getCustomerIdAsString(item)}>
      {(provided, snapshot) => (
        <div
          className={cx(classes.item, { [classes.itemDragging]: snapshot.isDragging })}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
        >
          <div>
            <Text>{item.name}</Text>
            <Text color="dimmed" size="sm">
              Dauer: {item.duration} Minuten
            </Text>
          </div>
        </div>
      )}
    </Draggable>
  ));

  return (
    <DragDropContext onDragEnd={({ destination, source }) => {
      props.handler.reorder({ from: source.index, to: destination?.index || 0 });
      props.items.forEach((value, index) => {
        value.position = index;
        props.handler.setItem(index, value);
      });
      props.onReorder();
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
