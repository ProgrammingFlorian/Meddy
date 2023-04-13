import {BackgroundImage, Button, Center, Container, Text} from "@mantine/core";
import React from "react";
import MeddyTextComponent from "./meddyTextComponent";

const WebsiteImage = () => {

    let scrollDiv = typeof document !== 'undefined' ? document.getElementById("contact")?.offsetTop : null;


    return (
        <div style={{height: '100vh', backgroundColor: "black"}}>
            <BackgroundImage className="" style={{opacity: "90%"}} w={"100%"} h={"100%"} src="./images/title_background.jpg">
                <Container fluid className="h-full " style={{position: "relative"}}>
                    <Container style={{position: "absolute", top: 0, right: 0}}>
                        <Button size={"lg"} className="m-5" onClick={() => {
                            if (scrollDiv != null) {
                                window.scrollTo({ top: scrollDiv, behavior: 'smooth'})
                            }
                        }}>Kontakt</Button>
                        <Button size={"lg"}
                                onClick={() => window.location.href = "https://meddy.me/overview"}>Anmelden</Button>
                    </Container>
                    <Text className=""
                          style={{position: "absolute", top: "40%", left: 0, right: 0, textAlign: "center"}}>
                        <MeddyTextComponent size={200}/>
                        <Center>
                            <Text style={{color: "white", fontSize: "50px", maxWidth: 1500}}>
                                “Verwalten Sie Ihre Warteschlangen
                                <span className="blue-color"> einfach und effizient</span>. Schaffen Sie
                                gleichzeitig
                                <span className="blue-color"> Transparenz</span> über Wartezeiten für Ihre Kunden.”
                            </Text>

                        </Center>

                    </Text>
                </Container>
            </BackgroundImage>

        </div>
        );

}

export default WebsiteImage;