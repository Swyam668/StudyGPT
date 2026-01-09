import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import AppLayout from '../layout/AppLayout';
import { useAuth } from "../../context/AuthContext";


const ProtectedRoute = () => {
    const {isAuthenticated, loading} = useAuth()

    if(loading){
        return <div>Loading... </div>
    }

    return isAuthenticated ? (
        // parent UI structure (AppLayout -- overall App layout)
        <AppLayout>
            {/* placeholder for childroutes */}
            <Outlet /> 
        </AppLayout>
    ) : (
        <Navigate to="/login" replace />
    )
}

export default ProtectedRoute;