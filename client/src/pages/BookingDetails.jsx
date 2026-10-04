import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

const BookingDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [booking, setBooking] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [cancelling, setCancelling] = useState(false);

    // ================= FETCH BOOKING =================
    useEffect(() => {
        const fetchBooking = async () => {
            try {
                setLoading(true);
                setError("");

                const token = localStorage.getItem("token");

                if (!token) {
                    navigate("/login");
                    return;
                }

                const response = await fetch(
                    `${API_URL}/api/booking/${id}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(
                        data.message || "Failed to fetch booking"
                    );
                }

                setBooking(data.booking || data);

            } catch (error) {
                console.error(
                    "Fetch booking error:",
                    error
                );

                setError(
                    error.message ||
                        "Failed to load booking details"
                );
            } finally {
                setLoading(false);
            }
        };

        fetchBooking();
    }, [id, navigate]);


    // ================= CANCEL BOOKING =================
    const handleCancel = async () => {
        const confirmed = window.confirm(
            "Are you sure you want to cancel this booking?"
        );

        if (!confirmed) {
            return;
        }

        try {
            setCancelling(true);
            setError("");

            const token = localStorage.getItem("token");

            const response = await fetch(
                `${API_URL}/api/booking/${id}/cancel`,
                {
                    method: "PATCH",
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                        "Failed to cancel booking"
                );
            }

            setBooking(
                data.booking || {
                    ...booking,
                    status: "CANCELLED"
                }
            );

        } catch (error) {
            console.error(
                "Cancel booking error:",
                error
            );

            setError(
                error.message ||
                    "Failed to cancel booking"
            );
        } finally {
            setCancelling(false);
        }
    };


    // ================= LOADING =================
    if (loading) {
        return (
            <div className="min-h-screen bg-[#f7f5ef] flex items-center justify-center">
                <p className="text-lg text-gray-600">
                    Loading booking...
                </p>
            </div>
        );
    }


    // ================= ERROR =================
    if (error && !booking) {
        return (
            <div className="min-h-screen bg-[#f7f5ef] flex items-center justify-center px-6">

                <div className="bg-white rounded-2xl shadow-sm p-8 text-center max-w-md w-full">

                    <div className="text-5xl mb-5">
                        ⚠️
                    </div>

                    <h2 className="text-2xl font-bold">
                        Booking Not Found
                    </h2>

                    <p className="text-gray-500 mt-3">
                        {error}
                    </p>

                    <button
                        onClick={() =>
                            navigate("/my-bookings")
                        }
                        className="mt-6 bg-[#ff5a00] hover:bg-[#e65100] text-white px-6 py-3 rounded-lg font-semibold transition"
                    >
                        My Bookings
                    </button>

                </div>

            </div>
        );
    }


    if (!booking) {
        return null;
    }


    // ================= DATA =================

    const event = booking.event;

    const bookingDate = booking.createdAt
        ? new Date(
              booking.createdAt
          ).toLocaleDateString("en-IN", {
              day: "2-digit",
              month: "short",
              year: "numeric"
          })
        : "N/A";

    const eventDate = event?.eventDate
        ? new Date(
              event.eventDate
          ).toLocaleDateString("en-IN", {
              day: "2-digit",
              month: "short",
              year: "numeric"
          })
        : "N/A";

    const status =
        booking.status?.toUpperCase() || "PENDING";

    const isCancelled =
        status === "CANCELLED";

    return (
        <div className="min-h-screen bg-[#f7f5ef] px-6 py-12">

            <div className="max-w-5xl mx-auto">

                {/* ================= HEADER ================= */}

                <div className="mb-8">

                    <Link
                        to="/my-bookings"
                        className="text-gray-500 hover:text-black transition"
                    >
                        ← Back to My Bookings
                    </Link>

                    <p className="text-[#ff5a00] tracking-[4px] text-sm font-medium mt-6">
                        BOOKING DETAILS
                    </p>

                    <h1 className="text-4xl font-bold mt-3">
                        Your Booking
                    </h1>

                    <p className="text-gray-500 mt-2">
                        Booking ID: #{booking.id}
                    </p>

                </div>


                {/* ERROR */}

                {error && (
                    <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
                        {error}
                    </div>
                )}


                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* ================= EVENT CARD ================= */}

                    <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm overflow-hidden">

                        {/* Event Header */}

                        <div className="bg-black text-white p-8">

                            <p className="text-[#ff5a00] uppercase text-sm tracking-widest">
                                {event?.type || "EVENT"}
                            </p>

                            <h2 className="text-3xl font-bold mt-3">
                                {event?.name ||
                                    "Event"}
                            </h2>

                        </div>


                        {/* Event Information */}

                        <div className="p-8">

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                                <div>
                                    <p className="text-sm text-gray-500">
                                        Date
                                    </p>

                                    <p className="font-semibold text-lg mt-1">
                                        {eventDate}
                                    </p>
                                </div>


                                <div>
                                    <p className="text-sm text-gray-500">
                                        Time
                                    </p>

                                    <p className="font-semibold text-lg mt-1">
                                        {event?.eventTime ||
                                            "N/A"}
                                    </p>
                                </div>


                                <div>
                                    <p className="text-sm text-gray-500">
                                        Venue
                                    </p>

                                    <p className="font-semibold mt-1">
                                        {event?.venueName ||
                                            "N/A"}
                                    </p>
                                </div>


                                <div>
                                    <p className="text-sm text-gray-500">
                                        Address
                                    </p>

                                    <p className="font-semibold mt-1">
                                        {event?.venueAddress ||
                                            "N/A"}
                                    </p>
                                </div>

                            </div>


                            {/* Seats */}

                            <div className="border-t mt-8 pt-8">

                                <p className="text-sm text-gray-500 mb-3">
                                    Selected Seats
                                </p>

                                <div className="flex flex-wrap gap-3">

                                    {booking.seatNumber
                                        ?.split(",")
                                        .map((seat) => (
                                            <span
                                                key={seat}
                                                className="bg-orange-100 text-[#ff5a00] px-4 py-2 rounded-lg font-semibold"
                                            >
                                                {seat.trim()}
                                            </span>
                                        ))}

                                </div>

                            </div>

                        </div>

                    </div>


                    {/* ================= BOOKING SUMMARY ================= */}

                    <div className="bg-white rounded-2xl shadow-sm p-8 h-fit">

                        <h2 className="text-xl font-bold mb-6">
                            Booking Summary
                        </h2>


                        {/* Status */}

                        <div className="mb-6">

                            <p className="text-sm text-gray-500 mb-2">
                                Status
                            </p>

                            <span
                                className={`inline-block px-4 py-2 rounded-full text-sm font-semibold ${
                                    isCancelled
                                        ? "bg-red-100 text-red-600"
                                        : status ===
                                          "CONFIRMED"
                                        ? "bg-green-100 text-green-600"
                                        : "bg-yellow-100 text-yellow-700"
                                }`}
                            >
                                {status}
                            </span>

                        </div>


                        {/* Ticket Count */}

                        <div className="flex justify-between py-3 border-b">

                            <span className="text-gray-500">
                                Tickets
                            </span>

                            <span className="font-semibold">
                                {booking.ticketCount ||
                                    0}
                            </span>

                        </div>


                        {/* Payment Method */}

                        <div className="flex justify-between py-3 border-b">

                            <span className="text-gray-500">
                                Payment
                            </span>

                            <span className="font-semibold">
                                {booking.paymentMethod ||
                                    "N/A"}
                            </span>

                        </div>


                        {/* Booking Date */}

                        <div className="flex justify-between py-3 border-b">

                            <span className="text-gray-500">
                                Booked On
                            </span>

                            <span className="font-semibold">
                                {bookingDate}
                            </span>

                        </div>


                        {/* Total */}

                        <div className="flex justify-between pt-6">

                            <span className="text-lg font-bold">
                                Total
                            </span>

                            <span className="text-xl font-bold text-[#ff5a00]">
                                ₹
                                {(
                                    Number(
                                        event?.ticketPrice ||
                                            0
                                    ) *
                                    Number(
                                        booking.ticketCount ||
                                            0
                                    )
                                ).toLocaleString(
                                    "en-IN"
                                )}
                            </span>

                        </div>


                        {/* Cancel */}

                        {!isCancelled && (
                            <button
                                onClick={handleCancel}
                                disabled={cancelling}
                                className="w-full mt-8 border border-red-500 text-red-500 hover:bg-red-50 py-3 rounded-lg font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {cancelling
                                    ? "Cancelling..."
                                    : "Cancel Booking"}
                            </button>
                        )}

                    </div>

                </div>

            </div>

        </div>
    );
};

export default BookingDetails;