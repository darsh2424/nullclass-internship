import React, { useState } from "react";
import TwitterIcon from "@mui/icons-material/Twitter";
import HomeIcon from "@mui/icons-material/Home";
import SearchIcon from "@mui/icons-material/Search";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import ListAltIcon from "@mui/icons-material/ListAlt";
import PermIdentityIcon from "@mui/icons-material/PermIdentity";
import MoreIcon from "@mui/icons-material/More";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import Divider from "@mui/material/Divider";
import DoneIcon from "@mui/icons-material/Done";
import Button from "@mui/material/Button";
import ListItemIcon from "@mui/material/ListItemIcon";
import { Avatar, Box, CircularProgress, IconButton, Menu, MenuItem } from "@mui/material";
import "./sidebar.css";
import Customlink from "./Customlink";
import Sidebaroption from "./Sidebaroption";
import { useNavigate } from "react-router-dom";
import useLoggedinuser from "../../hooks/useLoggedinuser";

const Sidebar = ({ handlelogout, user }) => {
  const [anchorE1, setanchorE1] = useState(null);
  const openmenu = Boolean(anchorE1);
  const [loggedinuser, setLoggedinuser, loading, setUserDetails] = useLoggedinuser();
  const navigate = useNavigate();
  const handleclick = (e) => {
    setanchorE1(e.currentTarget);
  };
  const handleclose = () => {
    setanchorE1(null);
  };
  
  const result = loggedinuser?.username;

  return (
    <div className="sidebar">
      <TwitterIcon className="sidebar__twitterIcon" />
      <Customlink to="/home/feed">
        <Sidebaroption active Icon={HomeIcon} text="Home" />
      </Customlink>
      <Customlink to="/home/explore">
        <Sidebaroption Icon={SearchIcon} text="Explore" />
      </Customlink>
      <Customlink to="/home/notification">
        <Sidebaroption Icon={NotificationsNoneIcon} text="My Followings" />
      </Customlink>
      <Customlink to="/home/profile">
        <Sidebaroption Icon={PermIdentityIcon} text="Profile" />
      </Customlink>
      <Customlink to="/home/feed">
        <Button variant="outlined" className="sidebar__tweet" fullWidth>
          Tweet
        </Button>
      </Customlink>

      {loading ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: 100,
          }}
        >
          <CircularProgress size={24} />
        </Box>
      ) : (
        <div className="Profile__info">
          <Avatar
            src={
              loggedinuser?.profileImage
                ? loggedinuser.profileImage
                : `https://ui-avatars.com/api/?name=${result}&background=random`
            }
          />
          <div className="user__info">
            <h4>
              {loggedinuser?.name
                ? loggedinuser.name
                : user?.displayName || ""}
            </h4>
            <h5>@{result}</h5>
          </div>
          <IconButton
            size="small"
            sx={{ ml: 2 }}
            aria-controls={openmenu ? "basic-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={openmenu ? "true" : undefined}
            onClick={handleclick}
          >
            <MoreHorizIcon />
          </IconButton>
          <Menu
            id="basic-menu"
            anchorEl={anchorE1}
            open={openmenu}
            onClick={handleclose}
            onClose={handleclose}
          >
            <MenuItem
              className="Profile__info1"
              onClick={() => navigate("/home/profile")}
            >
              <Avatar
                src={
                  loggedinuser?.profileImage
                    ? loggedinuser?.profileImage
                    : `https://ui-avatars.com/api/?name=${result}&background=random`
                }
              />
              <div className="user__info subUser__info">
                <div>
                  <h4>{loggedinuser?.name}</h4>
                  <h5>@{result}</h5>
                </div>
                <ListItemIcon className="done__icon" color="blue">
                  <DoneIcon />
                </ListItemIcon>
              </div>
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleclose}>Add an existing account</MenuItem>
            <MenuItem onClick={handlelogout}>Log out @{result}</MenuItem>
          </Menu>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
