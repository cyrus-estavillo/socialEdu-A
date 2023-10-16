import * as React from 'react';
import TextField from '@mui/material/TextField';
import { Button } from '@mui/material';
import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { UserContext } from "../components/UserContext";
import CssBaseline from '@mui/material/CssBaseline';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import Logo from "../images/WISRR_Logo_Square.jpeg"
import Paper from '@mui/material/Paper';
import RestoreIcon from '@mui/icons-material/Restore';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ArchiveIcon from '@mui/icons-material/Archive';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import EmojiObjectsRoundedIcon from '@mui/icons-material/EmojiObjectsRounded';
import NotificationsRoundedIcon from '@mui/icons-material/NotificationsRounded';
import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded';

const Footer = () => {
    const { userInfo, setUserInfo } = useContext(UserContext);
    const [value, setValue] = React.useState(0);
    const username = userInfo?.username;
    return (
        <div style={{ position: "fixed" }}>
            {username && ((
                <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={3}>
                    <BottomNavigation
                        showLabels
                        value={value}
                        onChange={(event, newValue) => {
                            setValue(newValue);
                        }}
                        sx={{backgroundColor: "black"}}
                    >
                        <BottomNavigationAction icon={<HomeRoundedIcon sx={{color: "white"}} />}/>
                        <BottomNavigationAction icon={<SearchRoundedIcon sx={{color: "white"}} />} />
                        <BottomNavigationAction icon={<EmojiObjectsRoundedIcon sx={{color: "white"}} />} />
                        <BottomNavigationAction icon={<NotificationsRoundedIcon sx={{color: "white"}} />} />
                        <BottomNavigationAction icon={<AccountCircleRoundedIcon sx={{color: "white"}} />} />
                    </BottomNavigation>
                </Paper>
            ))}
        </div>
    )
}

export default Footer; 