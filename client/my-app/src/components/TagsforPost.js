import * as React from 'react';
import TextField from '@mui/material/TextField';
import { Button, Stack } from '@mui/material';
import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { UserContext } from "../components/UserContext";
import Post from "../components/Post";
import Chip from '@mui/material/Chip';
import AddIcon from '@mui/icons-material/Add';

const TagsForPost = (props) => {
    const { userInfo } = useContext(UserContext);
    const [tags, setTags] = useState([]);

    const getUserTags = async () => {
        const response = await fetch(`http://localhost:3001/user/${userInfo?.id}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include'
        })
        const data = await response.json();
        if (response.ok) {
            setTags(data.userSpecific.preferences);
        }
    };

    const followTags = async () => {
        const response = await fetch(`http://localhost:3001/followTags`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include', 
            body: JSON.stringify({
                tag: props.tagName
            })
        })
        const data = await response.json();
        if(response.ok) {
            window.location.reload(); 
        }
    };

    useEffect(() => {
        getUserTags();
    }, [])

    return (
        <div>
            {tags.includes(props.tagName) ?
                (<Chip label={props.tagName} variant="outlined" sx={{ marginRight: 1, backgroundColor: "gray" }} onClick={followTags} />)
                : (<Chip label={props.tagName} variant="outlined" sx={{ marginRight: 1 }} onClick={followTags} />)}
        </div>
    );
};

export default TagsForPost; 