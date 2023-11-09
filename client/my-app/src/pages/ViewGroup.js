import * as React from 'react';
import TextField from '@mui/material/TextField';
import { Button, IconButton, Stack } from '@mui/material';
import { useState, useContext, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { UserContext } from "../components/UserContext";
import Chip from '@mui/material/Chip';
import FollowingChip from "../components/FollowingChip";
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import ListItemText from '@mui/material/ListItemText';
import Select from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import SendIcon from '@mui/icons-material/Send';
import Message from "../components/Message"; 

const ViewGroup = () => {
    const { id } = useParams();
    const [groupDetails, setGroupDetails] = useState();
    const [msg, setMsg] = useState("");

    const getGroupDetails = async () => {
        const response = await fetch(`http://localhost:3001/group/${id}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include'
        })
        const data = await response.json();
        if (response.ok) {
            setGroupDetails(data.groupSpecific);
            console.log(data.groupSpecific)
        }
    };

    const addMessage = async () => {
        const response = await fetch(`http://localhost:3001/addMessage/${id}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({
                message: msg
            })
        })
        const data = await response.json();
        if (response.ok) {
            setMsg("");
            window.location.reload();
        }
    }

    useEffect(() => {
        getGroupDetails();
    }, [id])

    return (
        <div style={{ height: "50%", minHeight: "500px", marginBottom: 40, paddingTop: '150px', display: "flex", flexDirection: "column" }}>
            <div style={{ height: "20%" }}>
                <h1>{groupDetails?.name}</h1>
                <p>Members: {groupDetails?.members.length}</p>
            </div>
            <div style={{ height: "60%" }}>
                {groupDetails?.messages.map((msg) => (
                    <Message content={msg.content} author={msg.author} />
                ))}
            </div>
            <Stack direction="row"
                style={{ 
                    backgroundColor: "#D3D3D3", 
                    justifyContent: "center", 
                    marginTop: "auto", 
                    alignItems: "center", 
                    alignContent: "center",
                    marginBottom: 17
                }}
                spacing={2}>
                <TextField
                    variant="outlined"
                    placeholder="Message.."
                    multiline
                    sx={{ width: "70%", backgroundColor: "white" }}
                    value={msg}
                    onChange={(e) => setMsg(e.target.value)}
                />
                <IconButton onClick={addMessage} sx={{ backgroundColor: "#87CEEB", color: "white" }}>
                    <SendIcon />
                </IconButton>
            </Stack>
        </div>
    );
};

export default ViewGroup; 