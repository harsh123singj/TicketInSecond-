import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";

const AdminRoute = () => {
    const { user, loading } = useAuth();
    const location = useLocation();

    // Wait until authentication is restored
    if (loading) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto"></div>

                    <p className="mt-4 text-gray-600">
                        Checking authentication...
                    </p>
                </div>
            </div>
        );
    }

    // Not logged in
    if (!user) {
        return (
            <Navigate
                to="/login"
                replace
                state={{ from: location.pathname }}
            />
        );
    }

    // Logged in but not admin
    if (user.role !== "ADMIN") {
        return (
            <Navigate
                to="/"
                replace
            />
        );
    }

    // Admin
    return <Outlet />;
};

export default AdminRoute;