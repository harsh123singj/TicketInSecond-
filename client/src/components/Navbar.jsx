import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthProvider";

const Navbar = () => {
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const [menuOpen, setMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        setMenuOpen(false);
        navigate("/login");
    };

    return (
        <nav className="bg-black text-white sticky top-0 z-50 shadow-md">
            <div className="max-w-7xl mx-auto px-6 py-4">

                <div className="flex items-center justify-between">

                    {/* Logo */}
                    <Link
                        to="/"
                        onClick={() => setMenuOpen(false)}
                        className="text-xl font-bold tracking-wide"
                    >
                        <span className="text-[#ff5a00]">
                            TICKETS
                        </span>
                        <span className="text-white">
                            INSECONDS
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-8">

                        <Link
                            to="/"
                            className="text-gray-300 hover:text-white transition"
                        >
                            Home
                        </Link>

                        {user && (
                            <Link
                                to="/my-bookings"
                                className="text-gray-300 hover:text-white transition"
                            >
                                My Bookings
                            </Link>
                        )}

                        {user && (
                            <Link
                                to="/settings"
                                className="text-gray-300 hover:text-white transition"
                            >
                                Settings
                            </Link>
                        )}

                        {user?.role === "ADMIN" && (
                            <Link
                                to="/admin"
                                className="text-gray-300 hover:text-[#ff5a00] transition"
                            >
                                Admin
                            </Link>
                        )}

                        {!user ? (
                            <div className="flex items-center gap-4">

                                <Link
                                    to="/login"
                                    className="text-gray-300 hover:text-white transition"
                                >
                                    Login
                                </Link>

                                <Link
                                    to="/register"
                                    className="bg-[#ff5a00] hover:bg-[#e65100] px-5 py-2 rounded-lg font-semibold transition"
                                >
                                    Register
                                </Link>

                            </div>
                        ) : (
                            <div className="flex items-center gap-4">

                                <span className="text-gray-300">
                                    Hi, {user.name}
                                </span>

                                <button
                                    onClick={handleLogout}
                                    className="border border-gray-600 hover:border-white px-4 py-2 rounded-lg transition"
                                >
                                    Logout
                                </button>

                            </div>
                        )}

                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setMenuOpen(!menuOpen)}
                        className="md:hidden text-2xl"
                    >
                        ☰
                    </button>

                </div>

                {/* Mobile Menu */}
                {menuOpen && (
                    <div className="md:hidden border-t border-gray-800 mt-4 pt-5 space-y-4">

                        <Link
                            to="/"
                            onClick={() => setMenuOpen(false)}
                            className="block text-gray-300 hover:text-white"
                        >
                            Home
                        </Link>

                        {user && (
                            <Link
                                to="/my-bookings"
                                onClick={() => setMenuOpen(false)}
                                className="block text-gray-300 hover:text-white"
                            >
                                My Bookings
                            </Link>
                        )}

                        {user && (
                            <Link
                                to="/settings"
                                onClick={() => setMenuOpen(false)}
                                className="block text-gray-300 hover:text-white"
                            >
                                Settings
                            </Link>
                        )}

                        {user?.role === "ADMIN" && (
                            <Link
                                to="/admin"
                                onClick={() => setMenuOpen(false)}
                                className="block text-gray-300 hover:text-[#ff5a00]"
                            >
                                Admin
                            </Link>
                        )}

                        {!user ? (
                            <>
                                <Link
                                    to="/login"
                                    onClick={() => setMenuOpen(false)}
                                    className="block text-gray-300 hover:text-white"
                                >
                                    Login
                                </Link>

                                <Link
                                    to="/register"
                                    onClick={() => setMenuOpen(false)}
                                    className="block bg-[#ff5a00] text-white text-center py-2 rounded-lg"
                                >
                                    Register
                                </Link>
                            </>
                        ) : (
                            <>
                                <div className="text-gray-400">
                                    Hi, {user.name}
                                </div>

                                <button
                                    onClick={handleLogout}
                                    className="w-full border border-gray-600 py-2 rounded-lg"
                                >
                                    Logout
                                </button>
                            </>
                        )}

                    </div>
                )}

            </div>
        </nav>
    );
};

export default Navbar;