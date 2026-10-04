import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

const MyBooking = () => {
    const navigate = useNavigate();

    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // ================= FETCH BOOKINGS =================

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
                `${API_URL}/api/booking/my`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Failed to fetch bookings"
                );
            }

            setBookings(
                data.bookings || data || []
            );
        } catch (error) {
            console.error(
                "Fetch bookings error:",
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

    // ================= CANCEL BOOKING =================

    const handleCancel = async (bookingId) => {
        const confirmed = window.confirm(
            "Are you sure you want to cancel this booking?"
        );

        if (!confirmed) return;

        try {
            const token = localStorage.getItem("token");

            const response = await fetch(
                `${API_URL}/api/booking/${bookingId}/cancel`,
                {
                    method: "PATCH",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                        "Failed to cancel booking"
                );
            }

            await fetchBookings();
        } catch (error) {
            console.error(
                "Cancel booking error:",
                error
            );

            setError(
                error.message ||
                    "Failed to cancel booking"
            );
        }
    };

    // ================= STATUS =================

    const getStatusClasses = (status) => {
        switch (status?.toUpperCase()) {
            case "CONFIRMED":
                return "bg-green-100 text-green-700";

            case "CANCELLED":
                return "bg-red-100 text-red-700";

            case "COMPLETED":
                return "bg-blue-100 text-blue-700";

            default:
                return "bg-yellow-100 text-yellow-700";
        }
    };

    // ================= DATE =================

    const formatDate = (date) => {
        if (!date) return "N/A";

        return new Date(date).toLocaleDateString(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric",
            }
        );
    };

    // ================= LOADING =================

    if (loading) {
        return (
            <div className="min-h-screen bg-[#f7f5ef] flex items-center justify-center px-4">
                <div className="text-center">
                    <div className="w-10 h-10 border-4 border-gray-200 border-t-[#ff5a00] rounded-full animate-spin mx-auto" />

                    <p className="mt-4 text-gray-500">
                        Loading your bookings...
                    </p>
                </div>
            </div>
        );
    }

    // ================= UI =================

    return (
        <div className="min-h-screen bg-[#f7f5ef] px-4 sm:px-6 py-8 sm:py-12">
            <div className="max-w-6xl mx-auto">

                {/* HEADER */}
                <div className="mb-8 sm:mb-10">
                    <p className="text-[#ff5a00] tracking-[4px] text-xs sm:text-sm font-semibold">
                        YOUR BOOKINGS
                    </p>

                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mt-2 text-[#111827]">
                        My Bookings
                    </h1>

                    <p className="text-gray-500 mt-2 text-sm sm:text-base">
                        View and manage all your ticket bookings.
                    </p>
                </div>

                {/* ERROR */}
                {error && (
                    <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm">
                        {error}
                    </div>
                )}

                {/* EMPTY STATE */}
                {bookings.length === 0 ? (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 sm:p-12 text-center">
                        <div className="text-5xl mb-5">
                            🎟️
                        </div>

                        <h2 className="text-xl sm:text-2xl font-bold">
                            No bookings yet
                        </h2>

                        <p className="text-gray-500 mt-2">
                            You haven't booked any events yet.
                        </p>

                        <Link
                            to="/"
                            className="inline-block mt-6 bg-[#ff5a00] hover:bg-[#e65100] text-white px-6 py-3 rounded-lg font-semibold transition"
                        >
                            Explore Events
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-5">

                        {bookings.map((booking) => {
                            const event = booking.event;

                            const status =
                                booking.status?.toUpperCase() ||
                                "PENDING";

                            const ticketCount =
                                Number(
                                    booking.ticketCount || 0
                                );

                            const ticketPrice =
                                Number(
                                    event?.ticketPrice || 0
                                );

                            const totalAmount =
                                ticketCount * ticketPrice;

                            const seats =
                                booking.seatNumber
                                    ?.split(",")
                                    .map((seat) =>
                                        seat.trim()
                                    )
                                    .filter(Boolean) || [];

                            return (
                                <div
                                    key={booking.id}
                                    className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
                                >

                                    {/* TOP SECTION */}
                                    <div className="p-5 sm:p-6">

                                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">

                                            <div className="min-w-0">

                                                <p className="text-[#ff5a00] uppercase text-xs sm:text-sm font-bold tracking-wide">
                                                    {event?.type ||
                                                        "EVENT"}
                                                </p>

                                                <h2 className="text-xl sm:text-2xl font-bold text-[#111827] mt-1 break-words">
                                                    {event?.name ||
                                                        "Event"}
                                                </h2>

                                                <p className="text-gray-400 text-xs sm:text-sm mt-1">
                                                    Booking ID: #
                                                    {booking.id}
                                                </p>

                                            </div>

                                            <span
                                                className={`self-start shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold ${getStatusClasses(
                                                    status
                                                )}`}
                                            >
                                                {status}
                                            </span>

                                        </div>

                                        {/* DETAILS */}
                                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-5 pt-5 border-t border-gray-200">

                                            {/* DATE */}
                                            <div>
                                                <p className="text-xs text-gray-400">
                                                    Date
                                                </p>

                                                <p className="font-semibold text-sm sm:text-base mt-1 text-gray-800">
                                                    {formatDate(
                                                        event?.eventDate
                                                    )}
                                                </p>
                                            </div>

                                            {/* TIME */}
                                            <div>
                                                <p className="text-xs text-gray-400">
                                                    Time
                                                </p>

                                                <p className="font-semibold text-sm sm:text-base mt-1 text-gray-800">
                                                    {event?.eventTime ||
                                                        "N/A"}
                                                </p>
                                            </div>

                                            {/* VENUE */}
                                            <div className="min-w-0">
                                                <p className="text-xs text-gray-400">
                                                    Venue
                                                </p>

                                                <p className="font-semibold text-sm sm:text-base mt-1 text-gray-800 truncate">
                                                    {event?.venueName ||
                                                        "N/A"}
                                                </p>
                                            </div>

                                            {/* TICKETS */}
                                            <div>
                                                <p className="text-xs text-gray-400">
                                                    Tickets
                                                </p>

                                                <p className="font-semibold text-sm sm:text-base mt-1 text-gray-800">
                                                    {ticketCount}
                                                </p>
                                            </div>

                                        </div>

                                        {/* BOTTOM SECTION */}
                                        <div className="mt-5 pt-5 border-t border-gray-200">

                                            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5">

                                                {/* SEATS */}
                                                <div className="min-w-0">
                                                    <p className="text-xs text-gray-400">
                                                        Selected Seats
                                                    </p>

                                                    {seats.length > 0 ? (
                                                        <div className="flex flex-wrap gap-2 mt-2">
                                                            {seats.map(
                                                                (
                                                                    seat
                                                                ) => (
                                                                    <span
                                                                        key={
                                                                            seat
                                                                        }
                                                                        className="bg-orange-100 text-[#ff5a00] px-2.5 py-1 rounded-md text-xs font-bold"
                                                                    >
                                                                        {
                                                                            seat
                                                                        }
                                                                    </span>
                                                                )
                                                            )}
                                                        </div>
                                                    ) : (
                                                        <p className="text-sm text-gray-500 mt-1">
                                                            No seat information
                                                        </p>
                                                    )}
                                                </div>

                                                {/* PRICE + BUTTON */}
                                                <div className="flex items-center justify-between sm:justify-end gap-4">

                                                    <div>
                                                        <p className="text-xs text-gray-400">
                                                            Total Amount
                                                        </p>

                                                        <p className="text-xl sm:text-2xl font-bold text-[#ff5a00]">
                                                            ₹
                                                            {totalAmount.toLocaleString(
                                                                "en-IN"
                                                            )}
                                                        </p>
                                                    </div>

                                                    <button
                                                        onClick={() =>
                                                            navigate(
                                                                `/bookings/${booking.id}`
                                                            )
                                                        }
                                                        className="bg-black hover:bg-gray-800 text-white px-4 sm:px-5 py-2.5 rounded-lg text-sm font-semibold transition whitespace-nowrap"
                                                    >
                                                        View Details
                                                    </button>

                                                </div>

                                            </div>

                                            {/* CANCEL */}
                                            {status !==
                                                "CANCELLED" && (
                                                <div className="mt-4">

                                                    <button
                                                        onClick={() =>
                                                            handleCancel(
                                                                booking.id
                                                            )
                                                        }
                                                        className="text-red-500 hover:text-red-700 text-sm font-medium transition"
                                                    >
                                                        Cancel Booking
                                                    </button>

                                                </div>
                                            )}

                                        </div>

                                    </div>
                                </div>
                            );
                        })}

                    </div>
                )}
            </div>
        </div>
    );
};

export default MyBooking;