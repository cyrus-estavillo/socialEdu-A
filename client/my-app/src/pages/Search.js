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
        // Only fetch data if input is not empty
        if (input.trim()) {
            fetchData(input);
        } else {
            setPosts([], () => {
                setUsers([], () => {
                    setUserPosts({});
                });
            });
        }
    }, [input]); // Depend on input

    const fetchData = async (value) => {
        if (value === "") {
            // Handle empty input if needed
            setPosts([], () => {
                setUsers([], () => {
                    setUserPosts({});
                });
            });
            
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

        <>
            {/* Sets the search bar to the top of page (under header) with all results loading underneath */} 
            <div style={{ 
                position: 'fixed', // Fixed position
                top: '140px', // Align to the top of the viewport, but under the header
                left: 0, // Align to the left of the viewport
                right: 0, // Align to the right of the viewport
                zIndex: 1000, // Make sure the search bar is above everything else on the page
                display: 'flex', 
                justifyContent: 'center', 
                padding: '10px 0',
                backgroundColor: 'white', // Background color to overlap content below
                borderBottom: '1px solid black', 
            }}>
                <div style={{ display: 'flex', alignItems: 'center', border: '1px solid black', borderRadius: '25px', padding: '5px 15px', 
                                width: '20vw', maxWidth: '600px', minWidth: '300px', }}>
                    <SearchRoundedIcon sx={{ color: "black", marginRight: '15px' }} />
                    <input
                        type="text"
                        placeholder="Search"
                        value={input}
                        onChange={(e) => handleChange(e.target.value)}
                        style={{
                            border: 'none',
                            outline: 'none',
                            width: '100%',
                        }}
                    />
                </div>
            </div>
            <div className="input-wrapper" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', height: "50%", 
                                                    paddingTop: '200px', minHeight: "500px", marginBottom: 40 }}>
                {posts.length > 0 && (
                    posts.map((post) => (
                        <Post 
                        postID={post._id} 
                        authorID={post.author} 
                        text={post.text} 
                        comments={post.comment}
                        tags={post.tags} 
                        likeCount={post.likes}
                        date={post.date}
                        />
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
                                        likeCount={userPost.likes}
                                        date={userPost.date}
                                    />
                                ))
                            ) : (
                                <p>No posts exist for @{user.username}.</p>
                            )}
                        </div>
                    ))
                )}
                {posts.length === 0 && users.length === 0 && input !== "" &&

                    <div style={{marginTop: 5}}>
                        Sorry, we can't find anything related to "{input}". Try searching something else.
                    </div>
                }
            </div>
        </>
    );
}


export default Search;
