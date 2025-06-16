import React, { useEffect, useState } from "react";
import "./Feed.css";
import Posts from "./Posts/Posts";
import Tweetbox from "./Tweetbox/Tweetbox";
import useLoggedinuser from "../../hooks/useLoggedinuser";
const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [loggedinsuer]=useLoggedinuser();

  useEffect(() => {
     fetch("http://localhost:5000/post")
        .then((res) => res.json())
        .then((data) => setPosts(data));
  }, []);

  return (
    <div className="feed">
      <div className="feed__header">
        <h2>Home</h2>
      </div>
      <Tweetbox />
      {posts.map((p) => (
        <Posts key={p._id} p={p} currentUserId={loggedinsuer?._id} />
      ))}
    </div>
  );
};

export default Feed;
