import React, { useState, useEffect } from "react";
import Post from "../Posts/posts";
import { useNavigate } from "react-router-dom";
import "./Mainprofile.css";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CenterFocusWeakIcon from "@mui/icons-material/CenterFocusWeak";
import LockResetIcon from "@mui/icons-material/LockReset";
import MyLocationIcon from "@mui/icons-material/MyLocation";
import AddLinkIcon from "@mui/icons-material/AddLink";
import Editprofile from "../Editprofile/Editprofile";
import axios from "axios";
import useLoggedinuser from "../../../hooks/useLoggedinuser";
import AvatarModal from "../Avatar/AvatarModal";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { Box, CircularProgress } from "@mui/material";

const Mainprofile = () => {
  const navigate = useNavigate();
  const [isloading, setisloading] = useState(false);
  const [loggedinuser, setLoggedinuser, loading, setUserDetails] = useLoggedinuser();
  const [post, setpost] = useState([]);
  const [avatarModalOpen, setAvatarModalOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const isMenuOpen = Boolean(anchorEl);

  const email = loggedinuser?.email;

  useEffect(() => {
    if (email) {
      fetch(`http://localhost:5000/userpost?email=${email}`)
        .then((res) => res.json())
        .then((data) => {
          setpost(data);
        });
    }
  }, [email]);

  const handleuploadcoverimage = (e) => {
    setisloading(true);
    const image = e.target.files;
    const formData = new FormData();
    formData.set("image", image);
    axios
      .post(
        "https://api.imgbb.com/1/upload?key=b0ea2f6cc0f276633b2a8a86d2c43335",
        formData
      )
      .then((res) => {
        const url = res.data.data.display_url;
        const usercoverimage = {
          email,
          coverimage: url,
        };
        setisloading(false);
        if (url) {
          fetch(`http://localhost:5000/userupdate/${email}`, {
            method: "PATCH",
            headers: {
              "content-type": "application/json",
            },
            body: JSON.stringify(usercoverimage),
          })
            .then((res) => res.json())
            .then(() => {
              return fetch(`http://localhost:5000/user?email=${loggedinuser?.email}`);
            })
            .then((res) => res.json())
            .then((data) => {
              const updatedUser = Array.isArray(data) ? data[0] : data;
              if (updatedUser) {
                alert("Profile updated successfully!");
                setUserDetails(updatedUser);
                setLoggedinuser(updatedUser);
              }
            });
        }
      })
      .catch((e) => {
        console.log(e);
        alert("Upload failed");
        setisloading(false);
      });
  };

  const handleuploadprofileimage = (e) => {
    setisloading(true);
    const image = e.target.files;
    const formData = new FormData();
    formData.set("image", image);
    axios
      .post(
        "https://api.imgbb.com/1/upload?key=b0ea2f6cc0f276633b2a8a86d2c43335",
        formData
      )
      .then((res) => {
        const url = res.data.data.display_url;
        const userprofileimage = {
          email,
          profileImage: url,
        };
        setisloading(false);
        if (url) {
          fetch(`http://localhost:5000/userupdate/${email}`, {
            method: "PATCH",
            headers: {
              "content-type": "application/json",
            },
            body: JSON.stringify(userprofileimage),
          })
            .then((res) => res.json())
            .then(() => {
              return fetch(`http://localhost:5000/user?email=${loggedinuser?.email}`);
            })
            .then((res) => res.json())
            .then((data) => {
              const updatedUser = Array.isArray(data) ? data[0] : data;
              if (updatedUser) {
                alert("Profile updated successfully!");
                setUserDetails(updatedUser);
                setLoggedinuser(updatedUser);
              }
            });
        }
      })
      .catch((e) => {
        console.log(e);
        alert("Upload failed");
        setisloading(false);
      });
  };

  const handleProfileClick = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleRemovePhoto = () => {
    fetch(`http://localhost:5000/userupdate/${email}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ profileImage: null }),
    })
      .then((res) => res.json())
      .then(() => {
        return fetch(`http://localhost:5000/user?email=${loggedinuser?.email}`);
      })
      .then((res) => res.json())
      .then((data) => {
        const updatedUser = Array.isArray(data) ? data[0] : data;
        if (updatedUser) {
          alert("Profile updated successfully!");
          setUserDetails(updatedUser);
          setLoggedinuser(updatedUser);
        }
      });
    handleMenuClose();
  };

  const handleAvatarSelect = (url) => {
    fetch(`http://localhost:5000/userupdate/${email}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ profileImage: url }),
    })
      .then((res) => res.json())
      .then(() => {
        return fetch(`http://localhost:5000/user?email=${loggedinuser?.email}`);
      })
      .then((res) => res.json())
      .then((data) => {
        const updatedUser = Array.isArray(data) ? data[0] : data;
        if (updatedUser) {
          alert("Profile updated successfully!");
          setUserDetails(updatedUser);
          setLoggedinuser(updatedUser);
        }
      });
  };

  if (loading || !loggedinuser) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: 300,
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  const username = loggedinuser?.username;

  return (
    <div>
      <ArrowBackIcon className="arrow-icon" onClick={() => navigate("/")} />
      <h4 className="heading-4">{username}</h4>
      <div className="mainprofile">
        <div className="profile-bio">
          <div>
            {/* Cover Image */}
            <div className="coverImageContainer">
              <img
                src={
                  loggedinuser?.coverimage
                    ? loggedinuser.coverimage
                    : `https://ui-avatars.com/api/?name=${username}&background=random`
                }
                alt=""
                className="coverImage"
              />
              <div className="hoverCoverImage">
                <div className="imageIcon_tweetButton">
                  <label htmlFor="image" className="imageIcon">
                    {isloading ? (
                      <LockResetIcon className="photoIcon photoIconDisabled" />
                    ) : (
                      <CenterFocusWeakIcon className="photoIcon" />
                    )}
                  </label>
                  <input
                    type="file"
                    id="image"
                    className="imageInput"
                    onChange={handleuploadcoverimage}
                  />
                </div>
              </div>
            </div>

            {/* Avatar */}
            <div className="avatar-img">
              <div className="avatarContainer">
                <img
                  src={
                    loggedinuser?.profileImage
                      ? loggedinuser.profileImage
                      : `https://ui-avatars.com/api/?name=${username}&background=random`
                  }
                  alt=""
                  className="avatar"
                  onClick={handleProfileClick}
                />
                <Menu anchorEl={anchorEl} open={isMenuOpen} onClose={handleMenuClose}>
                  <MenuItem>
                    <label htmlFor="uploadPhotoInput" className="menu-label">
                      Choose Photo from Device
                    </label>
                    <input
                      type="file"
                      id="uploadPhotoInput"
                      accept="image/*"
                      onChange={(e) => {
                        handleuploadprofileimage(e);
                        handleMenuClose();
                      }}
                      style={{ display: "none" }}
                    />
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      setAvatarModalOpen(true);
                      handleMenuClose();
                    }}
                  >
                    Select Avatar
                  </MenuItem>
                  <MenuItem onClick={handleRemovePhoto}>Remove Photo</MenuItem>
                </Menu>
              </div>

              <div className="userInfo">
                <div>
                  <h3 className="heading-3">{loggedinuser?.name || ""}</h3>
                  <p className="usernameSection">@{loggedinuser?.username || ""}</p>
                </div>
                <Editprofile loggedinuser={loggedinuser} setLoggedinuser={setLoggedinuser} handleProfileClick={handleProfileClick} />
              </div>

              {/* Bio, Location, Website */}
              <div className="infoContainer">
                <p className="bio">{loggedinuser.bio}</p>
                <div className="locationAndLink">
                  {loggedinuser.location && (
                    <p className="subInfo">
                      <MyLocationIcon /> {loggedinuser.location}
                    </p>
                  )}
                  {loggedinuser.website && (
                    <p className="subInfo link">
                      <AddLinkIcon /> {loggedinuser.website}
                    </p>
                  )}
                </div>
              </div>


              <h4 className="tweetsText">Tweets</h4>
              <hr />
            </div>

            {/* Posts */}
            {post.map((p) => (
              <Post key={p._id} p={p} />
            ))}
          </div>
        </div>
      </div>

      <AvatarModal
        open={avatarModalOpen}
        onClose={() => setAvatarModalOpen(false)}
        onSelect={handleAvatarSelect}
      />
    </div>
  );
};

export default Mainprofile;
