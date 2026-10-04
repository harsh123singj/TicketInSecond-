import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const API_URL =
    import.meta.env.VITE_API_URL || "http://localhost:3000";

const AdminDashboard = () => {
    const navigate = useNavigate();

    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchEvents = async () => {
        try {
            setLoading(true);
            setError("");

            const token = localStorage.getItem("token");

            if (!token) {
                navigate("/login");
                return;
            }

            /*
             * IMPORTANT:
             * Your backend currently exposes:
             *
             * GET /api/events
             *
             * NOT:
             *
             * GET /api/admin/events
             */
            const response = await fetch(
                `${API_URL}/api/events`,
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            const contentType =
                response.headers.get("content-type") || "";

            let data;

            if (contentType.includes("application/json")) {
                data = await response.json();
            } else {
                const text = await response.text();

                throw new Error(
                    `Server returned a non-JSON response (${response.status}).`
                );
            }

            if (!response.ok) {
                throw new Error(
                    data.message || "Failed to fetch events"
                );
            }

            const eventList = Array.isArray(data)
                ? data
                : data.events || data.data || [];

            setEvents(eventList);

        } catch (error) {
            console.error("Admin dashboard error:", error);

            setError(
                error.message ||
                    "Failed to load admin dashboard"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    // =========================
    // LOGOUT
    // =========================

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/login");
    };

    // =========================
    // STATISTICS
    // =========================

    const totalEvents = events.length;

    const totalTickets = events.reduce(
        (total, event) =>
            total + Number(event.totalTickets || 0),
        0
    );

    const potentialRevenue = events.reduce(
        (total, event) =>
            total +
            Number(event.totalTickets || 0) *
                Number(event.ticketPrice || 0),
        0
    );

    // =========================
    // LOADING
    // =========================

    if (loading) {
        return (
            <div className="min-h-screen bg-[#f7f5ef] flex items-center justify-center">
                <div className="text-center">
                    <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto"></div>

                    <p className="mt-4 text-gray-600">
                        Loading admin dashboard...
                    </p>
                </div>
            </div>
        );
    }

    // =========================
    // UI
    // =========================

    return (
        <div className="min-h-screen bg-[#f7f5ef]">

            {/* ================= HEADER ================= */}

            <header className="bg-black text-white">

                <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">

                    {/* LOGO */}

                    <Link
                        to="/"
                        className="text-2xl font-bold tracking-tight"
                    >
                        <span className="text-[#ff5a00]">
                            TICKETS
                        </span>
                        INSECONDS
                    </Link>

                    {/* ACTIONS */}

                    <div className="flex items-center gap-4">

                        <Link
                            to="/"
                            className="hidden sm:block text-gray-300 hover:text-white transition"
                        >
                            View Website
                        </Link>

                        <button
                            onClick={handleLogout}
                            className="bg-[#ff5a00] hover:bg-[#e84f00] text-white px-5 py-2.5 rounded-lg font-semibold transition"
                        >
                            Logout
                        </button>

                    </div>

                </div>

            </header>

            {/* ================= MAIN ================= */}

            <main className="max-w-7xl mx-auto px-6 py-10">

                {/* ================= HEADING ================= */}

                <div className="mb-8">

                    <p className="text-[#ff5a00] font-semibold tracking-[0.2em] text-sm">
                        ADMIN PANEL
                    </p>

                    <h1 className="text-4xl md:text-5xl font-bold mt-2 text-gray-900">
                        Dashboard
                    </h1>

                    <p className="text-gray-500 mt-3">
                        Manage your events and bookings.
                    </p>

                </div>

                {/* ================= ERROR ================= */}

                {error && (
                    <div className="mb-8">

                        <div className="border border-red-200 bg-red-50 text-red-600 rounded-xl p-5">

                            <p className="font-medium">
                                {error}
                            </p>

                            <button
                                onClick={fetchEvents}
                                className="mt-4 bg-black text-white px-5 py-2.5 rounded-lg hover:bg-gray-800 transition"
                            >
                                Try Again
                            </button>

                        </div>

                    </div>
                )}

                {/* ================= STATS ================= */}

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">

                    {/* TOTAL EVENTS */}

                    <div className="bg-white rounded-2xl shadow-sm p-6">

                        <p className="text-gray-500">
                            Total Events
                        </p>

                        <h2 className="text-4xl font-bold mt-3 text-gray-900">
                            {totalEvents}
                        </h2>

                    </div>

                    {/* TOTAL TICKETS */}

                    <div className="bg-white rounded-2xl shadow-sm p-6">

                        <p className="text-gray-500">
                            Total Tickets
                        </p>

                        <h2 className="text-4xl font-bold mt-3 text-gray-900">
                            {totalTickets}
                        </h2>

                    </div>

                    {/* POTENTIAL REVENUE */}

                    <div className="bg-white rounded-2xl shadow-sm p-6">

                        <p className="text-gray-500">
                            Potential Revenue
                        </p>

                        <h2 className="text-4xl font-bold mt-3 text-[#ff5a00]">

                            ₹
                            {potentialRevenue.toLocaleString(
                                "en-IN"
                            )}

                        </h2>

                    </div>

                </div>

                {/* ================= EVENTS ================= */}

                <section className="bg-white rounded-2xl shadow-sm p-6 md:p-8">

                    {/* SECTION HEADER */}

                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5 mb-8">

                        <div>

                            <h2 className="text-2xl font-bold text-gray-900">
                                Manage Events
                            </h2>

                            <p className="text-gray-500 mt-1">
                                Create and manage your events.
                            </p>

                        </div>

                        <div className="flex flex-wrap gap-3">

                            <button
                                onClick={() =>
                                    navigate("/admin/bookings")
                                }
                                className="bg-black hover:bg-gray-800 text-white px-6 py-3 rounded-lg font-semibold transition"
                            >
                                Manage Bookings
                            </button>

                            <Link
                                to="/admin/events/create"
                                className="bg-[#ff5a00] hover:bg-[#e84f00] text-white px-6 py-3 rounded-lg font-semibold transition"
                            >
                                + Create Event
                            </Link>

                        </div>

                    </div>

                    {/* ================= EVENT LIST ================= */}

                    {events.length === 0 ? (

                        <div className="py-16 text-center">

                            <h3 className="text-xl font-semibold text-gray-900">
                                No events found
                            </h3>

                            <p className="text-gray-500 mt-2">
                                Create your first event to get started.
                            </p>

                            <Link
                                to="/admin/events/create"
                                className="inline-block mt-5 bg-[#ff5a00] hover:bg-[#e84f00] text-white px-6 py-3 rounded-lg font-semibold transition"
                            >
                                Create Event
                            </Link>

                        </div>

                    ) : (

                        <div className="space-y-4">

                            {events.map((event) => (

                                <div
                                    key={event.id}
                                    className="border border-gray-200 rounded-xl p-5 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 hover:shadow-sm transition"
                                >

                                    {/* EVENT INFORMATION */}

                                    <div className="min-w-0">

                                        <p className="text-sm text-gray-500 uppercase font-medium">
                                            {event.type}
                                        </p>

                                        <h3 className="text-xl font-bold mt-1 text-gray-900">
                                            {event.name}
                                        </h3>

                                        <div className="flex flex-wrap gap-x-5 gap-y-2 mt-3 text-sm text-gray-500">

                                            <span>
                                                📍{" "}
                                                {event.venueName ||
                                                    "Venue not available"}
                                            </span>

                                            <span>
                                                🎟️{" "}
                                                {event.totalTickets || 0}{" "}
                                                tickets
                                            </span>

                                            <span className="font-semibold text-[#ff5a00]">
                                                ₹
                                                {Number(
                                                    event.ticketPrice || 0
                                                ).toLocaleString(
                                                    "en-IN"
                                                )}
                                            </span>

                                        </div>

                                    </div>

                                    {/* ACTIONS */}

                                    <div className="flex flex-wrap gap-3">

                                        <button
                                            onClick={() =>
                                                navigate(
                                                    `/admin/events/${event.id}/edit`
                                                )
                                            }
                                            className="border border-gray-300 px-5 py-2.5 rounded-lg hover:bg-gray-100 transition"
                                        >
                                            Edit
                                        </button>

                                        <button
                                            onClick={() =>
                                                navigate(
                                                    `/admin/events/${event.id}`
                                                )
                                            }
                                            className="bg-black text-white px-5 py-2.5 rounded-lg hover:bg-gray-800 transition"
                                        >
                                            Manage
                                        </button>

                                        <button
                                            onClick={() =>
                                                navigate(
                                                    `/events/${event.id}`
                                                )
                                            }
                                            className="bg-[#ff5a00] text-white px-5 py-2.5 rounded-lg hover:bg-[#e84f00] transition"
                                        >
                                            View
                                        </button>

                                    </div>

                                </div>

                            ))}

                        </div>

                    )}

                </section>

            </main>

        </div>
    );
};

export default AdminDashboard;