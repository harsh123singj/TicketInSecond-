import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";

const Register = () => {
    const navigate = useNavigate();
    const { register, loading } = useAuth();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        password: ""
    });

    const [error, setError] = useState("");

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            await register(formData);

            // After successful registration
            navigate("/login");

        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <div
            className="min-h-screen bg-cover bg-center bg-no-repeat flex items-center justify-center px-4 py-8"
            style={{
                backgroundImage: "url('/concert-bg.jpg')"
            }}
        >
            {/* Dark overlay */}
            <div className="fixed inset-0 bg-black/65"></div>

            {/* Register Card */}
            <div className="relative z-10 w-full max-w-md">

                <div className="bg-black/55 backdrop-blur-xl border border-white/15 rounded-2xl shadow-2xl p-6 sm:p-8">

                    {/* Brand */}
                    <div className="text-center mb-7">

                        <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
                            Tickets<span className="text-orange-400">InSeconds</span>
                        </h1>

                        <p className="text-gray-300 mt-2 text-sm sm:text-base">
                            Get ready for your next event.
                        </p>

                    </div>

                    {/* Heading */}
                    <div className="mb-6">

                        <h2 className="text-2xl font-semibold text-white">
                            Create your account
                        </h2>

                        <p className="text-gray-400 text-sm mt-1">
                            Join TicketsInSeconds and start booking.
                        </p>

                    </div>

                    {/* Error */}
                    {error && (
                        <div className="mb-5 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                            {error}
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">

                        {/* Name */}
                        <div>
                            <label
                                htmlFor="name"
                                className="block text-sm font-medium text-gray-200 mb-2"
                            >
                                Full Name
                            </label>

                            <input
                                id="name"
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Enter your name"
                                required
                                autoComplete="name"
                                className="w-full rounded-lg bg-white/10 border border-white/15 px-4 py-3 text-white placeholder-gray-400 outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-400/20"
                            />
                        </div>

                        {/* Email */}
                        <div>
                            <label
                                htmlFor="email"
                                className="block text-sm font-medium text-gray-200 mb-2"
                            >
                                Email
                            </label>

                            <input
                                id="email"
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Enter your email"
                                required
                                autoComplete="email"
                                className="w-full rounded-lg bg-white/10 border border-white/15 px-4 py-3 text-white placeholder-gray-400 outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-400/20"
                            />
                        </div>

                        {/* Phone */}
                        <div>
                            <label
                                htmlFor="phone"
                                className="block text-sm font-medium text-gray-200 mb-2"
                            >
                                Phone Number
                            </label>

                            <input
                                id="phone"
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="Enter your phone number"
                                required
                                autoComplete="tel"
                                className="w-full rounded-lg bg-white/10 border border-white/15 px-4 py-3 text-white placeholder-gray-400 outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-400/20"
                            />
                        </div>

                        {/* Password */}
                        <div>
                            <label
                                htmlFor="password"
                                className="block text-sm font-medium text-gray-200 mb-2"
                            >
                                Password
                            </label>

                            <input
                                id="password"
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Create a password"
                                required
                                autoComplete="new-password"
                                className="w-full rounded-lg bg-white/10 border border-white/15 px-4 py-3 text-white placeholder-gray-400 outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-400/20"
                            />
                        </div>

                        {/* Register Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full rounded-lg bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white font-semibold py-3 transition duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {loading ? "Creating account..." : "Create Account"}
                        </button>

                    </form>

                    {/* Login */}
                    <div className="text-center mt-7">

                        <p className="text-gray-400 text-sm">
                            Already have an account?{" "}
                            <Link
                                to="/login"
                                className="text-orange-400 hover:text-orange-300 font-medium transition"
                            >
                                Login
                            </Link>
                        </p>

                    </div>

                </div>

                {/* Bottom text */}
                <p className="text-center text-gray-300/70 text-xs mt-5">
                    Your tickets. Your events. Your moments.
                </p>

            </div>
        </div>
    );
};

export default Register;