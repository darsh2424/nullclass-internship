// import logo from "./logo.svg";
import "./App.css";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./Pages/Home";
import Login from "./Pages/Login/Login";
import Signup from "./Pages/Login/Signup";
import Feed from "./Pages/Feed/Feed";
import Explore from "./Pages/Explore/Explore";
import Notification from "./Pages/Notification/Notification";
import Message from "./Pages/Messages/Message";
import ProtectedRoute from "./Pages/ProtectedRoute";
import Lists from "./Pages/Lists/Lists";
import Profile from "./Pages/Profile/Profile";
import More from "./Pages/more/More";
import { UserAuthContextProvider } from "./context/UserAuthContext";
import Bookmark from "./Pages/Bookmark/Bookmark";
import UserProfile from "./Pages/UserProfile/UserProfile";
import OtpVerification from "./Pages/Login/otpVerification";
function App() {
  return (
    <div className="app">
      <UserAuthContextProvider>
        <Routes>
          <Route path="*" element={<Navigate to="/" />} />
          <Route path="/" exact element={<ProtectedRoute>
                {" "}
                <Home />
              </ProtectedRoute>} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                {" "}
                <Home />
              </ProtectedRoute>
            }
          >
            <Route index element={<Feed />} />
          </Route>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                {" "}
                <Home />
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/otp" element={<OtpVerification />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/home" element={<Home />} >
          <Route path="feed" element={<Feed />} />
          <Route path="explore" element={<Explore />} />
          <Route path="notification" element={<Notification />} />
          <Route path="messages" element={<Message />} />
          <Route path="lists" element={<Lists />} />
          <Route path="bookmarks" element={<Bookmark />} />
          <Route path="profile" element={<Profile />} />
          <Route path="more" element={<More />} />
          </Route>
          <Route path="/home/user/:username" element={<UserProfile />} />
        </Routes>
      </UserAuthContextProvider>
    </div>
  );
}

export default App;
