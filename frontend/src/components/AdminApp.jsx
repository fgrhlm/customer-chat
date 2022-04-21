import React from 'react';
import { useState, useEffect } from 'react';

// Grommet Komponenter
import { 
    Grommet, 
    Anchor,
    Main, 
    Heading, Text, TextInput,
    Box, Button,
    Card, CardHeader, CardBody, CardFooter
} from 'grommet';

// Grommet Tema
import ChatTheme from '../grommet-theme';

// Komponenter
import ChatContainer from './ChatContainer';

const AdminApp = () => {
    const API_URL = "/~fagerhjo/chat/api"

    const [username, setUsername] = useState("");           // Användarnamn som angetts i fältet
    const [password, setPassword] = useState("");           // Lösenord som angetts i fältet
    const [isLoggingIn,setIsLoggingIn] = useState(false);   // Försöker logga in?
    const [isLoggedIn,setIsLoggedIn] = useState(false);     // Inloggad eller inte, används endast för rendering
    const [loginStatus, setLoginStatus] = useState("");     // Om nånting går fel så sparar vi meddelandet här
    const [chats, setChats] = useState([]);                 // Lista på chattar från backend
    const [selectedChat, setSelectedChat] = useState(0);    // Den chatten vi visar för tillfället

    // Hantera "Visa" 
    const handleChatListShow = (id) => {
        setSelectedChat(id); 
        console.log(selectedChat);
    }

    // Hantera "Radera"
    const handleChatListDelete = (id) => {
        const token = getToken();
        const opts = {
            method: "DELETE",
            body: JSON.stringify({"id": id}),
            headers: {"Authentication": token}
        }
        fetch(`${API_URL}/chats.php`,opts)
            .then(()=>{
                fetchChats();
            })
    }

    // Renderar chattlista från backend
    const renderSavedChatItems = chats.map((n) =>
        <Box direction="row" gap="small" pad="small" align="center" justify="end" key={n.id} hoverIndicator="primary" onClick={()=>true}>
            <Box fill="horizontal">
                <Text fill="horizontal">{n.id}</Text>
            </Box>
            <Box fill="horizontal" align="right" justify="end" direction="row" gap="medium">
                <Anchor size="small" color="focus" href="#" onClick={()=>handleChatListShow(n.id)} label="Visa"/>
                <Anchor size="small" color="danger" href="#" onClick={()=>handleChatListDelete(n.id)} label="Radera" />
            </Box>
        </Box>
    );

    // Hämta token från localstorage
    const getToken = () => {
        let token = "";
        try {
            token = localStorage.getItem("token");
        } catch (error) {
            console.log(error);
        }

        return token;
    }

    // Hämtar chattar från backend
    const fetchChats = () => {
        const token = getToken();

        const opts = {
            method: "GET",
            headers: {"Authentication": token}
        }
        console.log(opts);
        fetch(`${API_URL}/chats.php`,opts)
            .then(res => res.json())
            .then(result => setChats(result));
    };

    useEffect(()=>{
        fetchChats();
    },[])

    // Authentication
    const login = () => {
        setIsLoggingIn(true);
        const opts = {
            method: "POST",
            headers: {'Content-Type': "application/json"},
            body: JSON.stringify({"username": username, "password": password})
        }
        console.log(opts);
        fetch(`${API_URL}/auth.php`,opts)
            .then(res => { console.log(res); return res.json()})
            .then(result => {
                if(result["token"]){
                    localStorage.setItem("token",result["token"]);
                    setIsLoggedIn(true);
                }else{
                    setIsLoggedIn(false);
                    setLoginStatus("Fel användarnamn eller lösenord! :(")
                }
            })
    }

    return(
        <Grommet theme={ChatTheme}>
            <Main
                direction="column" 
                pad="large"
                align="center" 
            >
                <Heading>Kundtjänst Admin</Heading>
                { isLoggedIn ?
                <Box direction="row" gap="medium">
                    <Card height="medium" width="medium" background="shadow" elevation="large">
                        <CardHeader
                            pad="small"
                            background="secondary"
                            fill="horizontal"
                        >
                            <Box direction="row" fill="horizontal">
                                <Box fill="horizontal" pad={{left:"small"}}>
                                    <Text fill="horizontal" size="small" color="white" weight="bold" margin="none">
                                        Aktiva chattar:
                                    </Text>
                                </Box>
                                <Box fill="horizontal" justify="end" align="end" pad={{right:"medium"}}>
                                    <Anchor size="small" color="primary" href="#" onClick={()=>{fetchChats()}} label="Uppdatera"/>
                                </Box>
                            </Box>
                        </CardHeader>
                        <CardBody
                            pad="small"
                            overflow={{
                                vertical: "scroll",
                                horizontal: "hidden"
                            }}
                        >
                            {chats.length > 0 && chats[0].id &&
                                renderSavedChatItems
                            }
                        </CardBody>
                        <CardFooter
                            pad="small"
                        >
                        </CardFooter>
                    </Card>
                    <ChatContainer id={selectedChat} client="admin" key={selectedChat}/>
                </Box> :
                <Box direction="column" gap="small" justify="center" align="center">
                    <Text weight="bold">Inloggning</Text>
                    <TextInput placeholder="Användarnamn" onChange={(e)=> {setUsername(e.target.value)}}></TextInput>
                    <TextInput placeholder="Lösenord" onChange={(e)=> {setPassword(e.target.value)}} type="password"></TextInput>
                    <Button label="Logga in!" size="medium" secondary onClick={()=>{login()}}></Button>
                    <Text weight="bold">{loginStatus}</Text>
                </Box>
                }
            </Main>
        </Grommet>
    ); 
}

export default AdminApp;