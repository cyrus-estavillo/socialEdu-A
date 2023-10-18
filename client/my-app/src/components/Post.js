import * as React from 'react';
import TextField from '@mui/material/TextField';
import { Button, IconButton } from '@mui/material';
import { useState, useContext, useEffect } from 'react';
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
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Stack from "@mui/material/Stack";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { CardActionArea, CardActions } from '@mui/material';
import ForumOutlinedIcon from '@mui/icons-material/ForumOutlined';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';

const Post = (props) => {
    const [user, setUser] = useState({
        _id: "",
        name: "",
        username: "",
        password: "",
        following: [],
        liked: [],
    });

    const authorID = props.authorID;
    console.log(authorID);

    const getAuthorPost = async () => {
        const response = await fetch(`http://localhost:3001/user/${authorID}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include'
        })
        const data = await response.json();
        setUser(data.userSpecific);
        console.log(data);
    }

    useEffect(() => {
        getAuthorPost();
    }, [])

    //console.log(user?.name);
    //console.log(user.username);

    return (
        <div>
            <Card sx={{ width: "100%", height: "100%", border: "1px solid #d3d3d3" }}>
                <CardContent>
                    <Stack direction="row" sx={{ marginLeft: 2 }}>
                        <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>{user.name}</Typography>
                        <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold", marginLeft: 1 }}>@{user.username}</Typography>
                    </Stack>
                    <Stack direction="row">
                        <Typography variant="body1" gutterBottom>{props.text}</Typography>
                    </Stack>
                    <CardActions sx={{ justifyContent: "space-evenly" }}>
                        <IconButton><ForumOutlinedIcon /></IconButton>
                        <IconButton><FavoriteBorderOutlinedIcon /></IconButton>
                    </CardActions>
                </CardContent>
            </Card>
        </div>
    )
}

export default Post; 