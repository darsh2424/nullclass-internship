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
import { IconButton } from "@mui/material";


const Mainprofile = ({ user }) => {
  const navigate = useNavigate();
  const [isloading, setisloading] = useState(false);
  const [loggedinuser] = useLoggedinuser();
  const username = user?.email?.split("@")[0];
  const [post, setpost] = useState([]);
  const [avatarModalOpen, setAvatarModalOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const isMenuOpen = Boolean(anchorEl);

  useEffect(() => {
    fetch(`http://localhost:5000/userpost?email=${user?.email}`)
      .then((res) => res.json())
      .then((data) => {
        setpost(data);
      });
  }, [user.email]);

  const handleuploadcoverimage = (e) => {
    setisloading(true);
    const image = e.target.files[0];
    // console.log(image)
    const formData = new FormData();
    formData.set("image", image);
    axios
      .post(
        "https://api.imgbb.com/1/upload?key=b0ea2f6cc0f276633b2a8a86d2c43335",
        formData
      )
      .then((res) => {
        const url = res.data.data.display_url;
        // console.log(res.data.data.display_url);
        const usercoverimage = {
          email: user?.email,
          coverimage: url,
        };
        setisloading(false);
        if (url) {
          fetch(`http://localhost:5000/userupdate/${user?.email}`, {
            method: "PATCH",
            headers: {
              "content-type": "application/json",
            },
            body: JSON.stringify(usercoverimage),
          })
            .then((res) => res.json())
            .then((data) => {
              // console.log("done", data);
              alert("Success!")
            });
        }
      })
      .catch((e) => {
        console.log(e);
        window.alert(e);
        setisloading(false);
      });
  };
  const handleuploadprofileimage = (e) => {
    setisloading(true);
    const image = e.target.files[0];
    // console.log(image)
    const formData = new FormData();
    formData.set("image", image);
    axios
      .post(
        "https://api.imgbb.com/1/upload?key=b0ea2f6cc0f276633b2a8a86d2c43335",
        formData
      )
      .then((res) => {
        const url = res.data.data.display_url;
        // console.log(res.data.data.display_url);
        const userprofileimage = {
          email: user?.email,
          profileImage: url,
        };
        setisloading(false);
        if (url) {
          fetch(`http://localhost:5000/userupdate/${user?.email}`, {
            method: "PATCH",
            headers: {
              "content-type": "application/json",
            },
            body: JSON.stringify(userprofileimage),
          })
            .then((res) => res.json())
            .then((data) => {
              // console.log("done", data);
            alert("Success!")
            });
        }
      })
      .catch((e) => {
        console.log(e);
        window.alert(e);
        setisloading(false);
      });
  };
  const handleProfileClick = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleRemovePhoto = () => {
    fetch(`http://localhost:5000/userupdate/${user?.email}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ profileImage: null }),
    }).then((res) => res.json())
      .then(() => {
        window.location.reload(); 
      });
    handleMenuClose();
  };

  const handleAvatarSelect = (url) => {
    fetch(`http://localhost:5000/userupdate/${user?.email}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ profileImage: url }),
    }).then((res) => res.json())
      .then(() => {
        window.location.reload(); 
      });
  };

  return (
    <div>
      <ArrowBackIcon className="arrow-icon" onClick={() => navigate("/")} />
      <h4 className="heading-4">{username}</h4>
      <div className="mainprofile">
        <div className="profile-bio">
          {
            <div>
              <div className="coverImageContainer">
                <img
                  src={
                    loggedinuser[0]?.coverimage
                      ? loggedinuser[0].coverimage
                      : user && user.photoURL
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
              <div className="avatar-img">
                <div className="avatarContainer">
                  <img
                    src={
                      loggedinuser[0]?.profileImage
                        ? loggedinuser[0].profileImage
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
                    <h3 className="heading-3">
                      {loggedinuser[0]?.name
                        ? loggedinuser[0].name
                        : user && user.displayname}
                    </h3>
                    <p className="usernameSection">@{username}</p>
                  </div>
                  <Editprofile user={user} loggedinuser={loggedinuser} handleProfileClick={handleProfileClick} />
                </div>
                <div className="infoContainer">
                  {loggedinuser[0]?.bio ? <p>{loggedinuser[0].bio}</p> : ""}
                  <div className="locationAndLink">
                    {loggedinuser[0]?.location ? (
                      <p className="suvInfo">
                        <MyLocationIcon /> {loggedinuser[0].location}
                      </p>
                    ) : (
                      ""
                    )}
                    {loggedinuser[0]?.website ? (
                      <p className="subInfo link">
                        <AddLinkIcon /> {loggedinuser[0].website}
                      </p>
                    ) : (
                      ""
                    )}
                  </div>
                </div>
                <h4 className="tweetsText">Tweets</h4>
                <hr />
              </div>
              {post.map((p) => (
                <Post p={p} />
              ))}
            </div>
          }
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
