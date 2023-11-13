import * as React from 'react';
import TextField from '@mui/material/TextField';
import { Button, IconButton } from '@mui/material';
import { useState, useContext, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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
import { Select } from '@mui/material';
import ForumOutlinedIcon from '@mui/icons-material/ForumOutlined';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import DeleteIcon from '@mui/icons-material/Delete';
import Chip from '@mui/material/Chip';
import Post from '../components/Post';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';

const OtherProfilePage = () => {
    const { id } = useParams();
    const [userDetails, setUserDetails] = useState();
    const [userPost, setUserPosts] = useState([]);
    const [userPreferences, setUserPreferences] = useState([]);
    const [userLikedPosts, setUserLikedPosts] = useState([]);
    const [value, setValue] = useState("1");

    const handleChange = (event, newValue) => {
        setValue(newValue);
        localStorage.setItem("TabValue", newValue); 
    };

    const getUserPosts = async () => {
        const response = await fetch(`http://localhost:3001/getUserPosts/${id}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include'
        })
        const data = await response.json();
        if (response.ok) {
            setUserPosts(data.userPosts);
        }
    };

    useEffect(() => {
        getUserPosts();
    }, [])

    const getUserInformation = async () => {
        const response = await fetch(`http://localhost:3001/user/${id}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include'
        })
        const data = await response.json();
        if (response.ok) {
            setUserDetails(data.userSpecific);
            setUserPreferences(data.userSpecific?.preferences);
            console.log("User Preferences: ", userPreferences);
        }
    };

    useEffect(() => {
        getUserInformation();
    }, [])

    const getUserLikedPosts = async () => {
        const response = await fetch('http://localhost:3001/userLikedPosts', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include'
        })
        const data = await response.json();
        if (response.ok) {
            setUserLikedPosts(data.result);
        }
    };

    useEffect(() => {
        getUserLikedPosts();
    }, [])

    return (
        <div style={{ height: "50%", minHeight: "500px", marginBottom: 40, paddingTop: '150px' }}>
            <h1>{userDetails?.name}</h1>
            <h1 style={{ color: "#3576cb" }}>@{userDetails?.username}</h1>
            <h1 style={{ textDecoration: "underline" }}>Preferred Tags </h1>
            <div sx={{ display: "flex" }}>
                {userDetails?.preferences.length > 0 ? (
                    <div style={{ display: "flex", justifyContent: "center" }}>
                        {userPreferences.map((userP) => (
                            <Chip label={userP} variant="outlined" sx={{ marginRight: 1 }} />
                        ))}
                    </div>
                ) : (
                    <h1>N/A</h1>
                )}
            </div>
            <Box sx={{ width: '100%', typography: 'body1', marginTop: 2 }}>
                <TabContext value={value}>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <TabList
                            value={value}
                            onChange={handleChange}
                            aria-label="lab API tabs example"
                            centered
                        >
                            <Tab label="Your Posts" value="1" />
                            <Tab label="Liked Posts" value="2" />
                        </TabList>
                    </Box>
                    <TabPanel value="1">
                        {userPost.map((post) => (
                            <Post
                                postID={post._id}
                                authorID={post.author}
                                text={post.text}
                                comments={post.comment}
                                tags={post.tags}
                                likeCount={post.likes}
                                date={post.date}
                            />
                        ))}
                    </TabPanel>
                    <TabPanel value="2">
                        {userLikedPosts.map((post) => (
                            <Post
                                postID={post._id}
                                authorID={post.author}
                                text={post.text}
                                comments={post.comment}
                                tags={post.tags}
                                likeCount={post.likes}
                                date={post.date}
                            />
                        ))}
                    </TabPanel>
                </TabContext>
            </Box>
        </div>
    );
};

export default OtherProfilePage; 