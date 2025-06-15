import React, { useEffect } from "react";
import Widgets from "./Widgets/Widgets";
import Sidebar from "./Sidebar/sidebar";
import { Outlet } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useUserAuth } from "../context/UserAuthContext";
import useLoggedinuser from "../hooks/useLoggedinuser";
const Home = () => {
  const {logOut,user}=useUserAuth();
  const [loggedinuser, , loading] = useLoggedinuser();
  const navigate = useNavigate();

  const handlelogout = async () => {
    try {
      await logOut()
      navigate("/login");
    } catch (error) {
      console.log(error.message);
    }
  };

   useEffect(() => {
    if (!user || (!loading && !loggedinuser)) {
      navigate("/login");
    }
  }, [user, loggedinuser, loading, navigate]);

  return (
    <div className="app">
      <Sidebar handlelogout={handlelogout} user={user} />
      <Outlet />
      <Widgets />
    </div>
  );
};

export default Home;
