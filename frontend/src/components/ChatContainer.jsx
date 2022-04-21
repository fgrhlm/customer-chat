import React from 'react';
import { useState, useEffect, useRef } from 'react';

import {
    Box,
    Card, 
    CardBody, 
    CardHeader, 
    CardFooter, 
    Text,
    TextInput,
    Button,
    Keyboard,
    List,
    Avatar
} from 'grommet';

// Snygga spinners
import PulseLoader from 'react-spinners/PulseLoader';

// Ljudeffekter
import sfx01 from '../../assets/notification_decorative-01.mp3';
import sfx02 from '../../assets/notification_simple-01.mp3';

const ChatContainer = (props) => {
    const API_URL = "/~fagerhjo/chat/api";

    const [isSending, setIsSending] = useState(false);  // För att kunna visa spinner mellan skickat meddelande och nästa poll
    const [showNameInput, setShowNameInput] = useState(true);   // Visar namn "dialogen"
    const [messages, setMessages] = useState([]);       // Samtliga chattmeddelanden
    const [inputValue, setInputValue] = useState("");   // TextInput's value
    const [name,setName] = useState("Kund");    // Användarens namn
    const [messageHistoryLength, setMessageHistoryLength] = useState(0) // För att hålla koll på när vi ska spela ljudeffekter
    
    // Ljudeffekter
    const sfxNewChat = new Audio(sfx01);    // Ljud när ny chatt öppnas
    const sfxNewMessage = new Audio(sfx02); // Ljud vid nytt meddelande

    // Hanterar textinputtens onChange event
    const handleOnChange = (e) => {
        const newInputValue = e.target.value;
        setInputValue(newInputValue);
    }

    // Hanterar Keyboardkomponentens onEnter event
    const handleOnEnter = () => {
        if(showNameInput){
            setShowNameInput(false); 
            sfxNewChat.play();
        }else{
            postMessage();
        }
    }

    const postMessage = () => {
        setIsSending(true); // Detta e nu bara för "UX" så att de int e en awkward wait när man har skickat ett meddelande

        const opts = {
            method: "POST",
            headers: {'Content-Type': "application/json"},
            body: JSON.stringify({"chatId": props.id, "sent_from": name, "sent_to": "Support","message": inputValue})
        }
        fetch(`${API_URL}/messages.php`,opts);

        setInputValue("");
    }

    // Flippa flaggor ifall clienten är i admin mod
    useEffect(()=>{
        fetchMessages();

        if(props.client == "admin"){
            setShowNameInput(false);
            setName("Support");
        }
    },[])

    // Hämta nya meddelanden
    const fetchMessages = () => {
        fetch(`${API_URL}/messages.php?id=${props.id}`)
            .then(res => res.json())
            .then(result => {setMessages(result)});
    }

    // Hook för polling
    // Lånade lite härifrån: https://upmostly.com/tutorials/setinterval-in-react-components-using-hooks
    useEffect(()=>{
        const interval = setInterval(() => {
            fetchMessages();
            setIsSending(false); // Detta e nu bara för "UX" så att de int e en awkward wait när man har skickat ett meddelande
        },2000);

        return () => clearInterval(interval);
    },[])
    
    // Autoscroll lånat lite härifrån: https://stackoverflow.com/questions/37620694/how-to-scroll-to-bottom-in-react
    const messagesElementRef = useRef(null);

    const scrollDown = () => {
        messagesElementRef.current?.scrollIntoView({behaviour: "smooth"});
    }

    // Scrolla neråt när messages ändras
    useEffect(()=>{
        // Litet hack för att fö ljudeffekten för nytt meddelande att spela
        if(messages.length > messageHistoryLength){
            setMessageHistoryLength(messages.length);
        }

        scrollDown();
    },[messages])

    // Hooks för "nytt meddelande" och "skickat" ljudeffekten
    useEffect(()=> {
        sfxNewMessage.play();
    },[messageHistoryLength])

    // Renderar meddelanden
    const renderList = messages.map((n) =>
        <Box
            key={n.createdAt}
            border={{
                size: "small",
                color: n.sent_from == name ? "focus" : "secondary",
            }}
            round="10px"
            width="400px"
            height="100px"
            flex={{grow: false, shrink: false}}
            margin={{bottom: "small"}}
            pad="small"
        >
            <Box direction="row" gap="small" margin={{bottom: "xsmall"}}>
                <Avatar background={n.sent_from == name ? "focus" : "secondary"} size="small">{n.sent_from[0]}</Avatar>
                <Text size="xsmall"> Skickat {n.createdAt} av {n.sent_from}</Text>
            </Box>
            <Text size="small">{n.message}</Text>
        </Box>
    )

    // Renderar placeholder "Skickar" meddelande tills nästa poll
    // Detta ger lite bättre ux när man int gör realtime
    const RenderPlaceHolder = () => {
        useEffect(()=>{
            scrollDown();
        },[])

        return(
            <Box
                border={{
                    size: "small",
                    color: "shadow2",
                }}
                round="10px"
                width="400px"
                height="100px"
                flex={{grow: false, shrink: false}}
                margin={{bottom: "small"}}
                pad="small"
            >
                <Box direction="row" gap="small" margin={{bottom: "xsmall"}}>
                    <Avatar background="shadow2" size="small" color="white">~</Avatar>
                    <Text size="xsmall" color="shadow2">Skickar meddelande..</Text>
                </Box>
                <PulseLoader size="10px" color="white" />
            </Box>
        );
    }

    // Renderar "välkommen" meddelande
    const RenderWelcome = (props) => (
        <Box
            border={{
                size: "small",
                color: "secondary",
            }}
            round="10px"
            width="400px"
            height="100px"
            flex={{grow: false, shrink: false}}
            margin={{bottom: "small"}}
            pad="small"
        >
            <Box direction="row" gap="small" margin={{bottom: "xsmall"}}>
                <Avatar background="secondary" size="small">S</Avatar>
                <Text size="xsmall">Skickat precis nu av Support</Text>
            </Box>
            <Text size="small">{props.message}</Text>
        </Box>
    )

    return(
        <Card height="medium" width="medium" background="shadow" elevation="large">
            <CardHeader pad="small" background="secondary" align="center" justify="center">
                <Text size="small" color="white" weight="bold" margin="none" pad="none">
                    Chatt #{props.id}
                </Text>
            </CardHeader>
            <CardBody pad={{left: "medium",right: "medium",top: "small", bottom: "small"}}>
                <Box height="400px" overflow={{"vertical": "scroll"}} style={{"scrollbarWidth": 'none',"scrollBehavior": "smooth"}}>
                        
                        {showNameInput &&
                            <RenderWelcome message="Var god och ange ditt namn i fältet nedan för att börja chatta!"/>
                        }

                        {props.client == "client" && showNameInput == false &&
                            <RenderWelcome message={`Hej ${name}! Hur kan jag hjälpa er idag? :)`}/>
                        }
                    {renderList}
                    {isSending &&
                        <RenderPlaceHolder />
                    }
                    <div ref={messagesElementRef}></div>
                </Box>
            </CardBody>
            <CardFooter pad="small">
                { showNameInput ?
                <Keyboard onEnter={handleOnEnter}>
                    <TextInput
                        placeholder="Ange ditt namn för att börja chatta!"
                        height="xsmall"
                        onChange={(e)=>{setName(e.target.value)}}
                    />
                </Keyboard> :

                <Keyboard onEnter={handleOnEnter}>
                        <TextInput
                            placeholder="Skriv ditt meddelande här, ENTER för att skicka"
                            height="xsmall"
                            onChange={handleOnChange}
                            value={inputValue}
                        />
                </Keyboard>
                }
            </CardFooter>
        </Card>
    );
}

export default ChatContainer;