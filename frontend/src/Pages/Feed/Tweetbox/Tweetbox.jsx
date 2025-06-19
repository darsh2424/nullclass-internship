import React, { useEffect, useState } from "react";
import "./Tweetbox.css";
import { Avatar, Button } from "@mui/material";
import AddPhotoAlternateOutlinedIcon from "@mui/icons-material/AddPhotoAlternateOutlined";
import axios from "axios";
import { useUserAuth } from "../../../context/UserAuthContext";
import useLoggedinuser from "../../../hooks/useLoggedinuser";

const Tweetbox = ({ onNewPost }) => {
  const { user } = useUserAuth();
  const [loggedinsuer] = useLoggedinuser();
  const [post, setpost] = useState("");
  const [imageurl, setimageurl] = useState("");
  const [isloading, setisloading] = useState(false);
  const [name, setname] = useState("");
  const [username, setusername] = useState(loggedinsuer?.email.split("@")[0]);
  const [canPost, setCanPost] = useState(true);
  const [denyReason, setDenyReason] = useState("");
  const email = loggedinsuer?.email;

  useEffect(() => {
    setusername(email?.split("@")[0]);
  }, [email]);

  const userprofilepic = loggedinsuer?.profileImage
    ? loggedinsuer.profileImage
    : `https://ui-avatars.com/api/?name=${username}&background=random`;


  useEffect(() => {
    const fetchCanPost = async () => {
      if (!loggedinsuer?._id) return;
      try {
        const res = await fetch(`http://localhost:5000/can-post?userId=${loggedinsuer._id}`);
        const data = await res.json();
        // setCanPost(data.canPost);
        setDenyReason(data.reason);
      } catch (err) {
        console.error("Permission check error:", err);
      }
    };
    fetchCanPost();
  }, [loggedinsuer]);

  const handleuploadimage = (e) => {
    if (!canPost) return;
    setisloading(true);
    const image = e.target.files[0];
    const formData = new FormData();
    formData.set("image", image);
    axios
      .post(
        "https://api.imgbb.com/1/upload?key=03b3c3cff81e3abde35b31e2220a26a0",
        formData
      )
      .then((res) => {
        setimageurl(res.data.data.display_url);
        setisloading(false);
      })
      .catch((e) => {
        console.log(e);
        setisloading(false);
      });
  };

  const handletweet = async (e) => {
    e.preventDefault();
    if (!canPost) return;

    try {
      let finalName = "";
      let finalUsername = "";

      if (user?.providerData?.[0]?.providerId === "password") {

        const res = await fetch(`http://localhost:5000/loggedinuser?email=${email}`);
        const data = await res.json();

        finalName = data?.name;
        finalUsername = data?.username;

        if (!finalName || !finalUsername) {
          alert("Could not fetch user details");
          return;
        }
      } else {
        finalName = loggedinsuer?.name || "";
        finalUsername = email?.split("@")[0] || "";
      }

      // Validate essentials before posting
      if (!finalName || !finalUsername || !loggedinsuer?._id || !post.trim()) {
        alert("Missing post content or user information.");
        return;
      }

      // Compose the post
      const userpost = {
        profileImage: userprofilepic,
        post: post,
        photo: imageurl,
        username: finalUsername,
        name: finalName,
        email: email,
        userId: loggedinsuer._id,
      };

      // Clear input state
      setpost("");
      setimageurl("");

      // Send to backend
      const postRes = await fetch("http://localhost:5000/post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userpost),
      });

      const result = await postRes.json().catch(() => null);

      if (!postRes.ok) {
        console.error("Post failed:", result?.error || "Unknown error");
        alert(result?.error || "Failed to post.");
      } else {
        console.log("Post created:", result.message);
        if (onNewPost && typeof onNewPost === "function") {
          onNewPost(result.post);
        }
      }
    } catch (err) {
      console.error("Tweet error:", err);
      alert("Something went wrong while posting.");
    }
  };


  return (
    <div className="tweetBox">
      {denyReason && (
        <div style={{ color: "crimson", fontSize: "14px", marginBottom: "10px" }}>
          ⚠️ {denyReason}
        </div>
      )}

      <form onSubmit={handletweet}>
        <div className="tweetBox__input">
          <Avatar src={userprofilepic} />
          <input
            type="text"
            placeholder="What's happening?"
            onChange={(e) => setpost(e.target.value)}
            value={post}
            required
            disabled={!canPost}
          />
        </div>

        <div className="imageIcon_tweetButton">
          <label htmlFor="image" className="imageIcon" style={{ cursor: canPost ? "pointer" : "not-allowed" }}>
            {isloading ? (
              <p>Uploading Image</p>
            ) : (
              <p>
                {imageurl ? "Image Uploaded" : <AddPhotoAlternateOutlinedIcon />}
              </p>
            )}
          </label>
          <input
            type="file"
            id="image"
            className="imageInput"
            onChange={handleuploadimage}
            disabled={!canPost}
          />

          <Button
            className="tweetBox__tweetButton"
            type="submit"
            disabled={!canPost}
            style={{ backgroundColor: canPost ? "#1DA1F2" : "#ccc" }}
          >
            Tweet
          </Button>
        </div>
      </form>
    </div>
  );
};

export default Tweetbox;
