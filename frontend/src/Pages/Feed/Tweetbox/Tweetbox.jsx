import React, { useEffect, useState } from "react";
import "./Tweetbox.css";
import { Avatar, Button } from "@mui/material";
import AddPhotoAlternateOutlinedIcon from "@mui/icons-material/AddPhotoAlternateOutlined";
import axios from "axios";
import { useUserAuth } from "../../../context/UserAuthContext";
import useLoggedinuser from "../../../hooks/useLoggedinuser";

const Tweetbox = () => {
  const { user } = useUserAuth();
  const [loggedinsuer] = useLoggedinuser();
  const [post, setpost] = useState("");
  const [imageurl, setimageurl] = useState("");
  const [isloading, setisloading] = useState(false);
  const [name, setname] = useState("");
  const [username, setusername] = useState(loggedinsuer?.email.split("@")[0]);
  const [canPost, setCanPost] = useState(false);
  const [denyReason, setDenyReason] = useState("");
  const email = loggedinsuer?.email;

  useEffect(() => {
    setusername(email?.split("@")[0]);
  }, [email]);

  const userprofilepic = loggedinsuer?.profileImage
    ? loggedinsuer.profileImage
    : `https://ui-avatars.com/api/?name=${username}&background=random`;

  // 🧠 Check post permission on load
  useEffect(() => {
    const fetchCanPost = async () => {
      if (!loggedinsuer?._id) return;
      try {
        const res = await fetch(`http://localhost:5000/can-post?userId=${loggedinsuer._id}`);
        const data = await res.json();
        setCanPost(data.canPost);
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

  const handletweet = (e) => {
    e.preventDefault();
    if (!canPost) return;

    if (user?.providerData?.providerId === "password") {
      fetch(`http://localhost:5000/loggedinuser?email=${email}`)
        .then((res) => res.json())
        .then((data) => {
          setname(data?.name);
          setusername(data?.username);
        });
    } else {
      setname(loggedinsuer?.name);
      setusername(email?.split("@")[0]);
    }

    if (name) {
      const userpost = {
        profileImage: userprofilepic,
        post: post,
        photo: imageurl,
        username: username,
        name: name,
        email: email,
        userId: loggedinsuer._id,
      };

      setpost("");
      setimageurl("");

      fetch("http://localhost:5000/post", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(userpost),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
        });
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
