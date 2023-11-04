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
import { CardActionArea, CardActions, InputLabel, MenuItem, ListItemText, Checkbox, Select, FormControl, OutlinedInput } from '@mui/material';
import ForumOutlinedIcon from '@mui/icons-material/ForumOutlined';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import DeleteIcon from '@mui/icons-material/Delete';
import Chip from '@mui/material/Chip';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import Post from '../components/Post';
import EditIcon from '@mui/icons-material/Edit';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

const names = [
    'Audio',
    'Animals',
    'Biology',
    'Computer Science',
    'Finance',
    'Fitness',
    'Food',
    'History',
    'Machine Learning',
    'Math',
    'Medicine',
    'Music',
    'Non-STEM',
    'Philosophy',
    'Physics',
    'Software Engineering',
    'Text',
    'Tech',
    'Video'
];

function getStyles(name, personName, theme) {
    return {
        fontWeight:
            personName.indexOf(name) === -1
                ? theme.typography.fontWeightRegular
                : theme.typography.fontWeightMedium,
    };
}

const Profile = () => {
    const { userInfo } = useContext(UserContext);
    const [value, setValue] = useState("1");
    const [userPost, setUserPosts] = useState([]);
    const [userLikedPosts, setUserLikedPosts] = useState([]);
    const [userDetails, setUserDetails] = useState();
    const [open, setOpen] = useState(false);
    const [userPreferences, setUserPreferences] = useState([]);
    const [userPreferences1, setUserPreferences1] = useState(userPreferences);

    const userId = userInfo?.id;

    const handleClose = () => {
        setOpen(false);
    };

    const handleOpen = () => {
        setOpen(true);
    }

    /*useEffect(() => {
        const tabStore = localStorage.getItem("TabValue");
        if(tabStore) {
            setValue(tabStore); 
        }
    }, [])*/

    const handleChange = (event, newValue) => {
        setValue(newValue);
        localStorage.setItem("TabValue", newValue); 
    };

    const handleChange1 = (event) => {
        const {
            target: { value },
        } = event;
        setUserPreferences1(
            // On autofill we get a stringified value.
            typeof value === 'string' ? value.split(',') : value,
        );
    };

    const getUserPosts = async () => {
        const response = await fetch('http://localhost:3001/getUserPosts', {
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
        const response = await fetch(`http://localhost:3001/user/${userId}`, {
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
    }, [userId])

    useEffect(() => {
        setUserPreferences1(userPreferences);
      }, [userPreferences]);
      

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

    const editTags = async () => {
        const response = await fetch('http://localhost:3001/editPreferences', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({
                preferTags: userPreferences1
            })
        })
        const data = await response.json();
        if (response.ok) {
            window.location.reload();
        }
    }

    return (
        <div style={{ height: "50%", minHeight: "500px", marginBottom: 40 }}>
            <h1>Name: {userDetails?.name}</h1>
            <h1>Username: @{userDetails?.username}</h1>
            <h1 style={{ textDecoration: "underline" }}>Preferred Tags </h1>
            <div sx={{ display: "flex" }}>
                {userDetails?.preferences.length > 0 ? (
                    <div style={{ display: "flex", justifyContent: "center" }}>
                        {userPreferences.map((userP) => (
                            <Chip label={userP} variant="outlined" sx={{ marginRight: 1 }} />
                        ))}
                        <IconButton><EditIcon onClick={handleOpen} /></IconButton>
                    </div>
                ) : (
                    <h1>N/A</h1>
                )}
            </div>
            <Dialog
                open={open}
                onClose={handleClose}>
                <DialogTitle sx={{ fontWeight: "bold", textAlign: "center" }}>
                    Edit the Tags
                </DialogTitle>
                <DialogContent >
                    <FormControl sx={{ marginTop: 2, width: 300 }}>
                        <InputLabel id="demo-multiple-checkbox-label">Tag</InputLabel>
                        <Select
                            labelId="demo-multiple-checkbox-label"
                            id="demo-multiple-checkbox"
                            multiple
                            value={userPreferences1}
                            onChange={handleChange1}
                            input={<OutlinedInput label="Tag" />}
                            renderValue={(selected) => selected.join(', ')}
                            MenuProps={MenuProps}
                        >
                            {names.map((name) => (
                                <MenuItem key={name} value={name}>
                                    <Checkbox checked={userPreferences1.indexOf(name) > -1} />
                                    <ListItemText primary={name} />
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button variant="contained" onClick={editTags}>SUBMIT</Button>
                </DialogActions>
            </Dialog>
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
    )
}

export default Profile; 