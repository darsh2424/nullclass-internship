import React, { useState } from "react";
import "./Posts.css";
import { Avatar } from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt"; 
import PersonRemoveIcon from "@mui/icons-material/PersonRemove"; 

const Posts = ({ p, currentUserId, loggedInUsername, handleFollow }) => {
  const { name, username, photo, post: content, profileImage, _id, likes = [], followers = [] } = p;

  const [likeList, setLikeList] = useState(likes);
  const likedByUser = likeList.includes(currentUserId);
  const isOwnPost = username === loggedInUsername;
  const [isFollowing, setIsFollowing] = useState(followers.includes(currentUserId));

  const toggleLike = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/like`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: currentUserId, postId: _id }),
      });

      if (res.ok) {
        setLikeList((prev) =>
          likedByUser ? prev.filter((id) => id !== currentUserId) : [...prev, currentUserId]
        );
      }
    } catch (err) {
      console.error("Failed to toggle like", err);
    }
  };

  const toggleFollow = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/follow`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentUserId: currentUserId, targetUserId: username }),
      });

      if (res.ok) {
        setIsFollowing((prev) => !prev);
      }
    } catch (err) {
      console.error("Follow toggle failed", err);
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
                @{username}
                {!isOwnPost && (
                  <span onClick={toggleFollow} className="follow-icon">
                    {isFollowing ? (
                      <PersonRemoveIcon fontSize="small" titleAccess="Unfollow" />
                    ) : (
                      <PersonAddAltIcon fontSize="small" titleAccess="Follow" />
                    )}
                    Follow
                  </span>
                )}
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
              className="post__footer__icon liked"
              fontSize="small"
              style={{ color: "red" }}
              onClick={toggleLike}
            />
          ) : (
            <FavoriteBorderIcon
              className="post__footer__icon"
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
