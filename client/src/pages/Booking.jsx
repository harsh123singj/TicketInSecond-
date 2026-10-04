import { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

const Booking = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    const [event, setEvent] = useState(null);
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [paymentMethod, setPaymentMethod] = useState("UPI");

    const [loading, setLoading] = useState(true);
    const [bookingLoading, setBookingLoading] = useState(false);
    const [error, setError] = useState("");

    // Get selected seats passed from SeatSelection
    useEffect(() => {
        if (location.state?.selectedSeats) {
            setSelectedSeats(location.state.selectedSeats);
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
                    error.message || "Failed to load event"
                );
            } finally {
                setLoading(false);
            }
        };

        fetchEvent();
    }, [id]);

    // ================= BOOKING =================
    const handleBooking = async () => {
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

            const response = await fetch(
                `${API_URL}/api/booking`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        eventId: Number(id),
                        seatNumber: selectedSeats.join(","),
                        paymentMethod,
                        ticketCount: selectedSeats.length
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Booking failed"
                );
            }

            // Go to booking details after successful booking
            if (data.booking?.id) {
                navigate(`/bookings/${data.booking.id}`);
            } else if (data.id) {
                navigate(`/bookings/${data.id}`);
            } else {
                navigate("/my-bookings");
            }

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
                    Loading booking details...
                </p>
            </div>
        );
    }

    // ================= ERROR =================
    if (!event) {
        return (
            <div className="min-h-screen bg-[#f7f5ef] flex items-center justify-center px-6">
                <div className="text-center">
                    <h2 className="text-2xl font-bold">
                        Event not found
                    </h2>

                    <button
                        onClick={() => navigate("/")}
                        className="mt-5 bg-[#ff5a00] text-white px-6 py-3 rounded-lg font-semibold"
                    >
                        Back to Home
                    </button>
                </div>
            </div>
        );
    }

    const totalAmount =
        selectedSeats.length *
        Number(event.ticketPrice || 0);

    return (
        <div className="min-h-screen bg-[#f7f5ef] px-6 py-12">

            <div className="max-w-5xl mx-auto">

                {/* HEADER */}
                <div className="mb-8">

                    <button
                        onClick={() =>
                            navigate(`/events/${id}/seats`)
                        }
                        className="text-gray-500 hover:text-black transition"
                    >
                        ← Back to Seat Selection
                    </button>

                    <p className="text-[#ff5a00] tracking-[4px] text-sm font-medium mt-6">
                        BOOKING
                    </p>

                    <h1 className="text-4xl font-bold mt-3">
                        Confirm Your Booking
                    </h1>

                    <p className="text-gray-500 mt-2">
                        Review your seats and complete your booking.
                    </p>

                </div>

                {/* ERROR */}
                {error && (
                    <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
                        {error}
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* EVENT DETAILS */}
                    <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm p-8">

                        <h2 className="text-2xl font-bold mb-6">
                            {event.name}
                        </h2>

                        <div className="space-y-4 text-gray-600">

                            <div>
                                <span className="font-semibold text-gray-900">
                                    Type:
                                </span>{" "}
                                {event.type}
                            </div>

                            <div>
                                <span className="font-semibold text-gray-900">
                                    Date:
                                </span>{" "}
                                {event.eventDate
                                    ? new Date(
                                          event.eventDate
                                      ).toLocaleDateString()
                                    : "N/A"}
                            </div>

                            <div>
                                <span className="font-semibold text-gray-900">
                                    Time:
                                </span>{" "}
                                {event.eventTime}
                            </div>

                            <div>
                                <span className="font-semibold text-gray-900">
                                    Venue:
                                </span>{" "}
                                {event.venueName}
                            </div>

                            <div>
                                <span className="font-semibold text-gray-900">
                                    Address:
                                </span>{" "}
                                {event.venueAddress}
                            </div>

                        </div>

                        {/* SELECTED SEATS */}
                        <div className="mt-8 pt-6 border-t">

                            <h3 className="text-lg font-bold mb-4">
                                Selected Seats
                            </h3>

                            {selectedSeats.length === 0 ? (
                                <p className="text-gray-500">
                                    No seats selected.
                                </p>
                            ) : (
                                <div className="flex flex-wrap gap-3">

                                    {selectedSeats.map((seat) => (
                                        <span
                                            key={seat}
                                            className="bg-orange-100 text-[#ff5a00] px-4 py-2 rounded-lg font-semibold"
                                        >
                                            {seat}
                                        </span>
                                    ))}

                                </div>
                            )}

                        </div>

                        {/* PAYMENT */}
                        <div className="mt-8 pt-6 border-t">

                            <h3 className="text-lg font-bold mb-4">
                                Payment Method
                            </h3>

                            <div className="space-y-3">

                                <label className="flex items-center gap-3 border rounded-lg p-4 cursor-pointer hover:bg-gray-50">

                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        value="UPI"
                                        checked={
                                            paymentMethod === "UPI"
                                        }
                                        onChange={(e) =>
                                            setPaymentMethod(
                                                e.target.value
                                            )
                                        }
                                    />

                                    <span className="font-medium">
                                        UPI
                                    </span>

                                </label>

                                <label className="flex items-center gap-3 border rounded-lg p-4 cursor-pointer hover:bg-gray-50">

                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        value="CARD"
                                        checked={
                                            paymentMethod === "CARD"
                                        }
                                        onChange={(e) =>
                                            setPaymentMethod(
                                                e.target.value
                                            )
                                        }
                                    />

                                    <span className="font-medium">
                                        Card
                                    </span>

                                </label>

                            </div>

                        </div>

                    </div>

                    {/* SUMMARY */}
                    <div className="bg-white rounded-2xl shadow-sm p-8 h-fit">

                        <h2 className="text-xl font-bold mb-6">
                            Booking Summary
                        </h2>

                        <div className="space-y-4">

                            <div className="flex justify-between text-gray-600">
                                <span>
                                    Tickets
                                </span>

                                <span>
                                    {selectedSeats.length}
                                </span>
                            </div>

                            <div className="flex justify-between text-gray-600">
                                <span>
                                    Price per ticket
                                </span>

                                <span>
                                    ₹{event.ticketPrice}
                                </span>
                            </div>

                            <div className="border-t pt-4 flex justify-between">

                                <span className="font-bold text-lg">
                                    Total
                                </span>

                                <span className="font-bold text-xl text-[#ff5a00]">
                                    ₹{totalAmount.toLocaleString(
                                        "en-IN"
                                    )}
                                </span>

                            </div>

                        </div>

                        <button
                            onClick={handleBooking}
                            disabled={
                                bookingLoading ||
                                selectedSeats.length === 0
                            }
                            className="w-full mt-8 bg-[#ff5a00] hover:bg-[#e65100] text-white py-3 rounded-lg font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {bookingLoading
                                ? "Processing..."
                                : "Confirm Booking"}
                        </button>

                    </div>

                </div>

            </div>

        </div>
    );
};

export default Booking;