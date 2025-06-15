import React from "react";
import { Navigate } from "react-router-dom";
import { useUserAuth } from "../context/UserAuthContext";
import useLoggedinuser from "../hooks/useLoggedinuser";
import {  Box, CircularProgress } from "@mui/material";

const ProtectedRoute = ({ children }) => {
    const { user } = useUserAuth();
    const [loggedinuser, , loading] = useLoggedinuser();

    // console.log("Check user in Private: ", user);
    if (loading) return <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: 100,
          }}
        >
          <CircularProgress size={24} />
        </Box>;

    if (!user || !loggedinuser) return <Navigate to="/login" replace />;
    
    return children;
};

export default ProtectedRoute;