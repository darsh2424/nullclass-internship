import React, { useEffect, useState } from "react";
import "./Feed.css";
import Posts from "./Posts/Posts";
import Tweetbox from "./Tweetbox/Tweetbox";
import useLoggedinuser from "../../hooks/useLoggedinuser";
const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [loggedinsuer] = useLoggedinuser();

  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/post`)
      .then((res) => res.json())
      .then((data) => setPosts(data));
  }, []);

  const handleNewPost = (newPost) => {
    setPosts((prevPosts) => [newPost, ...prevPosts]); 
  };

  return (
    <div className="feed">
      <div className="feed__header">
        <h2>Home</h2>
      </div>
      <Tweetbox onNewPost={handleNewPost} />
      {loggedinsuer && posts.map((p) => (
        <Posts key={p._id} p={p} currentUserId={loggedinsuer?._id} loggedInUsername={loggedinsuer?.username} />
      ))}
    </div>
  );
};

export default Feed;
