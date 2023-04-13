import {createStyles, Container, Center, Text, SimpleGrid, Box, Stack, Card, Badge, Group, Space} from '@mantine/core';
import {IconPhone, IconAt} from '@tabler/icons-react';


const ContactUsComponent = () => {
    return (
        <Card w={"100%"} h={"100%"} shadow="sm" padding="lg" radius="md" withBorder
              style={{fontSize: 25}} id="contact">
            <Text size={30} weight={500}>Kontaktieren Sie uns</Text>
            <Container fluid className="h-full align-middle" style={{display: 'flex', alignItems: 'center'}}>
                <Box>
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
                    <Space h={50}/>
                </Box>


            </Container>

        </Card>
    )

}
export default ContactUsComponent;