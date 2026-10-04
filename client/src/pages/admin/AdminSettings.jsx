import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const AdminSettings = () => {
    const navigate = useNavigate();

    const [passwords, setPasswords] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    const handleChange = (e) => {
        setPasswords({
            ...passwords,
            [e.target.name]: e.target.value,
        });
    };

    const handlePasswordChange = (e) => {
        e.preventDefault();

        if (passwords.newPassword !== passwords.confirmPassword) {
            alert("New passwords do not match.");
            return;
        }

        if (passwords.newPassword.length < 6) {
            alert("Password must be at least 6 characters.");
            return;
        }

        // Backend API will be connected here later
        console.log("Password change requested");

        alert("Password change functionality will be connected to the backend next.");

        setPasswords({
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
        });
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    return (
        <div className="min-h-screen bg-[#f7f5ef]">

            {/* Admin Header */}
            <div className="bg-black text-white">
                <div className="max-w-7xl mx-auto px-6 py-6">

                    <div className="flex items-center justify-between">

                        <Link to="/admin" className="text-2xl font-bold">
                            <span className="text-[#ff5a00]">
                                TICKETS
                            </span>
                            INSECONDS
                        </Link>

                        <div className="flex items-center gap-4">

                            <Link
                                to="/admin"
                                className="px-5 py-3 rounded-lg hover:bg-gray-800 transition"
                            >
                                Dashboard
                            </Link>

                            <button
                                onClick={handleLogout}
                                className="bg-[#ff5a00] px-6 py-3 rounded-lg font-semibold hover:bg-[#e65100] transition"
                            >
                                Logout
                            </button>

                        </div>

                    </div>

                </div>
            </div>

            {/* Main */}
            <main className="max-w-5xl mx-auto px-6 py-12">

                {/* Header */}
                <div className="mb-10">

                    <p className="text-[#ff5a00] tracking-[4px] text-sm font-medium">
                        ADMIN PANEL
                    </p>

                    <h1 className="text-5xl font-bold mt-4">
                        Settings
                    </h1>

                    <p className="text-gray-500 text-lg mt-3">
                        Manage your account and security settings.
                    </p>

                </div>

                {/* Profile Settings */}
                <section className="bg-white rounded-2xl shadow-sm p-8 mb-8">

                    <div className="mb-8">

                        <h2 className="text-2xl font-bold">
                            Admin Profile
                        </h2>

                        <p className="text-gray-500 mt-2">
                            Your administrator account information.
                        </p>

                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                        <div>
                            <label className="block text-sm font-semibold mb-2">
                                Name
                            </label>

                            <input
                                type="text"
                                value="Administrator"
                                readOnly
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold mb-2">
                                Role
                            </label>

                            <input
                                type="text"
                                value="ADMIN"
                                readOnly
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 outline-none"
                            />
                        </div>

                    </div>

                </section>

                {/* Password */}
                <section className="bg-white rounded-2xl shadow-sm p-8">

                    <div className="mb-8">

                        <h2 className="text-2xl font-bold">
                            Change Password
                        </h2>

                        <p className="text-gray-500 mt-2">
                            Update your administrator account password.
                        </p>

                    </div>

                    <form
                        onSubmit={handlePasswordChange}
                        className="space-y-6"
                    >

                        {/* Current Password */}
                        <div>

                            <label className="block text-sm font-semibold mb-2">
                                Current Password
                            </label>

                            <input
                                type="password"
                                name="currentPassword"
                                value={passwords.currentPassword}
                                onChange={handleChange}
                                placeholder="Enter current password"
                                required
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:border-[#ff5a00]"
                            />

                        </div>

                        {/* New Password */}
                        <div>

                            <label className="block text-sm font-semibold mb-2">
                                New Password
                            </label>

                            <input
                                type="password"
                                name="newPassword"
                                value={passwords.newPassword}
                                onChange={handleChange}
                                placeholder="Enter new password"
                                required
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:border-[#ff5a00]"
                            />

                        </div>

                        {/* Confirm Password */}
                        <div>

                            <label className="block text-sm font-semibold mb-2">
                                Confirm New Password
                            </label>

                            <input
                                type="password"
                                name="confirmPassword"
                                value={passwords.confirmPassword}
                                onChange={handleChange}
                                placeholder="Confirm new password"
                                required
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:border-[#ff5a00]"
                            />

                        </div>

                        {/* Button */}
                        <div className="pt-4">

                            <button
                                type="submit"
                                className="bg-[#ff5a00] text-white px-7 py-3 rounded-lg font-semibold hover:bg-[#e65100] transition"
                            >
                                Update Password
                            </button>

                        </div>

                    </form>

                </section>

            </main>

        </div>
    );
};

export default AdminSettings;