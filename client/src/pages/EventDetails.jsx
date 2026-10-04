import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

const EventDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

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
                        data.message ||
                            "Failed to fetch event"
                    );
                }

                setEvent(data.event || data);

            } catch (error) {
                console.error(
                    "Fetch event error:",
                    error
                );

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

    // ================= LOADING =================

    if (loading) {
        return (
            <div className="min-h-screen bg-[#f7f5ef] flex items-center justify-center">
                <div className="text-center">
                    <div className="w-10 h-10 border-4 border-gray-200 border-t-[#ff5a00] rounded-full animate-spin mx-auto"></div>

                    <p className="mt-4 text-gray-500">
                        Loading event...
                    </p>
                </div>
            </div>
        );
    }

    // ================= ERROR =================

    if (error || !event) {
        return (
            <div className="min-h-screen bg-[#f7f5ef] flex items-center justify-center px-6">

                <div className="bg-white rounded-2xl shadow-sm p-10 text-center max-w-md w-full">

                    <div className="text-5xl mb-5">
                        ⚠️
                    </div>

                    <h1 className="text-2xl font-bold">
                        Event Not Found
                    </h1>

                    <p className="text-gray-500 mt-3">
                        {error ||
                            "The event you're looking for does not exist."}
                    </p>

                    <button
                        onClick={() =>
                            navigate("/")
                        }
                        className="mt-7 bg-[#ff5a00] hover:bg-[#e65100] text-white px-6 py-3 rounded-lg font-semibold transition"
                    >
                        Back to Events
                    </button>

                </div>

            </div>
        );
    }

    // ================= DATA =================

    const eventDate = event.eventDate
        ? new Date(
              event.eventDate
          ).toLocaleDateString("en-IN", {
              weekday: "long",
              day: "2-digit",
              month: "long",
              year: "numeric"
          })
        : "Date unavailable";

    const ticketPrice = Number(
        event.ticketPrice || 0
    );

    // ================= CONTINUE =================

    const handleBookNow = () => {
        const token = localStorage.getItem("token");

        if (!token) {
            navigate("/login");
            return;
        }

        navigate(`/events/${event.id}/seats`);
    };

    return (
        <div className="min-h-screen bg-[#f7f5ef]">

            {/* ================= HERO ================= */}

            <section className="bg-black text-white">

                <div className="max-w-7xl mx-auto px-6 py-16">

                    <button
                        onClick={() =>
                            navigate("/")
                        }
                        className="text-gray-400 hover:text-white transition mb-10"
                    >
                        ← Back to Events
                    </button>

                    <div className="max-w-4xl">

                        <p className="text-[#ff5a00] uppercase tracking-[4px] text-sm font-medium">
                            {event.type ||
                                "EVENT"}
                        </p>

                        <h1 className="text-4xl md:text-6xl font-bold mt-5 leading-tight">
                            {event.name}
                        </h1>

                    </div>

                </div>

            </section>

            {/* ================= CONTENT ================= */}

            <main className="max-w-7xl mx-auto px-6 py-12">

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* ================= EVENT INFORMATION ================= */}

                    <div className="lg:col-span-2">

                        <div className="bg-white rounded-2xl shadow-sm p-8">

                            <h2 className="text-2xl font-bold mb-8">
                                Event Information
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                                {/* DATE */}

                                <div className="flex gap-4">

                                    <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center text-xl">
                                        📅
                                    </div>

                                    <div>
                                        <p className="text-sm text-gray-500">
                                            Date
                                        </p>

                                        <p className="font-semibold mt-1">
                                            {eventDate}
                                        </p>
                                    </div>

                                </div>

                                {/* TIME */}

                                <div className="flex gap-4">

                                    <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center text-xl">
                                        🕐
                                    </div>

                                    <div>
                                        <p className="text-sm text-gray-500">
                                            Time
                                        </p>

                                        <p className="font-semibold mt-1">
                                            {event.eventTime ||
                                                "Time unavailable"}
                                        </p>
                                    </div>

                                </div>

                                {/* VENUE */}

                                <div className="flex gap-4">

                                    <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center text-xl">
                                        📍
                                    </div>

                                    <div>
                                        <p className="text-sm text-gray-500">
                                            Venue
                                        </p>

                                        <p className="font-semibold mt-1">
                                            {event.venueName ||
                                                "Venue unavailable"}
                                        </p>
                                    </div>

                                </div>

                                {/* ADDRESS */}

                                <div className="flex gap-4">

                                    <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center text-xl">
                                        🏠
                                    </div>

                                    <div>
                                        <p className="text-sm text-gray-500">
                                            Address
                                        </p>

                                        <p className="font-semibold mt-1">
                                            {event.venueAddress ||
                                                "Address unavailable"}
                                        </p>
                                    </div>

                                </div>

                            </div>

                            {/* DESCRIPTION */}

                            {event.description && (
                                <div className="border-t mt-10 pt-8">

                                    <h3 className="text-xl font-bold mb-4">
                                        About This Event
                                    </h3>

                                    <p className="text-gray-600 leading-7">
                                        {event.description}
                                    </p>

                                </div>
                            )}

                        </div>

                        {/* ================= TICKET INFORMATION ================= */}

                        <div className="bg-white rounded-2xl shadow-sm p-8 mt-8">

                            <h2 className="text-2xl font-bold mb-6">
                                Ticket Information
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                                <div className="border rounded-xl p-5">

                                    <p className="text-gray-500 text-sm">
                                        Ticket Price
                                    </p>

                                    <p className="text-2xl font-bold text-[#ff5a00] mt-2">
                                        ₹
                                        {ticketPrice.toLocaleString(
                                            "en-IN"
                                        )}
                                    </p>

                                </div>

                                <div className="border rounded-xl p-5">

                                    <p className="text-gray-500 text-sm">
                                        Total Tickets
                                    </p>

                                    <p className="text-2xl font-bold mt-2">
                                        {event.totalTickets ||
                                            0}
                                    </p>

                                </div>

                            </div>

                        </div>

                    </div>

                    {/* ================= BOOKING CARD ================= */}

                    <div className="lg:sticky lg:top-24 h-fit">

                        <div className="bg-white rounded-2xl shadow-sm p-8">

                            <p className="text-sm text-gray-500">
                                Starting from
                            </p>

                            <div className="flex items-baseline gap-1 mt-2">

                                <span className="text-4xl font-bold text-[#ff5a00]">
                                    ₹
                                    {ticketPrice.toLocaleString(
                                        "en-IN"
                                    )}
                                </span>

                                <span className="text-gray-500">
                                    /ticket
                                </span>

                            </div>

                            <div className="border-t my-7"></div>

                            <div className="space-y-4">

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
                                        Date
                                    </span>

                                    <span className="font-semibold text-right">
                                        {eventDate}
                                    </span>

                                </div>

                                <div className="flex justify-between">

                                    <span className="text-gray-500">
                                        Tickets
                                    </span>

                                    <span className="font-semibold">
                                        {event.totalTickets ||
                                            0}
                                    </span>

                                </div>

                            </div>

                            <button
                                onClick={handleBookNow}
                                className="w-full mt-8 bg-[#ff5a00] hover:bg-[#e65100] text-white py-4 rounded-xl font-semibold text-lg transition"
                            >
                                Select Seats
                            </button>

                            <p className="text-xs text-gray-400 text-center mt-4">
                                Select your seats and continue to checkout.
                            </p>

                        </div>

                    </div>

                </div>

            </main>

        </div>
    );
};

export default EventDetails;