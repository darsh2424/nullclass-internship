import React, { useEffect, useState } from "react";
import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  TextField,
  Typography
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import useLoggedinuser from "../../hooks/useLoggedinuser";
import './Explore.css';
import "../pages.css"
const Explore = () => {
  const [popularUsers, setPopularUsers] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [loggedinuser] = useLoggedinuser();
  const [followStatus, setFollowStatus] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${process.env.REACT_APP_BACKEND_URL}/popular-users`)
      .then((res) => res.json())
      .then((data) => {
        setPopularUsers(data);
        const statusMap = {};
        data.forEach((user) => {
          statusMap[user.username] = loggedinuser?.followings?.includes(user._id);
        });
        setFollowStatus(statusMap);
      });
  }, [loggedinuser]);

  const handleSearch = () => {
    if (!query.trim()) return;

    setLoading(true);
    fetch(`${process.env.REACT_APP_BACKEND_URL}/search-users?q=${query}`)
      .then((res) => res.json())
      .then((data) => {
        setSearchResults(data);
        const statusMap = {};
        data.forEach((user) => {
          statusMap[user.username] = loggedinuser?.followings?.includes(user._id);
        });
        setFollowStatus(statusMap);
        setLoading(false);
      });
  };

  const handleFollowToggle = async (username, isFollowing) => {
    const endpoint = isFollowing ? "/unfollow" : "/follow";
    try {
      const baseUrl = process.env.REACT_APP_BACKEND_URL?.replace(/\/$/, '');
      const path = endpoint?.replace(/^\//, '');
      const url = `${baseUrl}/${path}`;
      const res = await fetch(url, {
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
    const isFollowing = followStatus[user.username];
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
        {
          (user.username !== loggedinuser?.username)
            ? <Button
              variant={isFollowing ? "outlined" : "contained"}
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                handleFollowToggle(user.username, isFollowing);
              }}
            >
              {isFollowing ? "Unfollow" : "Follow"}
            </Button>
            : ""
        }
      </Box>
    );
  };

  return (
    <div className="profilePage">
      <Box marginTop={5} marginLeft={5}>
        <Box display="flex" gap={2} marginBottom={2}>
          <TextField
            fullWidth
            placeholder="Search by name or username"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSearchResults([]);
            }}
          />
          <Button variant="contained" onClick={handleSearch}>
            Search
          </Button>
        </Box>
        {loading && <CircularProgress />}
        {!query && popularUsers.length > 0 && (
          <>
            <Typography variant="h6" gutterBottom>
              Suggested Users
            </Typography>
            {popularUsers.map(renderUserCard)}
          </>
        )}
        {query && searchResults.length > 0 && (
          <>
            <Typography variant="h6" gutterBottom>
              Search Results
            </Typography>
            {searchResults.map(renderUserCard)}
          </>
        )}
      </Box>
    </div>
  );
}

export default Explore