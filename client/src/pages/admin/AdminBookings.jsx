import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

const AdminBookings = () => {
    const navigate = useNavigate();

    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // ================= FETCH ALL BOOKINGS =================

    const fetchBookings = async () => {
        try {
            setLoading(true);
            setError("");

            const token = localStorage.getItem("token");

            if (!token) {
                navigate("/login");
                return;
            }

            const response = await fetch(
                `${API_URL}/api/admin/bookings`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                        "Failed to fetch bookings"
                );
            }

            setBookings(
                data.bookings ||
                    data ||
                    []
            );
        } catch (error) {
            console.error(
                "Fetch admin bookings error:",
                error
            );

            setError(
                error.message ||
                    "Failed to load bookings"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBookings();
    }, []);

    // ================= STATUS =================

    const getStatusClass = (status) => {
        const currentStatus =
            status?.toUpperCase();

        if (currentStatus === "CONFIRMED") {
            return "bg-green-100 text-green-700";
        }

        if (currentStatus === "CANCELLED") {
            return "bg-red-100 text-red-700";
        }

        if (currentStatus === "COMPLETED") {
            return "bg-blue-100 text-blue-700";
        }

        return "bg-yellow-100 text-yellow-700";
    };

    // ================= DATE =================

    const formatDate = (date) => {
        if (!date) {
            return "N/A";
        }

        return new Date(date).toLocaleDateString(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric",
            }
        );
    };

    // ================= TOTALS =================

    const totalBookings = bookings.length;

    const confirmedBookings =
        bookings.filter(
            (booking) =>
                booking.status?.toUpperCase() ===
                "CONFIRMED"
        ).length;

    const cancelledBookings =
        bookings.filter(
            (booking) =>
                booking.status?.toUpperCase() ===
                "CANCELLED"
        ).length;

    const totalTickets = bookings.reduce(
        (total, booking) =>
            total +
            Number(
                booking.ticketCount || 0
            ),
        0
    );

    const totalRevenue = bookings.reduce(
        (total, booking) => {
            const ticketCount =
                Number(
                    booking.ticketCount || 0
                );

            const ticketPrice =
                Number(
                    booking.event?.ticketPrice ||
                        booking.ticketPrice ||
                        0
                );

            const status =
                booking.status?.toUpperCase();

            if (status === "CANCELLED") {
                return total;
            }

            return (
                total +
                ticketCount *
                    ticketPrice
            );
        },
        0
    );

    // ================= LOADING =================

    if (loading) {
        return (
            <div className="min-h-screen bg-[#f7f5ef] flex items-center justify-center">

                <div className="text-center">

                    <div className="w-10 h-10 border-4 border-gray-200 border-t-[#ff5a00] rounded-full animate-spin mx-auto"></div>

                    <p className="mt-4 text-gray-500">
                        Loading bookings...
                    </p>

                </div>

            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f7f5ef]">

            {/* ================= HEADER ================= */}

            <div className="bg-black text-white">

                <div className="max-w-7xl mx-auto px-6 py-8">

                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">

                        <div>

                            <Link
                                to="/admin"
                                className="text-gray-400 hover:text-white transition text-sm"
                            >
                                ← Back to Dashboard
                            </Link>

                            <p className="text-[#ff5a00] tracking-[4px] text-sm font-medium mt-5">
                                ADMIN PANEL
                            </p>

                            <h1 className="text-4xl font-bold mt-2">
                                Manage Bookings
                            </h1>

                            <p className="text-gray-400 mt-2">
                                View and manage customer bookings.
                            </p>

                        </div>

                        <button
                            onClick={fetchBookings}
                            className="bg-[#ff5a00] hover:bg-[#e65100] px-6 py-3 rounded-lg font-semibold transition"
                        >
                            Refresh
                        </button>

                    </div>

                </div>

            </div>

            {/* ================= MAIN ================= */}

            <main className="max-w-7xl mx-auto px-6 py-10">

                {/* ================= ERROR ================= */}

                {error && (
                    <div className="mb-7 bg-red-50 border border-red-200 text-red-600 px-5 py-4 rounded-xl">
                        {error}
                    </div>
                )}

                {/* ================= STATISTICS ================= */}

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5 mb-10">

                    {/* Total Bookings */}

                    <div className="bg-white rounded-2xl shadow-sm p-6">

                        <p className="text-gray-500 text-sm">
                            Total Bookings
                        </p>

                        <h2 className="text-3xl font-bold mt-3">
                            {totalBookings}
                        </h2>

                    </div>

                    {/* Confirmed */}

                    <div className="bg-white rounded-2xl shadow-sm p-6">

                        <p className="text-gray-500 text-sm">
                            Confirmed
                        </p>

                        <h2 className="text-3xl font-bold text-green-600 mt-3">
                            {confirmedBookings}
                        </h2>

                    </div>

                    {/* Cancelled */}

                    <div className="bg-white rounded-2xl shadow-sm p-6">

                        <p className="text-gray-500 text-sm">
                            Cancelled
                        </p>

                        <h2 className="text-3xl font-bold text-red-500 mt-3">
                            {cancelledBookings}
                        </h2>

                    </div>

                    {/* Tickets */}

                    <div className="bg-white rounded-2xl shadow-sm p-6">

                        <p className="text-gray-500 text-sm">
                            Tickets Sold
                        </p>

                        <h2 className="text-3xl font-bold mt-3">
                            {totalTickets}
                        </h2>

                    </div>

                    {/* Revenue */}

                    <div className="bg-white rounded-2xl shadow-sm p-6">

                        <p className="text-gray-500 text-sm">
                            Revenue
                        </p>

                        <h2 className="text-2xl font-bold text-[#ff5a00] mt-3">
                            ₹
                            {totalRevenue.toLocaleString(
                                "en-IN"
                            )}
                        </h2>

                    </div>

                </div>

                {/* ================= BOOKINGS ================= */}

                <div className="bg-white rounded-2xl shadow-sm overflow-hidden">

                    <div className="p-7 border-b">

                        <h2 className="text-2xl font-bold">
                            All Bookings
                        </h2>

                        <p className="text-gray-500 mt-2">
                            Customer booking records.
                        </p>

                    </div>

                    {bookings.length === 0 ? (

                        <div className="py-16 text-center">

                            <div className="text-5xl mb-5">
                                🎟️
                            </div>

                            <h3 className="text-xl font-bold">
                                No bookings found
                            </h3>

                            <p className="text-gray-500 mt-2">
                                There are no bookings yet.
                            </p>

                        </div>

                    ) : (

                        <div className="overflow-x-auto">

                            <table className="w-full">

                                <thead className="bg-gray-50 border-b">

                                    <tr>

                                        <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                                            Booking
                                        </th>

                                        <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                                            Customer
                                        </th>

                                        <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                                            Event
                                        </th>

                                        <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                                            Seats
                                        </th>

                                        <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                                            Amount
                                        </th>

                                        <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                                            Status
                                        </th>

                                        <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                                            Date
                                        </th>

                                        <th className="text-right px-6 py-4 text-sm font-semibold text-gray-600">
                                            Action
                                        </th>

                                    </tr>

                                </thead>

                                <tbody>

                                    {bookings.map(
                                        (
                                            booking
                                        ) => {

                                            const event =
                                                booking.event;

                                            const user =
                                                booking.user;

                                            const ticketCount =
                                                Number(
                                                    booking.ticketCount ||
                                                        0
                                                );

                                            const ticketPrice =
                                                Number(
                                                    event?.ticketPrice ||
                                                        booking.ticketPrice ||
                                                        0
                                                );

                                            const amount =
                                                ticketCount *
                                                ticketPrice;

                                            return (
                                                <tr
                                                    key={
                                                        booking.id
                                                    }
                                                    className="border-b last:border-b-0 hover:bg-gray-50 transition"
                                                >

                                                    {/* Booking */}

                                                    <td className="px-6 py-5">

                                                        <p className="font-semibold">
                                                            #
                                                            {
                                                                booking.id
                                                            }
                                                        </p>

                                                        <p className="text-xs text-gray-400 mt-1">
                                                            {formatDate(
                                                                booking.createdAt
                                                            )}
                                                        </p>

                                                    </td>

                                                    {/* Customer */}

                                                    <td className="px-6 py-5">

                                                        <p className="font-semibold">
                                                            {
                                                                user?.name ||
                                                                booking.userName ||
                                                                "Unknown"
                                                            }
                                                        </p>

                                                        <p className="text-sm text-gray-500 mt-1">
                                                            {
                                                                user?.email ||
                                                                booking.userEmail ||
                                                                "N/A"
                                                            }
                                                        </p>

                                                    </td>

                                                    {/* Event */}

                                                    <td className="px-6 py-5">

                                                        <p className="font-semibold max-w-[220px]">
                                                            {
                                                                event?.name ||
                                                                booking.eventName ||
                                                                "Unknown Event"
                                                            }
                                                        </p>

                                                        <p className="text-sm text-gray-500 mt-1">
                                                            {
                                                                event?.venueName ||
                                                                "N/A"
                                                            }
                                                        </p>

                                                    </td>

                                                    {/* Seats */}

                                                    <td className="px-6 py-5">

                                                        <div className="flex flex-wrap gap-1 max-w-[180px]">

                                                            {booking.seatNumber
                                                                ?.split(
                                                                    ","
                                                                )
                                                                .map(
                                                                    (
                                                                        seat
                                                                    ) => (
                                                                        <span
                                                                            key={
                                                                                seat
                                                                            }
                                                                            className="bg-orange-100 text-[#ff5a00] px-2 py-1 rounded text-xs font-semibold"
                                                                        >
                                                                            {seat.trim()}
                                                                        </span>
                                                                    )
                                                                )}

                                                        </div>

                                                        <p className="text-xs text-gray-400 mt-2">
                                                            {
                                                                ticketCount
                                                            }{" "}
                                                            ticket
                                                            {ticketCount !==
                                                            1
                                                                ? "s"
                                                                : ""}
                                                        </p>

                                                    </td>

                                                    {/* Amount */}

                                                    <td className="px-6 py-5">

                                                        <p className="font-bold text-[#ff5a00]">
                                                            ₹
                                                            {amount.toLocaleString(
                                                                "en-IN"
                                                            )}
                                                        </p>

                                                        <p className="text-xs text-gray-400 mt-1">
                                                            {
                                                                booking.paymentMethod ||
                                                                "N/A"
                                                            }
                                                        </p>

                                                    </td>

                                                    {/* Status */}

                                                    <td className="px-6 py-5">

                                                        <span
                                                            className={`inline-flex px-3 py-1.5 rounded-full text-xs font-semibold ${getStatusClass(
                                                                booking.status
                                                            )}`}
                                                        >
                                                            {booking.status ||
                                                                "PENDING"}
                                                        </span>

                                                    </td>

                                                    {/* Date */}

                                                    <td className="px-6 py-5 text-sm text-gray-600 whitespace-nowrap">

                                                        {formatDate(
                                                            booking.createdAt
                                                        )}

                                                    </td>

                                                    {/* Action */}

                                                    <td className="px-6 py-5 text-right">

                                                        <button
                                                            onClick={() =>
                                                                navigate(
                                                                    `/bookings/${booking.id}`
                                                                )
                                                            }
                                                            className="bg-black hover:bg-gray-800 text-white px-4 py-2 rounded-lg text-sm font-semibold transition"
                                                        >
                                                            View
                                                        </button>

                                                    </td>

                                                </tr>
                                            );
                                        }
                                    )}

                                </tbody>

                            </table>

                        </div>

                    )}

                </div>

            </main>

        </div>
    );
};

export default AdminBookings;