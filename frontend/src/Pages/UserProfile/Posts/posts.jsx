import React, { useState } from "react";
import "./Posts.css";
import { Avatar, Button } from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";

const Posts = ({ p, currentUserId, loggedinUser, handleFollow }) => {
  const { name, username, photo, post: content, profileImage, _id, likes = [], followers = [] } = p;

  const [likeList, setLikeList] = useState(likes);
  const likedByUser = likeList.includes(loggedinUser._id);
  const isOwnPost = username === loggedinUser.username;
  const [isFollowing, setIsFollowing] = useState(followers.includes(loggedinUser._id));

  const toggleLike = async () => {
    try {
      const res = await fetch("http://localhost:5000/like", {
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

  const toggleFollow = async (username, isFollowing) => {
    const endpoint = isFollowing ? "/unfollow" : "/follow";
    try {
      const res = await fetch(`http://localhost:5000${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentUsername: loggedinUser.username,
          targetUsername: username,
        }),
      });

      if (res.ok) {
        setFollowStatus((prev) => ({
          ...prev,
          [username]: !isFollowing,
        }));
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
                  <Button
                    variant={isFollowing ? "outlined" : "contained"}
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFollow();
                    }}
                  >
                    {isFollowing ? "Unfollow" : "Follow"}
                  </Button>
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
