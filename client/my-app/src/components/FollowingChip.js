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

const FollowingChip = (props) => {
    const addToFollowing = async () => {
        const response = await fetch(`http://localhost:3001/addFollowing/${props.id}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include'
        })
        const data = await response.json();
        if (response.ok) {
            window.location.reload();
        }
    }
    return (
        <div>
            <Chip label={props.name} variant="outlined" onClick={addToFollowing} icon={<AddIcon />} />
        </div>
    )
}

export default FollowingChip;