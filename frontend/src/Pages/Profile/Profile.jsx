import React from "react";
import "../pages.css";
import Mainprofile from "./Mainprofile/Mainprofile";
import { useUserAuth } from "../../context/UserAuthContext";
import useLoggedinuser from "../../hooks/useLoggedinuser";


const Profile = () => {
  // const { userDetails } = useUserAuth();
  const [loggedinsuer] = useLoggedinuser();

  // const user = {
  //   displayname: "bithead",
  //   email: "bithead@gmail.com",
  // };
  return (
    <div className="profilePage">
      <Mainprofile user={loggedinsuer} />
    </div>
  );
};

export default Profile;
