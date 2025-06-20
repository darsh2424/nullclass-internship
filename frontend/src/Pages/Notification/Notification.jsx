import React, { useEffect, useState } from "react";
import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  Typography
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import useLoggedinuser from "../../hooks/useLoggedinuser";
import "../pages.css";

const Notification = () => {
  const [loading, setLoading] = useState(false);
  const [loggedinuser] = useLoggedinuser();
  const [followings, setFollowings] = useState([]);
  const [followStatus, setFollowStatus] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFollowings = async () => {
      if (!loggedinuser?.followings?.length) return;

      setLoading(true);
      const users = [];

      for (const userId of loggedinuser.followings) {
        try {
          const res = await fetch(`http://localhost:5000/userWithId/${userId}`);
          const data = await res.json();

          if (!res.ok) {
            console.warn("User fetch failed:", data.error || res.status);
            continue;
          }

          users.push(data);
        } catch (err) {
          console.error("Fetch error:", err);
        }
      }
      setFollowings(users);
      setFollowStatus(() =>
        users.reduce((acc, user) => {
          acc[user.username] = loggedinuser?.followings?.includes(user._id);
          return acc;
        }, {})
      );
      setLoading(false);
    };

    fetchFollowings();

  }, [loggedinuser]);

  const handleFollowToggle = async (username, isFollowing) => {
    const endpoint = isFollowing ? "/unfollow" : "/follow";
    try {
      const res = await fetch(`http://localhost:5000${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentUsername: loggedinuser?.username,
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


  const renderUserCard = (user) => {
    const isFollowing = loggedinuser?.followings?.includes(user._id);
    return (
      <Box
        key={user._id}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          border: "1px solid #ccc",
          padding: 2,
          borderRadius: 2,
          marginBottom: 1,
          cursor: "pointer",
        }}
        onClick={() => navigate(`/home/user/${user.username}`)}
      >
        <Box display="flex" alignItems="center" gap={2}>
          <Avatar src={user.profileImage || `https://ui-avatars.com/api/?name=${user.username}`} />
          <Box>
            <Typography fontWeight="bold">{user.name}</Typography>
            <Typography color="gray">@{user.username}</Typography>
          </Box>
        </Box>
        {(user.username !== loggedinuser?.username) && (
          <Button
            variant={followStatus[user.username] ? "outlined" : "contained"}
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              handleFollowToggle(user.username, followStatus[user.username]);
            }}
          >
            {followStatus[user.username] ? "Following" : "Follow"}
          </Button>
        )}
      </Box>
    );
  };

  return (
    <div className="profilePage">
      <Box marginTop={5} marginLeft={5}>
        {loading && <CircularProgress />}
        {!loading && followings.length > 0 && (
          <>
            <Typography variant="h6" gutterBottom>
              Total Followings : {loggedinuser?.followings.length}
            </Typography>
            {followings.map(renderUserCard)}
          </>
        )}
        {!loading && followings.length === 0 && (
          <Typography>No followings found.</Typography>
        )}
      </Box>
    </div>
  );
};

export default Notification;
