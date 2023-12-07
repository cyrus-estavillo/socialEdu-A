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
import FollowingChip from "../components/FollowingChip";
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import ListItemText from '@mui/material/ListItemText';
import Select from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';

const Home = () => {
    const { userInfo, setUserInfo } = useContext(UserContext);
    const [value, setValue] = useState("1");
    const [followingposts, setFollowingPosts] = useState([]);
    const [potentialFollow, setPotentialFollow] = useState([]);
    const [userDetails, setUserDetails] = useState();
    const [recomPosts, setRecomPosts] = useState([]);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const userId = userInfo?.id;

    const getUserInformation = async () => {
        const response = await fetch(`http://localhost:3001/user/${userId}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include'
        })
        const data = await response.json();
        if (response.ok) {
            setUserDetails(data.userSpecific);
        }
    };

    useEffect(() => {
        getUserInformation();
    }, [userId])

    const potentialFollowing = async () => {
        const response = await fetch('http://localhost:3001/getFollowingRecommendations', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include'
        })
        const data = await response.json();
        if (response.ok) {
            setPotentialFollow(data.userList);
        }
    }

    useEffect(() => {
        potentialFollowing();
    }, [])

    const followingPosts = async () => {
        const response = await fetch('http://localhost:3001/getFollowerPosts', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include'
        })
        const data = await response.json();
        if (response.ok) {
            setFollowingPosts(data.postsJson);
        }
    };

    useEffect(() => {
        followingPosts();
    }, [])

    const addToFollowing = async (id) => {
        const response = await fetch(`http://localhost:3001/addFollowing/${id}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include'
        })
        const data = await response.json();
        if (response.ok) {
            window.location.reload();
        }
    }

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

    const [personName, setPersonName] = React.useState([]);

    const handleChange1 = (event) => {
        const {
            target: { value },
        } = event;
        setPersonName(
            // On autofill we get a stringified value.
            typeof value === 'string' ? value.split(',') : value,
        );
    };

    const addPreferredTags = async () => {
        const response = await fetch(`http://localhost:3001/addPreferences`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({
                preferTags: personName
            })
        })
        const data = await response.json();
        if (response.ok) {
            window.location.reload();
        }
    }

    const getRecommendedPosts = async () => {
        const response = await fetch('http://localhost:3001/getRecommendedPosts', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include'
        })
        const data = await response.json();
        if (response.ok) {
            setRecomPosts(data.postRes);
        }
    }

    useEffect(() => {
        getRecommendedPosts(); 
    })

    return (
        <div style={{ height: "500px", minHeight: "500px", marginBottom: 40 }}>
            <Box sx={{ width: '100%', typography: 'body1' }}>
                <TabContext value={value}>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <TabList
                            value={value}
                            onChange={handleChange}
                            aria-label="lab API tabs example"
                            centered
                        >
                            <Tab label="Following" value="1" />



                            <Tab label="For You" value="2" sx={{ marginLeft: 8, marginRight: 8 }} />


                            {/*<Tab label="Community" value="3" />*/}
                        </TabList>
                    </Box>
                    <TabPanel value="1">
                        {followingposts.map((post) => (
                            <Post postID={post._id} authorID={post.author} text={post.text} comments={post.comment} tags={post.tags} />
                        ))}
                        <h1>Add them to Following</h1>
                        <Stack direction="row" spacing={1}>
                            {potentialFollow.map((pot) => (
                                <FollowingChip id={pot._id} name={pot.name} />
                            ))}

                            {/*<h1>Add them to Following</h1>
                            <Stack direction="row" spacing={1}>
                                {potentialFollow.map((pot) => (
                                    <FollowingChip id={pot._id} name={pot.name} />
                                ))}*/}
                                </Stack>
                        </TabPanel>
                        <TabPanel value="2" style={{ overflow: 'auto' }}>
                            {userDetails?.preferences.length == 0 && (
                                <div>
                                    <h1>Choose preferred tags to view similar posts</h1>
                                    <FormControl sx={{ width: 300 }}>
                                        <InputLabel id="demo-multiple-checkbox-label">Tag</InputLabel>
                                        <Select
                                            labelId="demo-multiple-checkbox-label"
                                            id="demo-multiple-checkbox"
                                            multiple
                                            value={personName}
                                            onChange={handleChange1}
                                            input={<OutlinedInput label="Tag" />}
                                            renderValue={(selected) => selected.join(', ')}
                                            MenuProps={MenuProps}
                                        >
                                            {names.map((name) => (
                                                <MenuItem key={name} value={name}>
                                                    <Checkbox checked={personName.indexOf(name) > -1} />
                                                    <ListItemText primary={name} />
                                                </MenuItem>
                                            ))}
                                        </Select>
                                        <Button variant="contained" sx={{ marginTop: 2 }} onClick={addPreferredTags}>SUBMIT</Button>
                                    </FormControl>
                                </div>)}
                            {userDetails?.preferences.length > 0 && (
                                recomPosts.map((recom) => (
                                    <Post
                                        postID={recom._id}
                                        authorID={recom.author}
                                        text={recom.text}
                                        comments={recom.comment}
                                        tags={recom.tags}
                                        likeCount={recom.likes}
                                        date={recom.date}
                                    />
                                )
                                ))}
                        </TabPanel>
                        {/* Commented out for implementation later
                        
                            <TabPanel value="3" style={{ overflow: 'auto' }}>
                                <Dialog
                                    open={open}
                                    onClose={handleClose}>
                                    <DialogTitle sx={{ fontWeight: "bold", textAlign: "center" }}>
                                        Add a Group Chat!
                                    </DialogTitle>
                                    <DialogContent >
                                        <TextField sx={{ width: 400 }}
                                            multiline
                                            value={groupName}
                                            onChange={(e) => setGroup(e.target.value)}
                                        />
                                    </DialogContent>
                                    <DialogActions>
                                        <Button onClick={handleClose}>Cancel</Button>
                                        <Button variant="contained" onClick={addGroup}>Post</Button>
                                    </DialogActions>
                                </Dialog>
                                <Button variant="contained" onClick={handleOpen}>Add Group</Button>
                                <h1>My Groups</h1>
                                {userGroups && (userGroups.map((group) => (
                                    <GroupView groupID={group._id} groupName={group.name} groupMembers={group.members.length} />
                                ))
                                )}
                                <h1>Recommended groups</h1>
                                {unjoinedGroups && unjoinedGroups.map((group) => (
                                    //userDetails.groups && !userDetails.groups.includes(group._id) && (
                                    <Group groupID={group._id} groupName={group.name} />
                                    //)
                                ))}
                            </TabPanel>
                        */}
                    
    

                </TabContext>
            </Box>
        </div>
    )
};

export default Home;