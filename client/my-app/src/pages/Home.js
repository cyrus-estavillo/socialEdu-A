import * as React from 'react';
import TextField from '@mui/material/TextField';
import { Button } from '@mui/material';
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

const Home = () => {
    const { userInfo, setUserInfo } = useContext(UserContext);
    const [value, setValue] = useState("1");
    const [followingposts, setFollowingPosts] = useState([]);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

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

    return (
        <div style={{ height: "50%", minHeight: "500px" }}>
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
                            <Tab label="For You" value="2" sx={{ marginLeft: 16, marginRight: 16 }} />
                            <Tab label="Community" value="3" />
                        </TabList>
                    </Box>
                    <TabPanel value="1">
                        {followingposts.map((post) => (
                            <Post postID={post._id} authorID={post.author} text={post.text} comments={post.comment} tags={post.tags} />
                        ))}
                    </TabPanel>
                    <TabPanel value="2">Item Two</TabPanel>
                    <TabPanel value="3">Item Three</TabPanel>
                </TabContext>
            </Box>
        </div>
    )
};

export default Home;