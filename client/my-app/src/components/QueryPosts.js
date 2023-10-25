import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const QueryPosts = () => {
  const { query } = useParams();
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const response = await fetch(`http://localhost:3001/search/posts?q=${query}`);
      const data = await response.json();
      setPosts(data);
    };
    
    fetchPosts();
  }, [query]);

  return (
    <div>
      {posts.map((post, index) => (
        <div key={index}>
          {/* How do I display the relevant posts? */}
        </div>
      ))}
    </div>
  );
};

export default QueryPosts;
