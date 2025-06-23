import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import MyLocationIcon from "@mui/icons-material/MyLocation";
import AddLinkIcon from "@mui/icons-material/AddLink";
import Post from "./Posts/posts";
import "./UserProfile.css";
import Sidebar from "../Sidebar/sidebar";
import Widgets from "../Widgets/Widgets";
import useLoggedinuser from "../../hooks/useLoggedinuser";

const UserProfile = () => {
    const { username } = useParams();
    const navigate = useNavigate();

    const [profileUser, setProfileUser] = useState(null);
    const [posts, setPosts] = useState([]);
    const [loggedinuser] = useLoggedinuser();
    useEffect(() => {
        fetch(`${import.meta.env.VITE_BACKEND_URL}/user/${username}`)
            .then((res) => res.json())
            .then((data) => {
                setProfileUser(data)
                // console.log(data)
            });
    }, [username]);
    useEffect(() => {
        if (!profileUser?.email) return;
        fetch(`${import.meta.env.VITE_BACKEND_URL}/userpost?email=${profileUser.email}`)
            .then((res) => res.json())
            .then((data) => {
                setPosts(data)
                // console.log(data)
            });
    }, [profileUser?.email]);

    if (!profileUser) return <p>Loading...</p>;

    return (
        <>
            <Sidebar />
            <div className="profilePage">
                <ArrowBackIcon className="arrow-icon" onClick={() => navigate("/home/feed")} />
                <h4 className="heading-4">@{username}</h4>

                <div className="mainprofile">
                    <div className="profile-bio">
                        {/* Cover Image */}
                        <div className="coverImageContainer">
                            <img
                                src={
                                    profileUser.coverimage
                                        ? profileUser.coverimage
                                        : `https://ui-avatars.com/api/?name=${username}&background=random`
                                }
                                alt="Cover"
                                className="coverImage"
                            />
                        </div>

                        {/* Avatar and Basic Info */}
                        <div className="avatar-img">
                            <div className="avatarContainer">
                                <img
                                    src={
                                        profileUser.profileImage
                                            ? profileUser.profileImage
                                            : `https://ui-avatars.com/api/?name=${username}&background=random`
                                    }
                                    alt="Avatar"
                                    className="avatar"
                                />
                            </div>

                            <div className="userInfo">
                                <h3 className="heading-3">{profileUser.name || "Unnamed"}</h3>
                                <p className="usernameSection">@{profileUser.username}</p>
                            </div>
                            <div style={
                                    {
                                        display: "flex"
                                    }
                                }>
                                    <p className="usernameSection">Followers : {profileUser?.followers.length ?? 0}</p>
                                    <p className="usernameSection">Followings : {profileUser?.followings.length ?? 0}</p>
                                </div>

                            {/* Bio and Links */}
                            <div className="infoContainer">
                                {profileUser.bio && <p className="bio">{profileUser.bio}</p>}

                                <div className="locationAndLink">
                                    {profileUser.location && (
                                        <p className="subInfo">
                                            <MyLocationIcon /> {profileUser.location}
                                        </p>
                                    )}
                                    {profileUser.website && (
                                        <p className="subInfo link">
                                            <AddLinkIcon /> {profileUser.website}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <h4 className="tweetsText">Tweets</h4>
                            <hr />
                        </div>

                        {/* Posts Section */}
                        {loggedinuser && posts.map((p) => (
                            <Post
                                key={p._id}
                                p={p}
                                currentUserId={profileUser._id}
                                loggedinUser={loggedinuser}
                            />
                        ))}
                    </div>
                </div>
            </div>
            <Widgets />
        </>
    );
};

export default UserProfile;
