import {createStyles, Container, Center, Text, SimpleGrid, Box, Stack, Card, Badge, Group, Space} from '@mantine/core';
import {IconPhone, IconAt} from '@tabler/icons-react';


const ContactUsComponent = () => {
    return (
        <Card shadow="sm" padding="lg" radius="md" withBorder style={{minWidth: "40%", maxWidth: 500, fontSize: 25}}>
            <Text size={30} weight={500}>Kontaktieren Sie uns</Text>
                <Space h={50}/>
                <Container className=" ">
                    <Group className="m-5">
                        <IconAt size={40} className="blue-color"/>
                        <Box className="text-start">
                            <Text weight={500} size="lg" color="dimmed">E-Mail</Text>
                            <Text weight={500}>info@meddy.me</Text>
                        </Box>
                    </Group>
                    <Group className="m-5">
                        <IconPhone size={40} className="blue-color"/>
                        <Box className="text-start">
                            <Text weight={500} size="lg" color="dimmed">Telephone</Text>
                            <Text weight={500}>+49 1573 2128812</Text>
                        </Box>
                    </Group>
                </Container>


        </Card>
    )

}
export default ContactUsComponent;