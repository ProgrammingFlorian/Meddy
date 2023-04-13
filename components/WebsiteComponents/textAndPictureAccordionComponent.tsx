import {Grid, Group, Image, Modal, Text} from "@mantine/core";
import React from "react";
import {useDisclosure} from "@mantine/hooks";

interface TextAndPictureAccordionComponentProps {
    image: string,
    description: string
}

const TextAndPictureAccordionComponent = (props: TextAndPictureAccordionComponentProps) => {
    const [opened, { open, close }] = useDisclosure(false);
    return (
        <Grid justify={"space-evenly"}>
            <Grid.Col span={5} style={{display: 'flex', alignItems: 'center'}}>
                <Text className="text-center w-full">
                    {props.description}
                </Text>
            </Grid.Col >
            <Grid.Col span={5} className="rounded-5 bg-white shadow" style={{borderRadius: 10}}>
                <Modal size={"xl"} style={{width: "50%"}} opened={opened} onClose={close} title="Reihenfolge/ Warteschlange der Kunden verändern">
                    <Image src="./Images/changeOrder.png" />
                </Modal>
                <Group position="center">
                    <Image onClick={open} src={props.image} />
                </Group>
            </Grid.Col>
        </Grid>
    )


}

export default TextAndPictureAccordionComponent;