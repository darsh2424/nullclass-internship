import React, { useState, useContext } from "react";
import twitterimg from "../../image/twitter.jpeg";
import TwitterIcon from "@mui/icons-material/Twitter";
import GoogleButton from "react-google-button";
import { useNavigate, Link } from "react-router-dom";
import "./login.css";
import logInfo from "./logInfo";
import { useUserAuth } from "../../context/UserAuthContext";
const Login = () => {
  const [email, seteamil] = useState("");
  const [password, setpassword] = useState("");
  const [error, seterror] = useState("");
  const navigate = useNavigate();
  const { googleSignIn, logIn, setManualUser } = useUserAuth();
  const handlesubmit = async (e) => {
    e.preventDefault();
    seterror("");

    try {
      const response = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Login failed");
      }

      // console.log("Logged in user:", data.user);
      setManualUser(data.user.email, data.user);
      const loginDetails = await logInfo(data.user);

      fetch("http://localhost:5000/logInfo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: data.user.email,
          ...loginDetails,
        }),
      })

      const logData = await logRes.json();

      if (logData.otpRequired) {
        navigate("/otp");
      } else {
        navigate("/");
      }
    } catch (error) {
      console.error("Login failed:", error.message);
      seterror(error.message);
      window.alert(error.message);
    }
  };

  const hanglegooglesignin = async (e) => {
    e.preventDefault();
    try {
      await googleSignIn();
      navigate("/");
    } catch (error) {
      console.log(error.message);
    }
  };
  return (
    <>
      <div className="login-container">
        <div className="image-container">
          <img src={twitterimg} className=" image" alt="twitterimg" />
        </div>
        <div className="form-container">
          <div className="form-box">
            <TwitterIcon style={{ color: "skyblue" }} />
            <h2 className="heading">Happening now</h2>
            {error && <p>{error.message}</p>}
            <form onSubmit={handlesubmit}>
              <input
                type="email"
                className="email"
                placeholder="Email address"
                onChange={(e) => seteamil(e.target.value)}
              />
              <input
                type="password"
                className="password"
                placeholder="Password"
                onChange={(e) => setpassword(e.target.value)}
              />
              <div className="btn-login">
                <button type="submit" className="btn">
                  Log In
                </button>
              </div>
            </form>
            <hr />
            <div>
              <GoogleButton className="g-btn" type="light" onClick={hanglegooglesignin} />
            </div>
          </div>
          <div>
            Don't have an account
            <Link
              to="/signup"
              style={{
                textDecoration: "none",
                color: "var(--twitter-color)",
                fontWeight: "600",
                marginLeft: "5px",
              }}
            >
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
