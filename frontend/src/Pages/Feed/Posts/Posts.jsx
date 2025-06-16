import React, { useState } from "react";
import "./Posts.css";
import { Avatar } from "@mui/material";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";

const Posts = ({ p, currentUserId }) => {
  const { name, username, photo, post: content, profileImage, _id, likes = [] } = p;

  const [likeList, setLikeList] = useState(likes);
  const likedByUser = likeList.includes(currentUserId);

  const toggleLike = async () => {
    try {
      const res = await fetch("http://localhost:5000/like", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: currentUserId, postId: _id }),
      });

      if (res.ok) {
        setLikeList((prev) =>
          likedByUser
            ? prev.filter((id) => id !== currentUserId)
            : [...prev, currentUserId]
        );
      }
    } catch (err) {
      console.error("Failed to toggle like", err);
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
            <p>{content}</p>
          </div>
        </div>
        {photo && <img src={photo} alt="" width="500" />}
        <div className="post__footer">
          {likedByUser ? (
            <FavoriteIcon
              className="post__fotter__icon liked"
              fontSize="small"
              style={{ color: "red" }}
              onClick={toggleLike}
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
