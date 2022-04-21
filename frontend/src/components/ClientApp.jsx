import React from 'react';
import { useState, useEffect } from 'react';
// Grommet Komponenter
import {
    Grommet,
    Box,
    Main,
    Heading,
    Spinner,
    Text
} from 'grommet';

// Grommet Tema
import ChatTheme from '../grommet-theme';

// Komponenter
import ChatContainer from '../components/ChatContainer';

// Snygga spinners
import SyncLoader from 'react-spinners/SyncLoader';

const ClientApp = () => {
    const API_URL = "/~fagerhjo/chat/api";
    const [loading,setLoading] = useState(true);
    const [chatId,setChatId] = useState(0);

    useEffect(()=>{
        setLoading(true);

        const opts = {
            method: "POST",
            headers: {'Content-Type': "application/json"}
        }
        fetch(`${API_URL}/chats.php`,opts)
            .then(res => {console.log(res); return res.json()})
            .then(result => {
                console.log(result);
                setChatId(result.id)
                setLoading(false);
            });
    },[])

    return(
        <Grommet theme={ChatTheme}>
            <Main
                direction="column" 
                pad="large"
                align="center" 
            >
                <Heading>Support</Heading>
                {loading ?
                    <Box width="400px" height="400px" align="center" justify="center" border="true" round="10px" gap="large">
                        <Text size="large">Ansluter till support..</Text>
                        <SyncLoader size="10px" color="black"/> 
                    </Box> :
                    <ChatContainer id={chatId} client="client" key={chatId}/>
                }
            </Main>
        </Grommet>
    ); 
}

export default ClientApp;