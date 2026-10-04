import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

const SeatSelection = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [event, setEvent] = useState(null);
    const [seats, setSeats] = useState([]);
    const [selectedSeats, setSelectedSeats] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // ================= FETCH EVENT + SEATS =================

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError("");

                const [eventResponse, seatsResponse] =
                    await Promise.all([
                        fetch(
                            `${API_URL}/api/events/${id}`
                        ),
                        fetch(
                            `${API_URL}/api/events/${id}/seats`
                        )
                    ]);

                const eventData =
                    await eventResponse.json();

                const seatsData =
                    await seatsResponse.json();

                if (!eventResponse.ok) {
                    throw new Error(
                        eventData.message ||
                            "Failed to fetch event"
                    );
                }

                if (!seatsResponse.ok) {
                    throw new Error(
                        seatsData.message ||
                            "Failed to fetch seats"
                    );
                }

                setEvent(
                    eventData.event ||
                        eventData
                );

                setSeats(
                    seatsData.seats ||
                        seatsData ||
                        []
                );

            } catch (error) {
                console.error(
                    "Fetch seat data error:",
                    error
                );

                setError(
                    error.message ||
                        "Failed to load seats"
                );
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    // ================= SEAT SELECTION =================

    const handleSeatClick = (seat) => {
        const status =
            seat.status?.toUpperCase();

        if (status !== "AVAILABLE") {
            return;
        }

        const seatNumber = seat.seatNumber;

        setSelectedSeats((previous) => {
            if (
                previous.includes(seatNumber)
            ) {
                return previous.filter(
                    (item) =>
                        item !== seatNumber
                );
            }

            return [
                ...previous,
                seatNumber
            ];
        });
    };

    // ================= CONTINUE =================

    const handleContinue = () => {
        if (selectedSeats.length === 0) {
            setError(
                "Please select at least one seat."
            );
            return;
        }

        const token =
            localStorage.getItem("token");

        if (!token) {
            navigate("/login");
            return;
        }

        navigate(
            `/events/${id}/checkout`,
            {
                state: {
                    selectedSeats
                }
            }
        );
    };

    // ================= SEAT STYLE =================

    const getSeatClass = (seat) => {
        const status =
            seat.status?.toUpperCase();

        const isSelected =
            selectedSeats.includes(
                seat.seatNumber
            );

        if (isSelected) {
            return "bg-[#ff5a00] text-white border-[#ff5a00] hover:bg-[#e65100]";
        }

        if (
            status === "BOOKED" ||
            status === "UNAVAILABLE"
        ) {
            return "bg-gray-300 text-gray-500 border-gray-300 cursor-not-allowed";
        }

        if (status === "LOCKED") {
            return "bg-yellow-200 text-yellow-700 border-yellow-300 cursor-not-allowed";
        }

        return "bg-white text-gray-700 border-gray-300 hover:border-[#ff5a00] hover:text-[#ff5a00]";
    };

    // ================= LOADING =================

    if (loading) {
        return (
            <div className="min-h-screen bg-[#f7f5ef] flex items-center justify-center">

                <div className="text-center">

                    <div className="w-10 h-10 border-4 border-gray-200 border-t-[#ff5a00] rounded-full animate-spin mx-auto"></div>

                    <p className="mt-4 text-gray-500">
                        Loading seats...
                    </p>

                </div>

            </div>
        );
    }

    // ================= ERROR / EVENT =================

    if (!event) {
        return (
            <div className="min-h-screen bg-[#f7f5ef] flex items-center justify-center px-6">

                <div className="bg-white rounded-2xl shadow-sm p-10 text-center max-w-md w-full">

                    <h2 className="text-2xl font-bold">
                        Unable to load event
                    </h2>

                    <p className="text-gray-500 mt-3">
                        {error ||
                            "Event not found."}
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

    const totalAmount =
        selectedSeats.length *
        Number(event.ticketPrice || 0);

    return (
        <div className="min-h-screen bg-[#f7f5ef] px-6 py-10">

            <div className="max-w-7xl mx-auto">

                {/* ================= HEADER ================= */}

                <div className="mb-8">

                    <button
                        onClick={() =>
                            navigate(
                                `/events/${id}`
                            )
                        }
                        className="text-gray-500 hover:text-black transition"
                    >
                        ← Back to Event
                    </button>

                    <p className="text-[#ff5a00] tracking-[4px] text-sm font-medium mt-6">
                        SELECT SEATS
                    </p>

                    <h1 className="text-4xl font-bold mt-3">
                        {event.name}
                    </h1>

                    <p className="text-gray-500 mt-2">
                        Choose your seats and continue to checkout.
                    </p>

                </div>

                {/* ================= ERROR ================= */}

                {error && (
                    <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-5 py-4 rounded-xl">
                        {error}
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

                    {/* ================= SEAT AREA ================= */}

                    <div className="lg:col-span-3 bg-white rounded-2xl shadow-sm p-6 md:p-10">

                        {/* SCREEN */}

                        <div className="mb-12">

                            <div className="w-full max-w-2xl mx-auto">

                                <div className="h-2 bg-black rounded-full"></div>

                                <p className="text-center text-gray-400 text-sm mt-3 tracking-widest">
                                    SCREEN
                                </p>

                            </div>

                        </div>

                        {/* LEGEND */}

                        <div className="flex flex-wrap justify-center gap-6 mb-10 text-sm">

                            <div className="flex items-center gap-2">
                                <span className="w-5 h-5 bg-white border border-gray-300 rounded"></span>
                                Available
                            </div>

                            <div className="flex items-center gap-2">
                                <span className="w-5 h-5 bg-[#ff5a00] rounded"></span>
                                Selected
                            </div>

                            <div className="flex items-center gap-2">
                                <span className="w-5 h-5 bg-gray-300 rounded"></span>
                                Booked
                            </div>

                            <div className="flex items-center gap-2">
                                <span className="w-5 h-5 bg-yellow-200 rounded"></span>
                                Locked
                            </div>

                        </div>

                        {/* ================= SEATS ================= */}

                        {seats.length === 0 ? (

                            <div className="py-16 text-center">

                                <p className="text-gray-500">
                                    No seats available for this event.
                                </p>

                            </div>

                        ) : (

                            <div className="overflow-x-auto">

                                <div className="min-w-[600px]">

                                    <div className="grid grid-cols-10 gap-3 max-w-4xl mx-auto">

                                        {seats.map(
                                            (
                                                seat
                                            ) => (
                                                <button
                                                    key={
                                                        seat.id ||
                                                        seat.seatNumber
                                                    }
                                                    type="button"
                                                    onClick={() =>
                                                        handleSeatClick(
                                                            seat
                                                        )
                                                    }
                                                    disabled={
                                                        seat.status?.toUpperCase() !==
                                                        "AVAILABLE"
                                                    }
                                                    className={`h-10 rounded-lg border text-xs sm:text-sm font-semibold transition ${getSeatClass(
                                                        seat
                                                    )}`}
                                                >
                                                    {
                                                        seat.seatNumber
                                                    }
                                                </button>
                                            )
                                        )}

                                    </div>

                                </div>

                            </div>

                        )}

                    </div>

                    {/* ================= SUMMARY ================= */}

                    <div className="bg-white rounded-2xl shadow-sm p-7 h-fit lg:sticky lg:top-24">

                        <h2 className="text-xl font-bold mb-6">
                            Booking Summary
                        </h2>

                        <div className="space-y-5">

                            <div>

                                <p className="text-sm text-gray-500">
                                    Event
                                </p>

                                <p className="font-semibold mt-1">
                                    {event.name}
                                </p>

                            </div>

                            <div>

                                <p className="text-sm text-gray-500">
                                    Ticket Price
                                </p>

                                <p className="font-semibold mt-1">
                                    ₹
                                    {Number(
                                        event.ticketPrice ||
                                            0
                                    ).toLocaleString(
                                        "en-IN"
                                    )}
                                </p>

                            </div>

                            <div>

                                <p className="text-sm text-gray-500">
                                    Selected Seats
                                </p>

                                {selectedSeats.length ===
                                0 ? (
                                    <p className="text-gray-400 mt-1">
                                        No seats selected
                                    </p>
                                ) : (
                                    <div className="flex flex-wrap gap-2 mt-2">

                                        {selectedSeats.map(
                                            (
                                                seat
                                            ) => (
                                                <span
                                                    key={
                                                        seat
                                                    }
                                                    className="bg-orange-100 text-[#ff5a00] px-3 py-1.5 rounded-lg text-sm font-semibold"
                                                >
                                                    {
                                                        seat
                                                    }
                                                </span>
                                            )
                                        )}

                                    </div>
                                )}

                            </div>

                            <div className="border-t pt-5">

                                <div className="flex justify-between">

                                    <span className="font-bold">
                                        Tickets
                                    </span>

                                    <span className="font-semibold">
                                        {
                                            selectedSeats.length
                                        }
                                    </span>

                                </div>

                                <div className="flex justify-between mt-3">

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
                                handleContinue
                            }
                            disabled={
                                selectedSeats.length ===
                                0
                            }
                            className="w-full mt-7 bg-[#ff5a00] hover:bg-[#e65100] text-white py-4 rounded-xl font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Continue to Checkout
                        </button>

                    </div>

                </div>

            </div>

        </div>
    );
};

export default SeatSelection;