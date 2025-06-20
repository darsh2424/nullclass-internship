import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./login.css";
import TwitterIcon from "@mui/icons-material/Twitter";
import useLoggedinuser from "../../hooks/useLoggedinuser";

const OtpVerification = () => {
    const [otp, setOtp] = useState("");
    const [loggedinuser] = useLoggedinuser();
    const [email, setEmail] = useState();
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        setEmail(loggedinuser?.email)
    }, [loggedinuser]);

    const handleOtpSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const res = await fetch("http://localhost:5000/verify-otp", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, otp }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data || "Invalid OTP");
            }

            alert("✅ OTP Verified. Logged in!");
            navigate("/");
        } catch (err) {
            console.error("OTP Verification failed:", err.message);
            setError(err.message);
            alert("❌ " + err.message);
        }
    };

    return (
        <div className="otp-container">
            <div className="otp-box">
                <TwitterIcon style={{ color: "skyblue" }} />
                <h2>Enter OTP</h2>
                <p>We’ve sent a 6-digit code to your email.</p>
                {error && <p style={{ color: "red" }}>{error}</p>}
                <form onSubmit={handleOtpSubmit}>
                    <input
                        type="text"
                        maxLength={6}
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        placeholder="Enter OTP"
                        required
                    />
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        required
                    />
                    <button type="submit">Verify OTP</button>
                </form>
            </div>
        </div>
    );
};

export default OtpVerification;
