import React from "react";
import { Navigate, useLocation } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
    const location = useLocation();

    const isLoggedIn = localStorage.getItem("HallaUser_user");

    if (!isLoggedIn) {
        return (
            <Navigate
                to="/login"
                state={{ from: location }}
                replace
            />
        );
    }

    return children;
};

export default ProtectedRoute;