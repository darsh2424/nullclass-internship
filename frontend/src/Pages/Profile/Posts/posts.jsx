import React, { useState } from 'react';
import { Avatar } from "@mui/material";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import RepeatIcon from "@mui/icons-material/Repeat";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import PublishIcon from "@mui/icons-material/Publish";
import './Posts.css';
import useLoggedinuser from "../../../hooks/useLoggedinuser";

const Posts = ({ p }) => {
  const { name, username, photo, post, profileImage, _id, likes = [] } = p;
  const [loggedinuser] = useLoggedinuser(); 

  const userId = loggedinuser?._id;

  const [likeList, setLikeList] = useState(likes);
  const likedByUser = likeList.includes(userId);

  const toggleLike = async () => {
    try {
      const res = await fetch("http://localhost:5000/like", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, postId: _id }),
      });

      if (res.ok) {
        setLikeList((prev) =>
          likedByUser ? prev.filter((id) => id !== userId) : [...prev, userId]
        );
      }
    } catch (error) {
      console.error("Like toggle failed:", error);
    }
  };

  return (
    <div className="post">
      <div className="post__avatar">
        <Avatar src={profileImage} />
      </div>
      <div className="post__body">
        <div className="post__header">
          <div className="post__headerText">
            <h3>
              {name}{" "}
              <span className="post__headerSpecial">
                <VerifiedUserIcon className="post__badge" /> @{username}
              </span>
            </h3>
          </div>
          <div className="post__headerDescription">
            <p>{post}</p>
          </div>
        </div>
        {photo && <img src={photo} alt="" width="500" />}
        <div className="post__footer">
          <ChatBubbleOutlineIcon className="post__fotter__icon" fontSize="small" />
          <RepeatIcon className="post__fotter__icon" fontSize="small" />
          {likedByUser ? (
            <FavoriteIcon
              className="post__fotter__icon liked"
              fontSize="small"
              onClick={toggleLike}
              style={{ color: 'red' }}
            />
          ) : (
            <FavoriteBorderIcon
              className="post__fotter__icon"
              fontSize="small"
              onClick={toggleLike}
            />
          )}
          <span className="like-count">{likeList.length}</span>
        </div>
      </div>
    </div>
  );
};

export default Posts;
