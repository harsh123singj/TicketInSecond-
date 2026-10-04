import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";

const Settings = () => {
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const [showPassword, setShowPassword] = useState(false);

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    if (!user) {
        return (
            <div className="min-h-screen bg-[#f7f5ef] flex items-center justify-center px-6">
                <div className="text-center">
                    <h1 className="text-3xl font-bold">
                        Please login first
                    </h1>

                    <button
                        onClick={() => navigate("/login")}
                        className="mt-6 bg-[#ff5a00] text-white px-6 py-3 rounded-lg font-semibold"
                    >
                        Login
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f7f5ef]">

            {/* Header */}
            <div className="bg-black text-white">
                <div className="max-w-5xl mx-auto px-6 py-12">

                    <p className="text-[#ff5a00] tracking-[4px] text-sm font-medium">
                        ACCOUNT
                    </p>

                    <h1 className="text-4xl md:text-5xl font-bold mt-3">
                        Settings
                    </h1>

                    <p className="text-gray-400 mt-3">
                        Manage your TicketsInSeconds account.
                    </p>

                </div>
            </div>

            {/* Content */}
            <main className="max-w-5xl mx-auto px-6 py-10">

                {/* Profile */}
                <section className="bg-white rounded-2xl shadow-sm p-8 mb-6">

                    <div className="mb-8">
                        <h2 className="text-2xl font-bold">
                            Profile
                        </h2>

                        <p className="text-gray-500 mt-2">
                            Your account information.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                        {/* Name */}
                        <div>
                            <label className="block text-sm font-semibold mb-2">
                                Name
                            </label>

                            <input
                                type="text"
                                value={user.name || ""}
                                readOnly
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 outline-none"
                            />
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-semibold mb-2">
                                Email
                            </label>

                            <input
                                type="email"
                                value={user.email || ""}
                                readOnly
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 outline-none"
                            />
                        </div>

                        {/* Phone */}
                        <div>
                            <label className="block text-sm font-semibold mb-2">
                                Phone
                            </label>

                            <input
                                type="text"
                                value={user.phone || "Not provided"}
                                readOnly
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 outline-none"
                            />
                        </div>

                        {/* Role */}
                        <div>
                            <label className="block text-sm font-semibold mb-2">
                                Account Type
                            </label>

                            <input
                                type="text"
                                value={user.role || "USER"}
                                readOnly
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 outline-none"
                            />
                        </div>

                    </div>

                </section>

                {/* Security */}
                <section className="bg-white rounded-2xl shadow-sm p-8 mb-6">

                    <div className="mb-8">
                        <h2 className="text-2xl font-bold">
                            Security
                        </h2>

                        <p className="text-gray-500 mt-2">
                            Manage your account security.
                        </p>
                    </div>

                    <div className="border border-gray-200 rounded-xl p-5">

                        <div className="flex items-center justify-between gap-4">

                            <div>
                                <h3 className="font-semibold">
                                    Password
                                </h3>

                                <p className="text-sm text-gray-500 mt-1">
                                    Your password is securely protected.
                                </p>
                            </div>

                            <button
                                onClick={() => setShowPassword(!showPassword)}
                                className="border border-gray-300 px-5 py-2 rounded-lg hover:bg-gray-100 transition"
                            >
                                {showPassword ? "Hide" : "Change"}
                            </button>

                        </div>

                        {showPassword && (
                            <div className="mt-6 pt-6 border-t border-gray-200">

                                <p className="text-gray-500 text-sm mb-4">
                                    Password change will be connected to the backend next.
                                </p>

                                <button
                                    onClick={() => alert("Password change coming next.")}
                                    className="bg-[#ff5a00] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#e65100] transition"
                                >
                                    Update Password
                                </button>

                            </div>
                        )}

                    </div>

                </section>

                {/* Quick Actions */}
                <section className="bg-white rounded-2xl shadow-sm p-8 mb-6">

                    <h2 className="text-2xl font-bold mb-6">
                        Quick Actions
                    </h2>

                    <div className="flex flex-wrap gap-4">

                        <button
                            onClick={() => navigate("/my-bookings")}
                            className="bg-black !text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 transition"
                        >
                            My Bookings
                        </button>

                        <button
                            onClick={() => navigate("/")}
                            className="border border-gray-300 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
                        >
                            Browse Events
                        </button>

                    </div>

                </section>

                {/* Danger Zone */}
                <section className="bg-white rounded-2xl shadow-sm p-8 border border-red-100">

                    <h2 className="text-2xl font-bold text-red-600">
                        Account
                    </h2>

                    <p className="text-gray-500 mt-2 mb-6">
                        Sign out from your TicketsInSeconds account.
                    </p>

                    <button
                        onClick={handleLogout}
                        className="bg-red-600 !text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition"
                    >
                        Logout
                    </button>

                </section>

            </main>
        </div>
    );
};

export default Settings;