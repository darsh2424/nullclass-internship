import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./login.css";
import twitterimg from "../../image/twitter.jpeg";
import TwitterIcon from "@mui/icons-material/Twitter";
import { useUserAuth } from "../../context/UserAuthContext";
import logInfo from "./logInfo";
import { CircularProgress } from "@mui/material";

const OtpVerification = () => {
    const [otp, setOtp] = useState("");
    const { userDetails } = useUserAuth();
    const [email, setEmail] = useState(userDetails?.email);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        setEmail(userDetails?.email);
    }, [userDetails]);

    const handleOtpSubmit = async (e) => {
        e.preventDefault();
        setError("");
        try {
            // console.log(email + otp)
            const loginDetails = await logInfo();
            const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/verify-otp`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email: email, otp: otp, ...loginDetails, }),
            });

            const data = await res.json();
            if (!res.ok) {
                throw new Error(data?.error || "Invalid OTP");
            }
            navigate("/");
        } catch (err) {
            console.error("OTP Verification failed:", err.message);
            setError(err.message);
            alert(err.message);
        }
    };

    return (
        <div className="login-container">
            <div className="image-container">
                <img src={twitterimg} className=" image" alt="twitterimg" />
            </div>
            <div className="form-container">
                <div className="form-box">
                    <TwitterIcon style={{ color: "skyblue" }} />
                    <p>We’ve sent a 6-digit code to your email.</p>
                    {error && <p style={{ color: "red" }}>{error}</p>}
                    <form onSubmit={handleOtpSubmit}>
                        <input
                            type="text"
                            maxLength={6}
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            placeholder="Enter OTP"
                            className="email"
                            required
                        />
                        <input
                            type="hidden"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                            className="email"
                            required
                        />
                        <button type="submit" className="btn">Verify OTP</button>
                    </form>
                    <div>

                        <Link
                            to="/login"
                            style={{
                                textDecoration: "none",
                                color: "var(--twitter-color)",
                                fontWeight: "600",
                                marginLeft: "5px",
                            }}
                        >
                            Back To Login
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OtpVerification;
