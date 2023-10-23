import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';


const Search= () => {
    const [input, setInput] = useState("");
    const [posts, setPosts] = useState([]);
    const [users, setUsers] = useState([]);

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
      
        } catch (error) {
          console.error("Error fetching data:", error);
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
            {posts.length > 0 && 
                <Link to={`google.com/${input}`}>See all posts related to {input}</Link> // TODO: Change this to the correct link
                //<Link to={`/posts/${input}`}>See all posts related to {input}</Link> // Link to relevant posts if more than one post is found to match current input
            }
            {users.map(user => (
                <div key={user.id}> 
                    {user.name} (@{user.username}) 
                </div>
            ))}
            {posts.length === 0 && users.length === 0 && input !== "" &&
                <div>
                    Sorry, we can't find anything related to {input}. Try searching something else. 
                </div>
            }
        </div>
    );
}


export default Search;
