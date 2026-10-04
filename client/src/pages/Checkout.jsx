import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

const Checkout = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    const [event, setEvent] = useState(null);
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [paymentMethod, setPaymentMethod] = useState("UPI");

    const [loading, setLoading] = useState(true);
    const [bookingLoading, setBookingLoading] = useState(false);
    const [error, setError] = useState("");

    // ================= GET SELECTED SEATS =================

    useEffect(() => {
        const seats = location.state?.selectedSeats;

        if (seats && Array.isArray(seats)) {
            setSelectedSeats(seats);
        }
    }, [location.state]);

    // ================= FETCH EVENT =================

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await fetch(
                    `${API_URL}/api/events/${id}`
                );

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(
                        data.message || "Failed to fetch event"
                    );
                }

                setEvent(data.event || data);
            } catch (error) {
                console.error("Fetch event error:", error);

                setError(
                    error.message ||
                        "Failed to load event"
                );
            } finally {
                setLoading(false);
            }
        };

        fetchEvent();
    }, [id]);

    // ================= CONFIRM BOOKING =================

    const handleConfirmBooking = async () => {
    if (selectedSeats.length === 0) {
        setError("Please select at least one seat.");
        return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
        navigate("/login");
        return;
    }

    try {
        setBookingLoading(true);
        setError("");

        const bookings = [];

        // Create one booking for each selected seat
        for (const seatNumber of selectedSeats) {

            const bookingPayload = {
                eventId: Number(id),
                seatNumber: seatNumber,
                paymentMethod: paymentMethod
            };

            console.log("Booking payload:", bookingPayload);

            const response = await fetch(
                `${API_URL}/api/booking`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },

                    body: JSON.stringify(bookingPayload)
                }
            );

            const data = await response.json();

            console.log("Booking response:", data);

            if (!response.ok) {
                throw new Error(
                    data.message || "Booking failed"
                );
            }

            bookings.push(data);
        }

        console.log("All bookings created:", bookings);

        // Go to My Bookings after all seats are booked
        navigate("/my-bookings");

    } catch (error) {
        console.error("Booking error:", error);

        setError(
            error.message || "Failed to create booking"
        );

    } finally {
        setBookingLoading(false);
    }
};

    // ================= LOADING =================

    if (loading) {
        return (
            <div className="min-h-screen bg-[#f7f5ef] flex items-center justify-center">
                <p className="text-lg text-gray-600">
                    Loading checkout...
                </p>
            </div>
        );
    }

    // ================= EVENT NOT FOUND =================

    if (!event) {
        return (
            <div className="min-h-screen bg-[#f7f5ef] flex items-center justify-center px-6">
                <div className="text-center">

                    <h2 className="text-2xl font-bold">
                        Event not found
                    </h2>

                    <p className="text-gray-500 mt-2">
                        {error}
                    </p>

                    <button
                        onClick={() =>
                            navigate("/")
                        }
                        className="mt-6 bg-[#ff5a00] text-white px-6 py-3 rounded-lg font-semibold"
                    >
                        Back to Home
                    </button>

                </div>
            </div>
        );
    }

    // ================= TOTAL =================

    const ticketPrice =
        Number(event.ticketPrice || 0);

    const ticketCount =
        selectedSeats.length;

    const totalAmount =
        ticketPrice * ticketCount;

    return (
        <div className="min-h-screen bg-[#f7f5ef] px-6 py-12">

            <div className="max-w-6xl mx-auto">

                {/* ================= HEADER ================= */}

                <div className="mb-10">

                    <button
                        onClick={() =>
                            navigate(
                                `/events/${id}/seats`
                            )
                        }
                        className="text-gray-500 hover:text-black transition"
                    >
                        ← Back to Seat Selection
                    </button>

                    <p className="text-[#ff5a00] tracking-[4px] text-sm font-medium mt-6">
                        CHECKOUT
                    </p>

                    <h1 className="text-4xl font-bold mt-3">
                        Complete Your Booking
                    </h1>

                    <p className="text-gray-500 mt-2">
                        Review your booking before confirming.
                    </p>

                </div>

                {/* ================= ERROR ================= */}

                {error && (
                    <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-5 py-4 rounded-xl">
                        {error}
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* ================= LEFT ================= */}

                    <div className="lg:col-span-2 space-y-6">

                        {/* EVENT DETAILS */}

                        <div className="bg-white rounded-2xl shadow-sm p-8">

                            <h2 className="text-2xl font-bold">
                                {event.name}
                            </h2>

                            <p className="text-[#ff5a00] uppercase text-sm font-semibold mt-2">
                                {event.type}
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-7">

                                <div>
                                    <p className="text-gray-500 text-sm">
                                        Date
                                    </p>

                                    <p className="font-semibold mt-1">
                                        {event.eventDate
                                            ? new Date(
                                                  event.eventDate
                                              ).toLocaleDateString(
                                                  "en-IN",
                                                  {
                                                      day: "2-digit",
                                                      month: "short",
                                                      year: "numeric"
                                                  }
                                              )
                                            : "N/A"}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-gray-500 text-sm">
                                        Time
                                    </p>

                                    <p className="font-semibold mt-1">
                                        {event.eventTime ||
                                            "N/A"}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-gray-500 text-sm">
                                        Venue
                                    </p>

                                    <p className="font-semibold mt-1">
                                        {event.venueName ||
                                            "N/A"}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-gray-500 text-sm">
                                        Address
                                    </p>

                                    <p className="font-semibold mt-1">
                                        {event.venueAddress ||
                                            "N/A"}
                                    </p>
                                </div>

                            </div>

                        </div>

                        {/* SELECTED SEATS */}

                        <div className="bg-white rounded-2xl shadow-sm p-8">

                            <h2 className="text-xl font-bold mb-5">
                                Selected Seats
                            </h2>

                            {selectedSeats.length === 0 ? (
                                <div className="text-gray-500">
                                    No seats selected.
                                </div>
                            ) : (
                                <div className="flex flex-wrap gap-3">

                                    {selectedSeats.map(
                                        (seat) => (
                                            <span
                                                key={seat}
                                                className="px-4 py-2 bg-orange-100 text-[#ff5a00] rounded-lg font-semibold"
                                            >
                                                {seat}
                                            </span>
                                        )
                                    )}

                                </div>
                            )}

                        </div>

                        {/* PAYMENT */}

                        <div className="bg-white rounded-2xl shadow-sm p-8">

                            <h2 className="text-xl font-bold mb-5">
                                Payment Method
                            </h2>

                            <div className="space-y-4">

                                <label
                                    className={`flex items-center gap-4 border rounded-xl p-5 cursor-pointer transition ${
                                        paymentMethod === "UPI"
                                            ? "border-[#ff5a00] bg-orange-50"
                                            : "border-gray-200 hover:bg-gray-50"
                                    }`}
                                >

                                    <input
                                        type="radio"
                                        name="payment"
                                        value="UPI"
                                        checked={
                                            paymentMethod ===
                                            "UPI"
                                        }
                                        onChange={(e) =>
                                            setPaymentMethod(
                                                e.target.value
                                            )
                                        }
                                        className="accent-[#ff5a00]"
                                    />

                                    <div>
                                        <p className="font-semibold">
                                            UPI
                                        </p>

                                        <p className="text-sm text-gray-500">
                                            Pay using UPI
                                        </p>
                                    </div>

                                </label>

                                <label
                                    className={`flex items-center gap-4 border rounded-xl p-5 cursor-pointer transition ${
                                        paymentMethod === "CARD"
                                            ? "border-[#ff5a00] bg-orange-50"
                                            : "border-gray-200 hover:bg-gray-50"
                                    }`}
                                >

                                    <input
                                        type="radio"
                                        name="payment"
                                        value="CARD"
                                        checked={
                                            paymentMethod ===
                                            "CARD"
                                        }
                                        onChange={(e) =>
                                            setPaymentMethod(
                                                e.target.value
                                            )
                                        }
                                        className="accent-[#ff5a00]"
                                    />

                                    <div>
                                        <p className="font-semibold">
                                            Card
                                        </p>

                                        <p className="text-sm text-gray-500">
                                            Pay using debit or credit card
                                        </p>
                                    </div>

                                </label>

                            </div>

                        </div>

                    </div>

                    {/* ================= RIGHT SUMMARY ================= */}

                    <div className="bg-white rounded-2xl shadow-sm p-8 h-fit lg:sticky lg:top-24">

                        <h2 className="text-xl font-bold mb-7">
                            Order Summary
                        </h2>

                        <div className="space-y-5">

                            <div className="flex justify-between">
                                <span className="text-gray-500">
                                    Event
                                </span>

                                <span className="font-semibold text-right max-w-[180px]">
                                    {event.name}
                                </span>
                            </div>

                            <div className="flex justify-between">
                                <span className="text-gray-500">
                                    Tickets
                                </span>

                                <span className="font-semibold">
                                    {ticketCount}
                                </span>
                            </div>

                            <div className="flex justify-between">
                                <span className="text-gray-500">
                                    Price
                                </span>

                                <span className="font-semibold">
                                    ₹
                                    {ticketPrice.toLocaleString(
                                        "en-IN"
                                    )}
                                </span>
                            </div>

                            <div className="border-t pt-5">

                                <div className="flex justify-between">

                                    <span className="text-lg font-bold">
                                        Total
                                    </span>

                                    <span className="text-xl font-bold text-[#ff5a00]">
                                        ₹
                                        {totalAmount.toLocaleString(
                                            "en-IN"
                                        )}
                                    </span>

                                </div>

                            </div>

                        </div>

                        <button
                            onClick={
                                handleConfirmBooking
                            }
                            disabled={
                                bookingLoading ||
                                ticketCount === 0
                            }
                            className="w-full mt-8 bg-[#ff5a00] hover:bg-[#e65100] text-white py-4 rounded-xl font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {bookingLoading
                                ? "Processing..."
                                : `Confirm Booking • ₹${totalAmount.toLocaleString(
                                      "en-IN"
                                  )}`}
                        </button>

                        <p className="text-xs text-gray-400 text-center mt-4">
                            By confirming, you agree to the booking terms.
                        </p>

                    </div>

                </div>

            </div>

        </div>
    );
};

export default Checkout;