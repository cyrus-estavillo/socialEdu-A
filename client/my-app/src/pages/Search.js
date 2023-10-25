import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import Post from '../components/Post';


const Search = () => {
    const [input, setInput] = useState("");
    const [posts, setPosts] = useState([]);
    const [users, setUsers] = useState([]);
    const [userPosts, setUserPosts] = useState({});

    useEffect(() => {
        fetchData(input);
    }, [input]);

    const fetchData = async (value) => {
        if (value === "") {
            // Handle empty input if needed
            setPosts([]); // Clear previous posts
            setUsers([]); // Clear previous users
            return;
        }
        try {
            // Fetch posts
            const postResponse = await fetch(`http://localhost:3001/search/posts?q=${value}`);
            const postData = await postResponse.json();
            setPosts(postData);

            // Fetch users
            const userResponse = await fetch(`http://localhost:3001/search/users?q=${value}`);
            const userData = await userResponse.json();
            setUsers(userData);

            const userPostData = {};
            for (const user of userData) {
                console.log("User Query Id: ", user._id);
                const userPosts = await fetchUserPosts(user._id);
                userPostData[user._id] = userPosts;
            }
            setUserPosts(userPostData);

        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    console.log("UserMap: ", userPosts);

    const fetchUserPosts = async (userId) => {
        try {
            const response = await fetch(`http://localhost:3001/postsForEachUser/${userId}`);
            const data = await response.json();
            return data.postLists;
        } catch (error) {
            console.error("Error fetching user posts:", error);
            return [];
        }
    };

    const handleChange = (value) => {
        setInput(value);
        fetchData(value);
    }

    return (

        <div className="input-wrapper">
            <div>
                <SearchRoundedIcon sx={{ color: "black" }} />
                <input
                    type="text"
                    placeholder="Search"
                    value={input}
                    onChange={(e) => handleChange(e.target.value)}
                />
            </div>
            {posts.length > 0 && (
                posts.map((post) => (
                    <Post postID={post._id} authorID={post.author} text={post.text} comments={post.comment} tags={post.tags} />
                ))
            )}
            {users.length > 0 && (
                users.map(user => (
                    <div key={user._id}>
                        {userPosts[user._id] && userPosts[user._id].length > 0 ? (
                            userPosts[user._id].map(userPost => (
                                <Post
                                    key={userPost._id}
                                    postID={userPost._id}
                                    authorID={userPost.author}
                                    text={userPost.text}
                                    comments={userPost.comment}
                                    tags={userPost.tags}
                                />
                            ))
                        ) : (
                            <p>No posts for this user.</p>
                        )}
                    </div>
                ))
            )}
            {posts.length === 0 && users.length === 0 && input !== "" &&
                <div>
                    Sorry, we can't find anything related to {input}. Try searching something else.
                </div>
            }
        </div>
    );
}


export default Search;
