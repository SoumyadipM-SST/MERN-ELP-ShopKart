import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = () => {
    const { user, loading } = useAuth();

    console.log("ProtectedRoute:", {
        user,
        loading
    });

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!user) {
        console.log("NO USER → LOGIN");
        return <Navigate to="/login" replace />;
    }

    console.log("USER EXISTS → HOME");

    return <Outlet />;
};

export default ProtectedRoute;
